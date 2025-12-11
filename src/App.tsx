import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './layout/DashboardLayout';

const appRouter = createBrowserRouter([
  {
    path: '/auth/login',
    element: <Login />,
  },
  {
    path: '/auth/register',
    element: <Register />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
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
      <RouterProvider router={appRouter} />
      <Toaster position="top-right" richColors />
    </ErrorBoundary>
  );
}

export default App;
