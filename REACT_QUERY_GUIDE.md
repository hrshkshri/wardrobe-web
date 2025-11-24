# React Query (TanStack Query) Integration Guide

## Overview

React Query is integrated into the wardrobe-web project for powerful server state management, caching, and synchronization. It automatically handles:

- ✅ Caching of server state
- ✅ Deduplication of requests
- ✅ Automatic background refetching
- ✅ Stale-while-revalidate pattern
- ✅ Pagination and infinite queries
- ✅ Optimistic updates
- ✅ Error handling

---

## Architecture

### Query Client (`src/lib/queryClient.ts`)

Central configuration for all React Query behavior:

- Stale time: 5 minutes (data is considered fresh for 5 min)
- Cache time: 10 minutes (cached data kept for 10 min after last used)
- Automatic retries: 1 attempt
- No refetch on window focus (can be enabled per query)

### Query Keys (`src/lib/queryKeys.ts`)

Type-safe factory pattern for consistent query key naming:

```typescript
// Example query keys
queryKeys.auth.me(); // ['auth', 'me']
queryKeys.users.byId('123'); // ['users', 'detail', '123']
queryKeys.items.list({ category: 'shirts' }); // ['items', 'list', { category: 'shirts' }]
```

### Query Service (`src/services/query.service.ts`)

Central service for:

- Fetching data via API client
- Cache management
- Query invalidation
- Optimistic updates

### Custom Hooks

Ready-to-use hooks for common operations:

#### Authentication Queries

```typescript
import { useCurrentUser, useLoginMutation, useLogoutMutation } from '@/hooks';

// Fetch current user
const { data: user, isLoading } = useCurrentUser();

// Login
const { mutate: login, isPending } = useLoginMutation();
await login({ email, password });

// Logout
const { mutate: logout } = useLogoutMutation();
```

#### Generic Queries & Mutations

```typescript
import { useQueryData, useMutateData, useInfinitePaginatedData } from '@/hooks';

// Basic query
const { data, isLoading, error } = useQueryData(['endpoint'], () =>
  apiClient.get('/endpoint')
);

// Mutation
const { mutate, isPending } = useMutateData(['key'], (data) =>
  apiClient.post('/endpoint', data)
);

// Infinite pagination
const { data, fetchNextPage, hasNextPage } = useInfinitePaginatedData(
  ['items'],
  (page) => apiClient.get(`/items?page=${page}`)
);
```

#### Pre-built Domain Hooks

**Users:**

```typescript
import {
  useUsers,
  useUserById,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '@/hooks';

// Fetch all users
const { data: users } = useUsers({ role: 'admin' });

// Fetch single user
const { data: user } = useUserById('123');

// Create user
const { mutate: createUser } = useCreateUser();

// Update user
const { mutate: updateUser } = useUpdateUser('123');

// Delete user
const { mutate: deleteUser } = useDeleteUser();
```

**Items:**

```typescript
import {
  useItems,
  useSearchItems,
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
} from '@/hooks';

// Fetch items with pagination
const { data, fetchNextPage, hasNextPage } = useItems({ category: 'shirts' });

// Search items
const { data: results } = useSearchItems('blue');

// Create item
const { mutate: createItem } = useCreateItem();

// Update item
const { mutate: updateItem } = useUpdateItem('item-123');

// Delete item
const { mutate: deleteItem } = useDeleteItem();
```

---

## Usage Examples

### Simple Query

```typescript
import { useCurrentUser } from '@/hooks';

export function Profile() {
  const { data: user, isLoading, error } = useCurrentUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Welcome, {user?.name}!</div>;
}
```

### Conditional Query

```typescript
import { useUserById } from '@/hooks';

export function UserDetail({ userId }: { userId?: string }) {
  // Query only runs if userId is provided
  const { data: user } = useUserById(userId || '', {
    enabled: !!userId,
  });

  return user ? <div>{user.name}</div> : <div>Select a user</div>;
}
```

### Mutation with Success Handler

```typescript
import { useCreateUser } from '@/hooks';

export function CreateUserForm() {
  const { mutate: createUser, isPending } = useCreateUser();

  const handleSubmit = (data: CreateUserInput) => {
    createUser(data, {
      onSuccess: (newUser) => {
        toast.success(`User ${newUser.name} created!`);
        navigate(`/users/${newUser.id}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(getFormData(e));
    }}>
      {/* form fields */}
      <button disabled={isPending}>{isPending ? 'Creating...' : 'Create'}</button>
    </form>
  );
}
```

### Optimistic Updates

```typescript
import { useUpdateUser } from '@/hooks';
import { queryService } from '@/services/query.service';
import { queryKeys } from '@/lib/queryKeys';

export function UpdateUserForm({ userId }: { userId: string }) {
  const { mutate: updateUser } = useUpdateUser(userId);

  const handleUpdate = (data: UpdateUserInput) => {
    // Optimistic update
    queryService.setQueryData(queryKeys.users.byId(userId), {
      ...currentUser,
      ...data,
    });

    updateUser(data, {
      onError: () => {
        // Revert on error - React Query handles this automatically
        queryService.invalidateQueries(queryKeys.users.byId(userId));
      },
    });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleUpdate(getFormData(e));
    }}>
      {/* form fields */}
    </form>
  );
}
```

### Infinite Scroll / Load More

```typescript
import { useItems } from '@/hooks';

export function ItemsList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useItems();

  const allItems = data?.pages.flatMap(page => page) || [];

  return (
    <div>
      {allItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

### Manual Cache Management

```typescript
import { queryService } from '@/services/query.service';
import { queryKeys } from '@/lib/queryKeys';

// Get cached data without refetching
const cachedUser = queryService.getQueryData(queryKeys.users.byId('123'));

// Manually set cache (e.g., after server push)
queryService.setQueryData(queryKeys.users.byId('123'), newUserData);

// Invalidate and refetch
queryService.invalidateUserQueries();

// Clear all cache
queryService.clearCache(); // Called on logout
```

### Dependent Queries

```typescript
import { useUserById, useItems } from '@/hooks';

export function UserItems({ userId }: { userId: string }) {
  // First query
  const { data: user } = useUserById(userId);

  // Second query depends on first query
  const { data: items } = useItems(
    { ownerId: userId },
    {
      enabled: !!user, // Only run when user is loaded
    }
  );

  return (
    <div>
      <h1>{user?.name}</h1>
      <div>{items?.map(item => <div key={item.id}>{item.name}</div>)}</div>
    </div>
  );
}
```

---

## Advanced Features

### Custom Query Configuration

```typescript
const { data, isLoading } = useQueryData(
  ['custom-key'],
  () => apiClient.get('/endpoint'),
  {
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 3, // Retry 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60, // Refetch every minute
  }
);
```

### Background Refetching

```typescript
const { data, isLoading, isFetching } = useQueryData(
  ['key'],
  () => apiClient.get('/endpoint'),
  { refetchInterval: 5000 } // Refetch every 5 seconds
);

// Show loading state only on initial load, not on background refetch
return (
  <div>
    {isLoading && <Skeleton />}
    {!isLoading && isFetching && <LoadingSpinner />}
    {data && <Content data={data} />}
  </div>
);
```

### Mutation Options

```typescript
const { mutate, isPending, isError, error } = useMutateData(
  ['key'],
  (data) => apiClient.post('/endpoint', data),
  {
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['key'] });

      // Snapshot previous state
      const previousData = queryClient.getQueryData(['key']);

      // Optimistic update
      queryClient.setQueryData(['key'], (old) => ({
        ...old,
        ...newData,
      }));

      return { previousData }; // Return for rollback
    },
    onError: (err, newData, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(['key'], context.previousData);
      }
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['related-key'] });
    },
  }
);
```

---

## Performance Tips

### 1. Use Proper Query Keys

```typescript
// ❌ BAD - Creates new array each time
const { data } = useQueryData(['items'], () => apiClient.get('/items'));

// ✅ GOOD - Stable query key
const { data } = useQueryData(queryKeys.items.list(), () =>
  apiClient.get('/items')
);
```

### 2. Keep Data Fresh Appropriately

```typescript
// ✅ Data that changes frequently
const { data } = useQueryData(['live-orders'], fetch, {
  staleTime: 1000 * 30, // 30 seconds
});

// ✅ Data that changes rarely
const { data } = useQueryData(['settings'], fetch, {
  staleTime: 1000 * 60 * 60, // 1 hour
});
```

### 3. Invalidate Only Affected Queries

```typescript
// ❌ BAD - Invalidates everything
queryClient.clear();

// ✅ GOOD - Invalidate specific queries
queryService.invalidateUserQueries();
queryService.invalidateQueries(queryKeys.items.all);
```

### 4. Lazy Queries

```typescript
// ✅ Query only runs when needed
const { data, refetch } = useQueryData(
  ['user'],
  () => apiClient.get('/user'),
  { enabled: false } // Don't run automatically
);

// Manually trigger
<button onClick={() => refetch()}>Fetch User</button>
```

---

## Debugging

### React Query DevTools (Optional)

To add React Query DevTools for debugging:

```bash
yarn add @tanstack/react-query-devtools
```

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Manual Debugging

```typescript
// Check what's cached
queryClient.getQueryData(['key']);

// Check query state
queryClient.getQueryState(['key']);

// Get all cached queries
const cache = queryClient.getQueryCache();
```

---

## Migration Guide

### From useApi Hook to React Query

```typescript
// OLD: useApi hook
const { data, isLoading, error, get } = useApi<User>();
await get('/users/me');

// NEW: React Query
const { data, isLoading, error } = useCurrentUser();
```

### From useAuth Hook to React Query Auth Hooks

```typescript
// OLD: useAuth hook
const { user, isAuthenticated, login } = useAuth();

// NEW: React Query + Zustand store
const { data: user } = useCurrentUser();
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
const { mutate: login } = useLoginMutation();
```

---

## Common Patterns

### Search with Debounce

```typescript
import { useCallback, useState } from 'react';
import { useSearchItems } from '@/hooks';

export function Search() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const { data: results } = useSearchItems(debouncedQuery);

  const handleChange = useCallback((value: string) => {
    setQuery(value);
    // Debounce
    setTimeout(() => setDebouncedQuery(value), 300);
  }, []);

  return (
    <div>
      <input onChange={(e) => handleChange(e.target.value)} />
      {results?.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  );
}
```

### Polling

```typescript
const { data, isLoading } = useQueryData(
  ['orders'],
  () => apiClient.get('/orders'),
  {
    refetchInterval: 1000 * 10, // Poll every 10 seconds
    refetchIntervalPaused: !isActive, // Pause when tab is not focused
  }
);
```

---

## Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Query Keys Best Practices](https://tanstack.com/query/latest/docs/react/important-defaults)
- [Caching Patterns](https://tanstack.com/query/latest/docs/react/important-defaults)

---

**Status:** ✅ PRODUCTION READY

Last updated: 2025-11-25
