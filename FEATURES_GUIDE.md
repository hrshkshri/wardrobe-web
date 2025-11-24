# Advanced Features Guide

This guide covers all the advanced features implemented in your wardrobe-web application.

## 📋 Table of Contents

1. [Toast Notifications](#toast-notifications)
2. [Modal/Dialog System](#modaldialog-system)
3. [Token Refresh](#token-refresh)
4. [Dark Mode](#dark-mode)

---

## Toast Notifications

**Library:** Sonner
**Location:** `src/services/toast.service.ts` | `src/hooks/useToast.ts`

### Basic Usage

```tsx
import { useToast } from '@/hooks/useToast';

export function MyComponent() {
  const toast = useToast();

  const handleClick = () => {
    toast.success('Item created successfully!');
  };

  return <button onClick={handleClick}>Create Item</button>;
}
```

### All Toast Types

```tsx
const toast = useToast();

// Success toast
toast.success('Operation successful');

// Error toast
toast.error('Something went wrong', {
  description: 'Please try again later',
});

// Info toast
toast.info('New feature available');

// Warning toast
toast.warning('This action cannot be undone');

// Loading toast
const toastId = toast.loading('Processing...');

// Update loading toast
toast.success('Done!');

// Promise-based toast
toast.promise(fetchData(), {
  loading: 'Loading data...',
  success: 'Data loaded!',
  error: 'Failed to load data',
});
```

### Toast Options

```tsx
interface ToastOptions {
  duration?: number; // Auto-close after ms (default varies by type)
  description?: string; // Subtitle text
  action?: {
    label: string; // Button text
    onClick: () => void; // Click handler
  };
}

toast.success('Item saved', {
  duration: 5000,
  description: 'Your item has been saved',
  action: {
    label: 'Undo',
    onClick: () => console.log('Undoing...'),
  },
});
```

### Real-World Examples

#### API Mutation with Toast

```tsx
import { useUpdateItem } from '@/hooks/useItems';
import { useToast } from '@/hooks/useToast';

export function EditItemForm() {
  const toast = useToast();
  const { mutate: updateItem } = useUpdateItem(itemId);

  const handleSubmit = async (data: ItemData) => {
    toast.promise(
      new Promise((resolve, reject) => {
        updateItem(data, {
          onSuccess: () => resolve(null),
          onError: () => reject(new Error('Update failed')),
        });
      }),
      {
        loading: 'Updating item...',
        success: 'Item updated successfully!',
        error: 'Failed to update item',
      }
    );
  };

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

#### Conditional Toast

```tsx
const handleDelete = async () => {
  try {
    await deleteItem();
    toast.success('Item deleted', {
      description: 'The item has been permanently deleted',
    });
  } catch (error) {
    toast.error('Delete failed', {
      description: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
```

---

## Modal/Dialog System

**Location:** `src/contexts/ModalContext.tsx` | `src/hooks/useModal.ts` | `src/components/Modal.tsx`

### Basic Usage

```tsx
import { useModal } from '@/hooks/useModal';

export function MyComponent() {
  const modal = useModal();

  const handleClick = () => {
    modal.openModal({
      title: 'Confirm Action',
      description: 'Are you sure?',
      content: <p>This action cannot be undone.</p>,
      actions: [
        { label: 'Cancel', onClick: () => {} },
        {
          label: 'Delete',
          variant: 'destructive',
          onClick: () => {
            // Handle deletion
          },
        },
      ],
    });
  };

  return <button onClick={handleClick}>Open Modal</button>;
}
```

### Modal Configuration

```tsx
interface ModalConfig {
  title?: string; // Modal header title
  description?: string; // Subtitle below title
  content: ReactNode; // Modal body content
  actions?: Array<{
    label: string; // Button text
    variant?: 'default' | 'destructive' | 'secondary';
    onClick: () => void | Promise<void>; // Can be async
  }>;
  size?: 'sm' | 'md' | 'lg' | 'xl'; // Modal width (default: md)
  closeOnEsc?: boolean; // Close when ESC pressed (default: true)
  closeOnBackdropClick?: boolean; // Close when backdrop clicked (default: true)
  onClose?: () => void; // Callback when modal closes
}
```

### Modal Sizes

- `sm` - 384px max-width
- `md` - 448px max-width (default)
- `lg` - 512px max-width
- `xl` - 672px max-width

### Advanced Examples

#### Confirmation Dialog

```tsx
const modal = useModal();

const confirmDelete = () => {
  const id = modal.openModal({
    title: 'Delete Item',
    description: 'This action cannot be undone.',
    content: (
      <p className="text-gray-600">
        Are you sure you want to delete this item? All associated data will be
        lost.
      </p>
    ),
    actions: [
      {
        label: 'Cancel',
        variant: 'secondary',
        onClick: () => modal.closeModal(id),
      },
      {
        label: 'Delete',
        variant: 'destructive',
        onClick: async () => {
          await deleteItem();
          modal.closeModal(id);
          toast.success('Item deleted');
        },
      },
    ],
    size: 'sm',
  });
};
```

#### Form Modal

```tsx
const modal = useModal();

const editItem = (item: Item) => {
  const id = modal.openModal({
    title: 'Edit Item',
    content: (
      <EditItemForm item={item} onSuccess={() => modal.closeModal(id)} />
    ),
    size: 'lg',
  });
};
```

#### Async Action Handling

```tsx
const modal = useModal();

const handleAsyncAction = async () => {
  const id = modal.openModal({
    title: 'Processing',
    content: <p>Please wait while we process your request...</p>,
    actions: [
      {
        label: 'Process',
        onClick: async () => {
          // Button will show "Loading..." and disable during this
          await longRunningOperation();
        },
      },
    ],
  });
};
```

---

## Token Refresh

**Location:** `src/services/auth.service.ts` | `src/api/interceptors.ts` | `src/hooks/useRefreshToken.ts`

### How It Works

1. **Access Token Expires** → API returns 401 Unauthorized
2. **Interceptor Catches 401** → Automatically calls token refresh endpoint
3. **Refresh Token Sent** → Backend returns new access token
4. **Original Request Retried** → Request continues transparently

### Auto-Refresh (Automatic)

Token refresh happens automatically:

```tsx
// This request will:
// 1. Fail with 401 if token expired
// 2. Trigger auto-refresh (transparent)
// 3. Retry with new token
// User doesn't see anything, request succeeds
const { data } = await useItems();
```

### Manual Refresh

For manual token refresh (rarely needed):

```tsx
import { useRefreshToken } from '@/hooks/useRefreshToken';

export function MyComponent() {
  const { refreshToken, isRefreshing } = useRefreshToken();

  const handleManualRefresh = async () => {
    const success = await refreshToken();
    if (success) {
      toast.success('Token refreshed');
    } else {
      toast.error('Token refresh failed - please login again');
    }
  };

  return (
    <button onClick={handleManualRefresh} disabled={isRefreshing}>
      {isRefreshing ? 'Refreshing...' : 'Refresh Token'}
    </button>
  );
}
```

### Configuration

The refresh token flow is configured in `src/api/interceptors.ts`:

```tsx
// Error: Handle 401 Unauthorized (refresh token)
interceptorManager.addErrorInterceptor(async (error) => {
  if (error.code === 'UNAUTHORIZED') {
    logger.warn('Unauthorized - Attempting token refresh');

    const refreshed = await authService.refreshAccessToken();

    if (!refreshed) {
      logger.error('Token refresh failed - Logging out');
      authService.logout();
    }
  }
});
```

### Behavior

- **Token expires** → 401 error triggers refresh
- **Refresh succeeds** → New token stored, request retried
- **Refresh fails** → User logged out automatically
- **System theme changes** → Theme updates automatically

---

## Dark Mode

**Location:** `src/store/themeStore.ts` | `src/hooks/useDarkMode.ts`

### Basic Usage

```tsx
import { useDarkMode } from '@/hooks/useDarkMode';

export function ThemeToggle() {
  const { isDark, toggle } = useDarkMode();

  return (
    <button onClick={toggle}>
      {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
```

### Theme Modes

- `light` - Light theme
- `dark` - Dark theme
- `system` - Follow system preference (default)

```tsx
const { theme, setTheme } = useDarkMode();

// Set specific theme
setTheme('dark');
setTheme('light');
setTheme('system');

// Get current effective theme
const effective = getEffectiveTheme(); // 'light' | 'dark'
```

### Tailwind Dark Mode Integration

Your dark mode automatically works with Tailwind CSS:

```tsx
// Light mode class
<div className="bg-white text-black">Light</div>

// Dark mode class
<div className="dark:bg-black dark:text-white">Works in dark mode too</div>

// Conditional styling
<div className={isDark ? 'bg-black text-white' : 'bg-white text-black'}>
  Dynamic styling
</div>
```

### Features

✅ **Persistent** - Theme preference saved to localStorage
✅ **System-aware** - Respects OS dark mode preference
✅ **Reactive** - Updates when system theme changes
✅ **Document-wide** - Applies to `<html class="dark">` for Tailwind

### Real-World Example

```tsx
export function App() {
  const { isDark, toggle } = useDarkMode();

  return (
    <div className={isDark ? 'dark' : ''}>
      <header className="bg-white dark:bg-gray-900">
        <button onClick={toggle}>Toggle Theme</button>
      </header>
      <main className="bg-gray-50 dark:bg-gray-800">{/* Content */}</main>
    </div>
  );
}
```

### Advanced Configuration

Monitor theme changes:

```tsx
import { useThemeStore } from '@/store/themeStore';

export function ThemeDisplay() {
  const theme = useThemeStore((state) => state.theme);
  const effectiveTheme = useThemeStore((state) => state.getEffectiveTheme());

  return (
    <div>
      <p>Selected: {theme}</p>
      <p>Effective: {effectiveTheme}</p>
    </div>
  );
}
```

---

## Common Patterns

### Toast + Modal Confirmation

```tsx
const modal = useModal();
const toast = useToast();

const handleDelete = () => {
  modal.openModal({
    title: 'Delete Item',
    content: 'Are you sure?',
    actions: [
      { label: 'Cancel', onClick: () => {} },
      {
        label: 'Delete',
        variant: 'destructive',
        onClick: async () => {
          try {
            await deleteItem();
            toast.success('Item deleted');
          } catch (error) {
            toast.error('Delete failed');
          }
        },
      },
    ],
  });
};
```

### Loading State Handling

```tsx
const toast = useToast();

const handleAsyncOperation = async () => {
  const toastId = toast.loading('Processing...');
  try {
    const result = await someAsyncOperation();
    toast.success('Success!');
  } catch (error) {
    toast.error('Failed');
  }
};
```

### Form with Modal + Toast

```tsx
export function ItemForm() {
  const modal = useModal();
  const toast = useToast();
  const { mutate: createItem } = useCreateItem();

  const handleSubmit = (data: ItemData) => {
    createItem(data, {
      onSuccess: () => {
        toast.success('Item created!');
        modal.closeModal('form-modal-id');
      },
      onError: () => {
        toast.error('Failed to create item');
      },
    });
  };

  return <form onSubmit={handleSubmit}>{/* fields */}</form>;
}
```

---

## Summary of Files

| File                                | Purpose                    |
| ----------------------------------- | -------------------------- |
| `src/services/toast.service.ts`     | Toast notification service |
| `src/hooks/useToast.ts`             | Hook to access toasts      |
| `src/contexts/ModalContext.tsx`     | Modal state management     |
| `src/hooks/useModal.ts`             | Hook to control modals     |
| `src/components/Modal.tsx`          | Modal component            |
| `src/components/ModalContainer.tsx` | Modal renderer             |
| `src/store/themeStore.ts`           | Dark mode state            |
| `src/hooks/useDarkMode.ts`          | Dark mode hook             |
| `src/hooks/useRefreshToken.ts`      | Manual token refresh hook  |
| `src/api/interceptors.ts`           | Auto token refresh logic   |

---

## Next Steps

- Add a dark mode toggle button to your dashboard header
- Integrate toast notifications in your API calls
- Use modals for important user confirmations
- Monitor token refresh behavior in the browser console

Happy building! 🚀
