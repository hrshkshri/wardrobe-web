import {
  useQueryData,
  useMutateData,
  useInfinitePaginatedData,
} from './useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { queryService } from '@/services/query.service';
import { apiClient } from '@/api/client';

/**
 * Fetch items with pagination
 * @example
 * const { data, fetchNextPage, hasNextPage } = useItems({ category: 'shirts' });
 */
export const useItems = (filters?: Record<string, unknown>) => {
  return useInfinitePaginatedData(
    queryKeys.items.list(filters),
    async (page) => {
      const result = await queryService.fetchItems(page, filters);
      return result.items || [];
    },
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );
};

/**
 * Search items
 * @example
 * const { data } = useSearchItems('blue shirts');
 */
export const useSearchItems = (query: string) => {
  return useQueryData<unknown>(
    [...queryKeys.search.list(query)],
    () => queryService.searchItems(query),
    {
      enabled: query.length > 2,
      staleTime: 1000 * 60 * 2, // 2 minutes
    }
  );
};

/**
 * Create a new item
 * @example
 * const { mutate: createItem } = useCreateItem();
 * createItem({ name: 'Blue Shirt', category: 'shirts' });
 */
export const useCreateItem = () => {
  return useMutateData(
    (data: unknown) => {
      return apiClient.post('/items', data).then((res) => {
        if (!res.success || !res.data) {
          throw new Error(res.error?.message || 'Failed to create item');
        }
        return res.data;
      });
    },
    {
      onSuccess: () => {
        queryService.invalidateItemQueries();
      },
    }
  );
};

/**
 * Update an existing item
 * @example
 * const { mutate: updateItem } = useUpdateItem(itemId);
 * updateItem({ name: 'Blue Shirt v2' });
 */
export const useUpdateItem = (id: string) => {
  return useMutateData(
    (data: unknown) => {
      return apiClient.put(`/items/${id}`, data).then((res) => {
        if (!res.success || !res.data) {
          throw new Error(res.error?.message || 'Failed to update item');
        }
        return res.data;
      });
    },
    {
      onSuccess: (updated) => {
        queryService.setQueryData([...queryKeys.items.byId(id)], updated);
        queryService.invalidateItemQueries();
      },
    }
  );
};

/**
 * Delete an item
 * @example
 * const { mutate: deleteItem } = useDeleteItem();
 * deleteItem(itemId);
 */
export const useDeleteItem = () => {
  return useMutateData(
    (id: string) => {
      return apiClient.delete(`/items/${id}`).then((res) => {
        if (!res.success) {
          throw new Error(res.error?.message || 'Failed to delete item');
        }
      });
    },
    {
      onSuccess: () => {
        queryService.invalidateItemQueries();
      },
    }
  );
};
