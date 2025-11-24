import React, { useState, useEffect, useCallback } from 'react';
import { ModalConfig } from '@/contexts/Modal.context';

interface ModalProps extends ModalConfig {
  onClose: () => void;
}

const sizeClasses = {
  sm: 'w-full max-w-sm',
  md: 'w-full max-w-md',
  lg: 'w-full max-w-lg',
  xl: 'w-full max-w-2xl',
};

const variantClasses = {
  default: 'bg-blue-500 hover:bg-blue-600 text-white',
  destructive: 'bg-red-500 hover:bg-red-600 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
};

export const Modal: React.FC<ModalProps> = ({
  title,
  description,
  content,
  actions,
  onClose,
  size = 'md',
  closeOnEsc = true,
  closeOnBackdropClick = true,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 150);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleActionClick = async (action: NonNullable<typeof actions>[0]) => {
    setIsLoading(action.label);
    try {
      await action.onClick();
    } finally {
      setIsLoading(null);
    }
  };

  useEffect(() => {
    if (!closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeOnEsc, handleClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-150 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`${sizeClasses[size]} rounded-lg bg-white shadow-lg transition-all duration-150 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Header */}
        {(title || description) && (
          <div className="border-b border-gray-200 px-6 py-4">
            {title && (
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4">{content}</div>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-end gap-3">
              {actions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleActionClick(action)}
                  disabled={isLoading !== null}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    variantClasses[action.variant || 'default']
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading === action.label ? 'Loading...' : action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          aria-label="Close modal"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
