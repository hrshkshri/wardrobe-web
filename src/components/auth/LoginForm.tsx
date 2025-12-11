import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LoginForm = () => {
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
    <>
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-semibold text-black mb-3">Welcome Back</h2>
        <p className="text-base text-gray-600">Sign in to your wardrobe</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-8">
        {/* Email Field */}
        <div className="space-y-3">
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
            className="w-full border-b border-gray-300 bg-transparent px-0 py-3 text-base placeholder-gray-400 focus:border-black focus:outline-none focus:ring-0 transition-colors"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-3">
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
            className="w-full border-b border-gray-300 bg-transparent px-0 py-3 text-base placeholder-gray-400 focus:border-black focus:outline-none focus:ring-0 transition-colors"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Sign In Button */}
        <Button
          type="submit"
          className="w-full mt-10 py-3 rounded-lg text-base font-medium"
        >
          Sign In
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-8">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-3 text-xs text-gray-400">or</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      {/* OAuth */}
      <Button
        type="button"
        variant="outline"
        className="w-full border border-gray-300 text-black py-3 rounded-lg text-base font-medium hover:bg-gray-50 transition-colors duration-200"
      >
        Continue with Google
      </Button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-gray-600 mt-8">
        Don't have an account?{' '}
        <Link
          to="/auth/register"
          className="text-accent font-medium hover:underline transition-colors"
        >
          Sign up
        </Link>
      </p>

      {/* Additional Footer Link */}
      <p className="text-center text-xs text-gray-500 mt-8">
        <Link to="#" className="hover:text-black transition-colors">
          Forgot password?
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
