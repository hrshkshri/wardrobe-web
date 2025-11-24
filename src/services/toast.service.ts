import { toast } from 'sonner';

interface ToastOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

class ToastService {
  /**
   * Show a success toast
   * @example
   * toastService.success('Item created successfully');
   */
  success(message: string, options?: ToastOptions) {
    return toast.success(message, {
      duration: options?.duration || 3000,
      description: options?.description,
      action: options?.action,
    });
  }

  /**
   * Show an error toast
   * @example
   * toastService.error('Failed to create item', { description: 'Please try again' });
   */
  error(message: string, options?: ToastOptions) {
    return toast.error(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action,
    });
  }

  /**
   * Show an info toast
   * @example
   * toastService.info('New feature available');
   */
  info(message: string, options?: ToastOptions) {
    return toast.info(message, {
      duration: options?.duration || 3000,
      description: options?.description,
      action: options?.action,
    });
  }

  /**
   * Show a warning toast
   * @example
   * toastService.warning('This action cannot be undone');
   */
  warning(message: string, options?: ToastOptions) {
    return toast.warning(message, {
      duration: options?.duration || 3500,
      description: options?.description,
      action: options?.action,
    });
  }

  /**
   * Show a loading toast
   * @example
   * const toastId = toastService.loading('Processing...');
   * // Later: toastService.success('Done!', { id: toastId });
   */
  loading(message: string, options?: ToastOptions) {
    return toast.loading(message, {
      duration: options?.duration,
      description: options?.description,
    });
  }

  /**
   * Dismiss a specific toast
   * @example
   * toastService.dismiss(toastId);
   */
  dismiss(toastId: string | number) {
    return toast.dismiss(toastId);
  }

  /**
   * Dismiss all toasts
   * @example
   * toastService.dismissAll();
   */
  dismissAll() {
    return toast.dismiss();
  }

  /**
   * Show a promise-based toast
   * @example
   * toastService.promise(
   *   fetch('/api/items'),
   *   {
   *     loading: 'Loading...',
   *     success: 'Items loaded!',
   *     error: 'Failed to load items'
   *   }
   * );
   */
  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  }
}

export const toastService = new ToastService();
