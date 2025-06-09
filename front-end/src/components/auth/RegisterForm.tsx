import { useAuth } from "@/context/AuthContext";
import { RegisterFormProps } from "@/types/auth";
import { useState } from "react";
import { Eye, EyeOff, DollarSign, TrendingUp, PieChart } from 'lucide-react';

interface MyFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

// Register Form Component
export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState<MyFormData>({
  username: '',
  password: '',
  confirmPassword: ''
});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const { register } = useAuth();

  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const result = await register(formData.username, formData.password);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onSwitchToLogin();
      }, 1500);
    } else {
      setError(result.error || 'Registration failed');
    }
    
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="bg-white bg-opacity-20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(52, 235, 125, 0.2)' }}>
          <DollarSign className="w-8 h-8" style={{ color: '#34eb7d' }} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
        <p className="text-gray-600 mb-4">Your account has been created successfully.</p>
        <p className="text-sm text-gray-500">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-full" style={{ backgroundColor: 'rgba(52, 235, 125, 0.2)' }}>
            <DollarSign className="w-8 h-8" style={{ color: '#34eb7d' }} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-600">Start tracking your budget today</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-all focus:ring-2 focus:border-transparent"
            onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(52, 235, 125, 0.5)'}
            onBlur={(e) => e.target.style.boxShadow = 'none'}
            placeholder="Choose a username"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg outline-none transition-all focus:ring-2 focus:border-transparent"
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(52, 235, 125, 0.5)'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword || ''}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg outline-none transition-all focus:ring-2 focus:border-transparent"
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(52, 235, 125, 0.5)'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ backgroundColor: '#34eb7d' }}
          className="w-full text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#2dd66e'}
          onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#34eb7d'}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="font-medium hover:opacity-80"
            style={{ color: '#34eb7d' }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};