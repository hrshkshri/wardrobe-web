import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type UserRole = 'user' | 'stylist' | null;

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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

    // Validation
    if (!role) {
      setError('Please select a role');
      return;
    }

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
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

    // Registration logic will be added when integrating API
    navigate('/dashboard');
  };

  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        {/* Logo at top */}
        <div className="absolute top-8">
          <div className="text-center">
            <div className="text-2xl font-bold">My Wardrobe</div>
          </div>
        </div>

        {/* Floating Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-2">Join My Wardrobe</h2>
            <p className="text-sm text-gray-500">
              Choose how you'd like to get started
            </p>
          </div>

          <div className="space-y-4">
            {/* User Role Card */}
            <button
              onClick={() => setRole('user')}
              className="w-full p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-black mb-1">
                    I'm Building My Wardrobe
                  </h3>
                  <p className="text-sm text-gray-500">
                    Organize your clothes, create outfits, get styling advice
                  </p>
                </div>
                <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-black opacity-0 group-hover:opacity-100"></div>
                </div>
              </div>
            </button>

            {/* Stylist Role Card */}
            <button
              onClick={() => setRole('stylist')}
              className="w-full p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-black mb-1">
                    I'm a Professional Stylist
                  </h3>
                  <p className="text-sm text-gray-500">
                    Build your client base and offer styling services
                  </p>
                </div>
                <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-black opacity-0 group-hover:opacity-100"></div>
                </div>
              </div>
            </button>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-500 mt-12">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="text-black font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* Logo at top */}
      <div className="absolute top-8">
        <div className="text-center">
          <div className="text-2xl font-bold">My Wardrobe</div>
        </div>
      </div>

      {/* Floating Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-100 p-8">
        {/* Back Button */}
        <button
          onClick={() => setRole(null)}
          className="text-sm text-gray-500 hover:text-black mb-6 transition-colors"
        >
          ← Back
        </button>
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-2">Create Account</h2>
          <p className="text-sm text-gray-500">
            {role === 'user'
              ? 'Start organizing your wardrobe'
              : 'Join our stylist community'}
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-black"
              >
                First Name
              </label>
              <Input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                className="w-full border-b border-black bg-transparent px-0 py-2 text-base placeholder-gray-400 focus:outline-none focus:ring-0"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-black"
              >
                Last Name
              </label>
              <Input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                className="w-full border-b border-black bg-transparent px-0 py-2 text-base placeholder-gray-400 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* Email */}
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
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              className="w-full border-b border-black bg-transparent px-0 py-2 text-base placeholder-gray-400 focus:outline-none focus:ring-0"
            />
          </div>

          {/* Password */}
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
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="w-full border-b border-black bg-transparent px-0 py-2 text-base placeholder-gray-400 focus:outline-none focus:ring-0"
            />
            <p className="text-xs text-gray-400 mt-1">At least 8 characters</p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
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
              className="w-full border-b border-black bg-transparent px-0 py-2 text-base placeholder-gray-400 focus:outline-none focus:ring-0"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          {/* Terms */}
          <p className="text-xs text-gray-400">
            By signing up, you agree to our{' '}
            <Link to="#" className="text-black hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="#" className="text-black hover:underline">
              Privacy Policy
            </Link>
          </p>

          {/* Sign Up Button */}
          <Button
            type="submit"
            className="w-full mt-8 bg-black text-white py-2 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
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

        {/* OAuth Options */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full border border-gray-200 text-black py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Continue with Google
          </Button>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="text-black font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
