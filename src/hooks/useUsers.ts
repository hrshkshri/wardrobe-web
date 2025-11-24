import { useQueryData, useMutateData } from './useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { queryService } from '@/services/query.service';
import { apiClient } from '@/api/client';
import type { User } from '@/types';

/**
 * Fetch all users
 * Caches data for 5 minutes
 * @example
 * const { data: users, isLoading } = useUsers();
 */
export const useUsers = (filters?: Record<string, unknown>) => {
  return useQueryData(
    [...queryKeys.users.list(filters)],
    () => queryService.fetchUsers(filters),
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );
};

/**
 * Fetch a single user by ID
 * Caches data for 5 minutes
 * @example
 * const { data: user } = useUserById('123');
 */
export const useUserById = (id: string) => {
  return useQueryData(
    [...queryKeys.users.byId(id)],
    () => queryService.fetchUserById(id),
    {
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
    }
  );
};

/**
 * Create a new user
 * @example
 * const { mutate: createUser } = useCreateUser();
 * createUser({ name: 'John', email: 'john@example.com' });
 */
export const useCreateUser = () => {
  return useMutateData<User, Partial<User>>(
    (data) => {
      return apiClient.post<User>('/users', data).then((res) => {
        if (!res.success || !res.data) {
          throw new Error(res.error?.message || 'Failed to create user');
        }
        return res.data;
      });
    },
    {
      onSuccess: () => {
        // Invalidate users list after creating new user
        queryService.invalidateUserQueries();
      },
    }
  );
};

/**
 * Update an existing user
 * @example
 * const { mutate: updateUser } = useUpdateUser(userId);
 * updateUser({ name: 'Jane' });
 */
export const useUpdateUser = (id: string) => {
  return useMutateData<User, Partial<User>>(
    (data) => {
      return apiClient.put<User>(`/users/${id}`, data).then((res) => {
        if (!res.success || !res.data) {
          throw new Error(res.error?.message || 'Failed to update user');
        }
        return res.data;
      });
    },
    {
      onSuccess: (updatedUser) => {
        // Optimistically update cache
        queryService.setQueryData([...queryKeys.users.byId(id)], updatedUser);
        // Invalidate users list
        queryService.invalidateUserQueries();
      },
    }
  );
};

/**
 * Delete a user
 * @example
 * const { mutate: deleteUser } = useDeleteUser();
 * deleteUser(userId);
 */
export const useDeleteUser = () => {
  return useMutateData<void, string>(
    (id) => {
      return apiClient.delete(`/users/${id}`).then((res) => {
        if (!res.success) {
          throw new Error(res.error?.message || 'Failed to delete user');
        }
      });
    },
    {
      onSuccess: () => {
        // Invalidate users list after deletion
        queryService.invalidateUserQueries();
      },
    }
  );
};
