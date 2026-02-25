// src/context/AuthContext.js
// Manages authentication state globally.
// Exposes: user, loading, login, signup, logout, refreshUser, isAdmin

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiService from "../services/apiService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate session from sessionStorage on app load
  useEffect(() => {
    try {
      const tok = sessionStorage.getItem("bb_tok");
      const usr = sessionStorage.getItem("bb_usr");
      if (tok && usr) {
        const decoded = JSON.parse(atob(tok));
        if (decoded.exp > Date.now()) {
          setUser(JSON.parse(usr));
        } else {
          sessionStorage.clear();
        }
      }
    } catch (_) {
      sessionStorage.clear();
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, user } = await apiService.login(email, password);
    setUser(user);
    sessionStorage.setItem("bb_tok", token);
    sessionStorage.setItem("bb_usr", JSON.stringify(user));
    return user;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const { token, user } = await apiService.signup(name, email, password);
    setUser(user);
    sessionStorage.setItem("bb_tok", token);
    sessionStorage.setItem("bb_usr", JSON.stringify(user));
    return user;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.clear();
  }, []);

  // Patch local user state after balance-changing operations
  const refreshUser = useCallback((updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      sessionStorage.setItem("bb_usr", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        refreshUser,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
