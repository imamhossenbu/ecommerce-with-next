'use client'; // Required because we use hooks and localStorage

import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../lib/axiosInstance'; 
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user state with localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUserState(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse user from storage", error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false); // Done checking storage
  }, []);

  // Set user state and update localStorage
  const setUser = (userData) => {
    if (typeof window !== 'undefined') {
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setUserState(userData);
  };

  // Handle login/register data
  const setAuthData = (userData, token) => {
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
    setUser(userData);
  };

  // Logout logic
  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login: setAuthData, 
      register: setAuthData, 
      logout, 
      setUser,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;