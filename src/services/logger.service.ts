type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class LoggerService {
  private isDevelopment: boolean;
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
  }

  private addLog(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    this.logs.push(entry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output in development
    if (this.isDevelopment) {
      const style = this.getConsoleStyle(level);
      console.log(`%c[${level.toUpperCase()}] ${message}`, style, data);
    }

    // Send to error tracking in production (e.g., Sentry)
    if (!this.isDevelopment && level === 'error') {
      this.reportError(message, data);
    }
  }

  private getConsoleStyle(level: LogLevel): string {
    const styles: Record<LogLevel, string> = {
      debug: 'color: #7c3aed; font-weight: bold;',
      info: 'color: #3b82f6; font-weight: bold;',
      warn: 'color: #f59e0b; font-weight: bold;',
      error: 'color: #ef4444; font-weight: bold;',
    };
    return styles[level];
  }

  private reportError(): void {
    // TODO: Integrate with Sentry or similar error tracking service
    // Example:
    // Sentry.captureException(new Error(message), { extra: data });
  }

  debug(message: string, data?: unknown): void {
    this.addLog('debug', message, data);
  }

  info(message: string, data?: unknown): void {
    this.addLog('info', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.addLog('warn', message, data);
  }

  error(message: string, data?: unknown): void {
    this.addLog('error', message, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new LoggerService();
