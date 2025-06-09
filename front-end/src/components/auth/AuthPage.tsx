import { useState } from "react";
import { Eye, EyeOff, DollarSign, TrendingUp, PieChart } from 'lucide-react';
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

// Auth Page Component
export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center items-center text-white" style={{ background: 'linear-gradient(to bottom right, #34eb7d, #2dd66e)' }}>
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <DollarSign className="w-12 h-12" stroke="#065f46"/>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Budget Tracker</h1>
            <p className="text-xl mb-8 opacity-90">Take control of your finances</p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <TrendingUp className="w-6 h-6" stroke="#065f46"/>
                </div>
                <span className="text-lg">Track spending trends</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <PieChart className="w-6 h-6" stroke="#065f46"/>
                </div>
                <span className="text-lg">Visualize your budget</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <DollarSign className="w-6 h-6" stroke="#065f46"/>
                </div>
                <span className="text-lg">Manage categories</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};