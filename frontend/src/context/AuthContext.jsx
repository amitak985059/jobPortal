import React, { createContext, useContext, useState } from 'react';
import { loginAPI, logoutAPI } from '../services/auth.service';
import { registerAPI } from '../services/user.service';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [authUser, setAuthUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('authUser')) || null; } catch { return null; }
  });

  const navigate = useNavigate();

  const login = async (credentials) => {
    try {
      const data = await loginAPI(credentials);
      setToken(data.token);
      setAuthUser(data.data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.data));
      navigate(data.data?.role === 'admin' ? '/createJob' : '/');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const data = await registerAPI(userData);
      setToken(data.token);
      setAuthUser(data.data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.data));
      navigate('/');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try { await logoutAPI(); } catch (e) { console.error(e); }
    setToken(null);
    setAuthUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ token, authUser, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
