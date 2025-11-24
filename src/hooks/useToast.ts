import { toastService } from '@/services/toast.service';

/**
 * Hook to access toast notifications
 * @example
 * const toast = useToast();
 * toast.success('Item created!');
 */
export const useToast = () => {
  return toastService;
};
