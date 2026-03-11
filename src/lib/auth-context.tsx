'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'ngo' | 'volunteer';
};

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'volunteer' | 'ngo', referrerId?: string | null) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('mockAdminUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (password === 'password') { // Dummy password check
          const mockUser: User = { 
            id: 'admin-1', 
            name: 'Priya Sharma', 
            email, 
            role: 'admin' 
          };
          setUser(mockUser);
          localStorage.setItem('mockAdminUser', JSON.stringify(mockUser));
          router.push('/dashboard');
          resolve();
        } else {
          reject(new Error('Invalid credentials (use password "password")'));
        }
      }, 500);
    });
  };

  const signup = async (name: string, email: string, password: string, role: 'volunteer' | 'ngo', referrerId?: string | null) => {
    // Mock API call - updated to be internal or for NGO registration
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newUser: User = { id: Date.now().toString(), name, email, role };
        setUser(newUser);
        localStorage.setItem('mockAdminUser', JSON.stringify(newUser));
        router.push('/dashboard');
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockAdminUser');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
