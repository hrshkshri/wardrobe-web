import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  UseQueryOptions,
  UseMutationOptions,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';

/**
 * Generic hook for fetching data
 * @example
 * const { data, isLoading, error } = useQueryData<User>(
 *   queryKey,
 *   () => queryService.fetchUser()
 * );
 */
export const useQueryData = <T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKey as unknown[],
    queryFn,
    ...options,
  });
};

/**
 * Generic hook for creating/updating data
 * @example
 * const { mutate, isPending } = useMutateData<User>(
 *   (data) => apiClient.post('/users', data)
 * );
 */
export const useMutateData = <TData, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>
) => {
  return useMutation({
    mutationFn,
    ...options,
  });
};

/**
 * Generic hook for paginated data
 * @example
 * const { data, fetchNextPage, hasNextPage } = useInfinitePaginatedData(
 *   ['items'],
 *   (pageParam) => queryService.fetchItems(pageParam)
 * );
 */
export const useInfinitePaginatedData = <T>(
  queryKey: readonly unknown[],
  queryFn: (pageParam: number) => Promise<T[]>,
  options?: Omit<
    UseInfiniteQueryOptions<T[], Error, T[]>,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >
) => {
  return useInfiniteQuery({
    queryKey: queryKey as unknown[],
    queryFn: async ({ pageParam }) => {
      return queryFn(pageParam as number);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
    ...options,
  });
};
