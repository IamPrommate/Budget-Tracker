'use client';


import { authAPI } from "@/lib/api";
import { AuthContextType, AuthProviderProps, User } from "@/types/auth";
import { useContext, useState, useEffect } from "react";
import { createContext } from "react";


// Auth Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = localStorage.getItem('budget_tracker_token');
    const savedUser = localStorage.getItem('budget_tracker_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      const parsedUser = JSON.parse(savedUser);
setUser(parsedUser);
setToken(parsedUser.token);
    }
    
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authAPI.login(username, password);
      const { token } = response;
      
      // Store token and user info
      localStorage.setItem('budget_tracker_token', token);
      localStorage.setItem('budget_tracker_user', JSON.stringify({ username, token }));

      
      setToken(token);
setUser({ username, token }); // ✅ now includes token

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const register = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await authAPI.register(username, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const logout = (): void => {
    localStorage.removeItem('budget_tracker_token');
    localStorage.removeItem('budget_tracker_user');
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};