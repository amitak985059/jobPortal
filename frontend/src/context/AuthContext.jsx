import React, { createContext, useContext, useState } from 'react';
import { loginAPI, logoutAPI } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  
  const navigate = useNavigate();

  const login = async (credentials) => {
    try {
      const data = await loginAPI(credentials);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      navigate('/createJob');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await logoutAPI();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setToken(null);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
