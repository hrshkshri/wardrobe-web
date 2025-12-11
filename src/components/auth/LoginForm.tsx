import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/auth';
import { loginSchema } from '@/schemas/auth';
import { ZodError } from 'zod';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isLoading, token } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validate input with Zod
      loginSchema.parse({ email, password });

      // Call login from auth store
      await login(email, password);
    } catch (err) {
      if (err instanceof ZodError) {
        // Handle validation errors
        const firstError = err.issues[0]?.message;
        toast.error(firstError || 'Validation failed');
      }
      // API errors are already handled in auth store with toast
    }
  };

  // Navigate to dashboard when token is set
  if (token) {
    navigate('/dashboard');
  }

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
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border-b border-gray-300 bg-transparent px-0 py-3 pr-8 text-base placeholder-gray-400 focus:border-black focus:outline-none focus:ring-0 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full mt-10 py-3 rounded-lg text-base font-medium disabled:opacity-50 hover:cursor-pointer"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
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
        className="w-full border border-gray-300 text-black py-3 rounded-lg text-base font-medium hover:bg-gray-50 hover:cursor-pointer transition-colors duration-200"
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
