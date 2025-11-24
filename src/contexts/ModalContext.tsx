import React, { useState, useCallback, ReactNode } from 'react';
import { ModalContext, ModalConfig } from './Modal.context';

export type { ModalConfig };
export { ModalContext };

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [modals, setModals] = useState<ModalConfig[]>([]);

  const openModal = useCallback((config: Omit<ModalConfig, 'id'>): string => {
    const id = `modal-${Date.now()}-${Math.random()}`;
    setModals((prev) => [...prev, { ...config, id }]);
    return id;
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals((prev) => {
      const modal = prev.find((m) => m.id === id);
      modal?.onClose?.();
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  const closeAll = useCallback(() => {
    setModals((prev) => {
      prev.forEach((modal) => modal.onClose?.());
      return [];
    });
  }, []);

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal, closeAll }}>
      {children}
    </ModalContext.Provider>
  );
};
