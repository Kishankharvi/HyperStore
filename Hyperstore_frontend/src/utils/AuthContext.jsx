import React from "react"; 
import apiService from "./api";
import toast from 'react-hot-toast';


const { createContext, useState, useEffect } = React;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      apiService.setToken(token);
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await apiService.getCurrentUser();
      setUser(response.user);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      apiService.setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      apiService.setToken(response.token);
      setUser(response.user);
      toast.success("Logged in successfully!");
      return response;
    } catch (error) {
      toast.error(error.message || "Invalid credentials");
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      apiService.setToken(response.token);
      setUser(response.user);
      toast.success("Registration successful!");
      return response;
    } catch (error) {
      toast.error(error.message || "Registration failed.");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      apiService.setToken(null);
      setUser(null);
      toast.success("Logged out successfully");
    }
  };



  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    logout,
    fetchCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};