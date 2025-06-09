import { useAuth } from "@/context/AuthContext";
import { LoginFormProps } from "@/types/auth";
import { useState } from "react";
import { Eye, EyeOff, DollarSign, TrendingUp, PieChart } from 'lucide-react';

// Login Form Component
export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState<FormData>({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { login } = useAuth();

  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    setError('');

    const result = await login(formData.username, formData.password);
    
    if (!result.success) {
      setError(result.error || 'Login failed');
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

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-full" style={{ backgroundColor: 'rgba(52, 235, 125, 0.2)' }}>
            <DollarSign className="w-8 h-8" style={{ color: '#34eb7d' }} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your Budget Tracker</p>
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
            style={{ '--tw-ring-color': '#34eb7d' }}
            onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(52, 235, 125, 0.5)'}
            onBlur={(e) => e.target.style.boxShadow = 'none'}
            placeholder="Enter your username"
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
              placeholder="Enter your password"
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
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="font-medium hover:opacity-80"
            style={{ color: '#34eb7d' }}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};