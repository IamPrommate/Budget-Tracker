'use client';

import { AuthPage } from '@/components/auth/AuthPage';
import BudgetDashboard from '@/components/dashboard/BudgetDashboard';
import { useAuth } from '@/context/AuthContext';
import React from 'react';


const BudgetTrackerApp: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <BudgetDashboard /> : <AuthPage />;
};

export default BudgetTrackerApp;
