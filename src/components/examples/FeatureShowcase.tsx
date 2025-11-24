/**
 * Example component showcasing all advanced features:
 * - Toast Notifications
 * - Modal/Dialog System
 * - Dark Mode Toggle
 * - Token Refresh
 *
 * This is a reference implementation - adapt to your needs
 */

import React, { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { useModal } from '@/hooks/useModal';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useRefreshToken } from '@/hooks/useRefreshToken';

export const FeatureShowcase: React.FC = () => {
  const toast = useToast();
  const modal = useModal();
  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const { refreshToken, isRefreshing } = useRefreshToken();
  const [demoCount, setDemoCount] = useState(0);

  // Toast Examples
  const showSuccessToast = () => {
    toast.success('Success!', {
      description: 'This is a success notification',
    });
  };

  const showErrorToast = () => {
    toast.error('Error occurred', {
      description: 'Something went wrong. Please try again.',
      action: {
        label: 'Retry',
        onClick: () => toast.info('Retrying...'),
      },
    });
  };

  const showLoadingToast = () => {
    toast.loading('Processing your request...');
    setTimeout(() => {
      toast.success('Done!');
    }, 2000);
  };

  const showPromiseToast = () => {
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve(null), 2000);
    });

    toast.promise(promise, {
      loading: 'Waiting...',
      success: 'Completed successfully!',
      error: 'Something went wrong',
    });
  };

  // Modal Examples
  const showSimpleModal = () => {
    modal.openModal({
      title: 'Hello!',
      description: 'This is a simple modal',
      content: <p>You can put any content here</p>,
      actions: [
        {
          label: 'Close',
          onClick: () => {
            toast.success('Modal closed');
          },
        },
      ],
      size: 'sm',
    });
  };

  const showConfirmModal = () => {
    const id = modal.openModal({
      title: 'Confirm Action',
      description: 'Are you sure you want to proceed?',
      content: (
        <p className="text-gray-600">
          This action will increase the demo counter by 1.
        </p>
      ),
      actions: [
        {
          label: 'Cancel',
          variant: 'secondary',
          onClick: () => modal.closeModal(id),
        },
        {
          label: 'Confirm',
          variant: 'default',
          onClick: async () => {
            setDemoCount((prev) => prev + 1);
            modal.closeModal(id);
            toast.success(`Counter is now: ${demoCount + 1}`);
          },
        },
      ],
      size: 'sm',
    });
  };

  const [formInputValue, setFormInputValue] = useState('');

  const showFormModal = () => {
    const id = modal.openModal({
      title: 'Enter Your Name',
      content: (
        <input
          type="text"
          placeholder="Type your name..."
          value={formInputValue}
          onChange={(e) => setFormInputValue(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      ),
      actions: [
        {
          label: 'Cancel',
          variant: 'secondary',
          onClick: () => modal.closeModal(id),
        },
        {
          label: 'Submit',
          onClick: () => {
            if (formInputValue.trim()) {
              toast.success(`Hello, ${formInputValue}!`);
              modal.closeModal(id);
              setFormInputValue('');
            } else {
              toast.error('Please enter a name');
            }
          },
        },
      ],
      size: 'md',
    });
  };

  // Token Refresh Example
  const handleTokenRefresh = async () => {
    const success = await refreshToken();
    if (success) {
      toast.success('Token refreshed successfully');
    } else {
      toast.error('Failed to refresh token - please login again');
    }
  };

  return (
    <div
      className={`p-8 rounded-lg ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
    >
      <h1 className="text-3xl font-bold mb-8">Feature Showcase</h1>

      {/* Dark Mode */}
      <section className="mb-8 pb-8 border-b border-gray-300 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-4">Dark Mode</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Current mode: <strong>{isDark ? 'Dark' : 'Light'}</strong>
        </p>
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isDark ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
        </button>
      </section>

      {/* Toast Notifications */}
      <section className="mb-8 pb-8 border-b border-gray-300 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-4">Toast Notifications</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={showSuccessToast}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Success Toast
          </button>
          <button
            onClick={showErrorToast}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Error Toast
          </button>
          <button
            onClick={showLoadingToast}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Loading Toast
          </button>
          <button
            onClick={showPromiseToast}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Promise Toast
          </button>
        </div>
      </section>

      {/* Modals */}
      <section className="mb-8 pb-8 border-b border-gray-300 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-4">Modals</h2>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={showSimpleModal}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Simple Modal
          </button>
          <button
            onClick={showConfirmModal}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Confirm Modal
          </button>
          <button
            onClick={showFormModal}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Form Modal
          </button>
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Demo counter: <strong>{demoCount}</strong>
        </p>
      </section>

      {/* Token Refresh */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Token Management</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Refresh your authentication token. Auto-refresh happens automatically
          on API errors.
        </p>
        <button
          onClick={handleTokenRefresh}
          disabled={isRefreshing}
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Token'}
        </button>
      </section>
    </div>
  );
};
