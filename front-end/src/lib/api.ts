import { LoginResponse, ErrorResponse, RegisterResponse } from "@/types/auth";

// API Service
const API_BASE_URL = 'http://localhost:3000'; // Update this to your backend URL

export const authAPI = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data: LoginResponse | ErrorResponse = await response.json();
    
    if (!response.ok) {
      throw new Error((data as ErrorResponse).error || 'Login failed');
    }
    
    return data as LoginResponse;
  },
  
  register: async (username: string, password: string): Promise<RegisterResponse> => {
    const response = await fetch(`${API_BASE_URL}/insertUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data: RegisterResponse | ErrorResponse = await response.json();
    
    if (!response.ok) {
      throw new Error((data as ErrorResponse).error || 'Registration failed');
    }
    
    return data as RegisterResponse;
  }
};