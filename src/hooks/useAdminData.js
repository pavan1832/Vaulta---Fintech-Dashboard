// src/hooks/useAdminData.js
// Custom hook that encapsulates all admin data fetching logic.
// Keeps AdminPages clean and focused on rendering only.

import { useState, useCallback } from "react";
import apiService from "../services/apiService";

const useAdminData = () => {
  const [users,        setUsers]        = useState([]);
  const [metrics,      setMetrics]      = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTxns, setSelectedTxns] = useState([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [users, metrics] = await Promise.all([
        apiService.getAllUsers(),
        apiService.getAdminMetrics(),
      ]);
      setUsers(users);
      setMetrics(metrics);
    } catch (_) {
      // Fail gracefully — admin panel is non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  const viewUserTransactions = useCallback(async (user) => {
    setSelectedUser(user);
    const txns = await apiService.getUserTransactions(user.id);
    setSelectedTxns(txns);
  }, []);

  const clearSelectedUser = useCallback(() => {
    setSelectedUser(null);
    setSelectedTxns([]);
  }, []);

  return {
    users,
    metrics,
    loading,
    loadData,
    selectedUser,
    selectedTxns,
    viewUserTransactions,
    clearSelectedUser,
  };
};

export default useAdminData;
