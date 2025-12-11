import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* Logo at top */}
      <div className="absolute top-8">
        <div className="text-center">
          <div className="text-2xl font-bold">My Wardrobe</div>
        </div>
      </div>

      {/* Floating Card */}
      <div className="w-full max-w-md">
        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-black">Welcome Back</h2>
            <p className="text-sm text-gray-500 mt-2">
              Sign in to your wardrobe
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border-b border-gray-300 bg-transparent px-0 py-2 text-base placeholder-gray-400 focus:border-black focus:outline-none focus:ring-0 transition-colors"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border-b border-gray-300 bg-transparent px-0 py-2 text-base placeholder-gray-400 focus:border-black focus:outline-none focus:ring-0 transition-colors"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {error}
              </div>
            )}

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full mt-8 py-2 rounded text-sm font-medium"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-xs text-gray-400">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* OAuth */}
          <Button
            type="button"
            variant="outline"
            className="w-full border border-gray-200 text-black py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Continue with Google
          </Button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link
              to="/auth/register"
              className="text-black font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-400">
            <Link to="#" className="hover:text-gray-600">
              Forgot password?
            </Link>
          </p>
          <p className="text-xs text-gray-400">
            By proceeding, you agree to our{' '}
            <Link to="#" className="text-black hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="#" className="text-black hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
