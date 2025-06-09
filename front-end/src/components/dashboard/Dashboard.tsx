import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, DollarSign, TrendingUp, PieChart } from 'lucide-react';

// Dashboard Preview (for authenticated users)
export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-8 h-8" style={{ color: '#34eb7d' }} />
              <span className="text-xl font-semibold text-gray-900">Budget Tracker</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.username}!</span>
              <button
                onClick={logout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <p className="text-gray-600 mb-8">Ready to add budget management functionality!</p>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <p className="text-gray-500">Budget features will be added here once we integrate the budget API endpoints.</p>
          </div>
        </div>
      </div>
    </div>
  );
};