import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './layout/DashboardLayout';

const isAuthenticated = true;

const RedirectRoute = () => {
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Login />;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
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
  // Catch-all: redirect any unknown routes to the login page
  {
    path: '*',
    element: <Navigate to="/auth/login" />,
  },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
