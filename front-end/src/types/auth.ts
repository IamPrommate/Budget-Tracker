import { ReactNode } from "react";

// Types and Interfaces
export interface User {
  username: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export interface RegisterResponse {
  message: string;
}

export interface ErrorResponse {
  error: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export interface FormData {
  username: string;
  password: string;
  confirmPassword?: string;
}