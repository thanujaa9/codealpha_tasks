import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');
      const email = localStorage.getItem('email');

      console.log("AuthContext: loadUser called.");
      console.log("  Token found:", !!token);
      console.log("  UserId found:", !!userId);
      console.log("  Username from localStorage:", username);
      console.log("  Email from localStorage:", email);

      if (token && userId) {
        setUser({ userId, username, email, token });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('AuthContext: Failed to load user from localStorage:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
      console.log("AuthContext: Loading set to false. Final isAuthenticated state (at log time):", isAuthenticated, "Final User (at log time):", user);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      console.log("AuthContext: Login successful in authService, triggering loadUser...");
      loadUser();
      console.log("AuthContext: loadUser triggered after login. This will cause re-renders.");
      return data;
    } catch (error) {
      console.error("AuthContext: Login failed:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      console.log("AuthContext: Register successful in authService, triggering loadUser...");
      loadUser();
      console.log("AuthContext: loadUser triggered after register. This will cause re-renders.");
      return data;
    } catch (error) {
      console.error("AuthContext: Register failed:", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    console.log("AuthContext: User logged out. State reset.");
  };

  const contextValue = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
