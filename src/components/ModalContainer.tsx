import React from 'react';
import { useContext } from 'react';
import { ModalContext } from '@/contexts/ModalContext';
import { Modal } from './Modal';

/**
 * Container component that renders all open modals
 * Add this component once in your App.tsx
 */
export const ModalContainer: React.FC = () => {
  const context = useContext(ModalContext);

  if (!context || context.modals.length === 0) {
    return null;
  }

  return (
    <>
      {context.modals.map((modal) => (
        <Modal
          key={modal.id}
          {...modal}
          onClose={() => context.closeModal(modal.id)}
        />
      ))}
    </>
  );
};
