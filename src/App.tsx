import { QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { queryClient } from '@/lib/queryClient';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ModalProvider } from '@/contexts/ModalContext';
import { ModalContainer } from '@/components/ModalContainer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './layout/DashboardLayout';

const RedirectRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Login />;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/auth/login" />;
};

const appRouter = createBrowserRouter([
  {
    path: '/auth/login',
    element: <RedirectRoute />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
      // { path: 'profile', element: <ProfilePage /> },
      // { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" />,
  },
  {
    path: '*',
    element: <Navigate to="/auth/login" />,
  },
]);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <RouterProvider router={appRouter} />
          <ModalContainer />
          <Toaster position="top-right" richColors />
        </ModalProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
