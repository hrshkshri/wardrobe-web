import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    navigate('/dashboard');
  };

  return (
    <>
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-semibold text-black mb-3">Create Account</h2>
        <p className="text-base text-gray-600">Sign up to get started</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-8">
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
            name="email"
            value={formData.email}
            onChange={handleInputChange}
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
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            className="w-full border-b border-gray-300 bg-transparent px-0 py-3 text-base placeholder-gray-400 focus:border-black focus:outline-none focus:ring-0 transition-colors"
          />
          <p className="text-xs text-gray-500 mt-2">At least 8 characters</p>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-3">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-black"
          >
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
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

        {/* Sign Up Button */}
        <Button
          type="submit"
          className="w-full mt-10 py-3 rounded-lg text-base font-medium"
        >
          Create Account
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

      {/* Sign In Link */}
      <p className="text-center text-sm text-gray-600 mt-8">
        Already have an account?{' '}
        <Link
          to="/auth/login"
          className="text-accent font-medium hover:underline transition-colors"
        >
          Sign in
        </Link>
      </p>
    </>
  );
};

export default RegisterForm;
