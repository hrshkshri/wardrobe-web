import { createContext, ReactNode } from 'react';

export interface ModalConfig {
  id: string;
  title?: string;
  description?: string;
  content: ReactNode;
  actions?: Array<{
    label: string;
    variant?: 'default' | 'destructive' | 'secondary';
    onClick: () => void | Promise<void>;
  }>;
  onClose?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnEsc?: boolean;
  closeOnBackdropClick?: boolean;
}

export interface ModalContextType {
  modals: ModalConfig[];
  openModal: (config: Omit<ModalConfig, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAll: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);
