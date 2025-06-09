'use client';

import { AuthPage } from '@/components/auth/AuthPage';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useAuth } from '@/context/AuthContext';
import React from 'react';


const BudgetTrackerApp: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Dashboard /> : <AuthPage />;
};

export default BudgetTrackerApp;
