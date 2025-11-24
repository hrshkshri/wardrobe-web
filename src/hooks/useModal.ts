import { useContext } from 'react';
import { ModalContext } from '@/contexts/ModalContext';

/**
 * Hook to control modals
 * @example
 * const modal = useModal();
 * modal.openModal({
 *   title: 'Confirm Delete',
 *   description: 'Are you sure you want to delete this item?',
 *   content: <p>This action cannot be undone.</p>,
 *   actions: [
 *     { label: 'Cancel', onClick: () => {} },
 *     { label: 'Delete', variant: 'destructive', onClick: async () => {
 *       await deleteItem();
 *       modal.closeModal(id);
 *     }}
 *   ]
 * });
 */
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};
