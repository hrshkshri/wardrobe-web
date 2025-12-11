import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const AuthLayout = ({ children, hideFooter = false }: AuthLayoutProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* Logo at top */}
      <div className="absolute top-8">
        <div className="text-center">
          <div className="text-3xl font-semibold text-black tracking-tight">My Wardrobe</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-sm p-12 mb-12">
          {children}
        </div>

        {/* Footer Links */}
        {!hideFooter && (
          <div className="text-center space-y-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              By proceeding, you agree to our{' '}
              <Link to="#" className="text-accent hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="#" className="text-accent hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;
