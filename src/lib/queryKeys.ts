// Query keys factory pattern for better type safety and consistency

export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
    profile: () => [...queryKeys.auth.all, 'profile'] as const,
  },

  // Users queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.users.lists(), { ...filters }] as const,
    detail: () => [...queryKeys.users.all, 'detail'] as const,
    byId: (id: string) => [...queryKeys.users.detail(), id] as const,
  },

  // Posts/Items queries
  items: {
    all: ['items'] as const,
    lists: () => [...queryKeys.items.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.items.lists(), { ...filters }] as const,
    detail: () => [...queryKeys.items.all, 'detail'] as const,
    byId: (id: string) => [...queryKeys.items.detail(), id] as const,
  },

  // Search queries
  search: {
    all: ['search'] as const,
    list: (query: string) => [...queryKeys.search.all, query] as const,
  },

  // Settings queries
  settings: {
    all: ['settings'] as const,
    detail: () => [...queryKeys.settings.all, 'detail'] as const,
  },
} as const;
