// src/context/AppContext.js
// Global app state: transactions, charts, filters, pagination.
// Auth state lives in AuthContext — this handles data/UI state only.

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import apiService from "../services/apiService";

const AppContext = createContext(null);

const PAGE_SIZE = 10;

const DEFAULT_FILTERS = {
  type:       "all",
  minAmount:  "",
  maxAmount:  "",
  dateFrom:   "",
  dateTo:     "",
  search:     "",
};

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [monthlyData,  setMonthlyData]  = useState([]);
  const [txnLoading,   setTxnLoading]   = useState(false);
  const [txnError,     setTxnError]     = useState(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [filters,      setFilters]      = useState(DEFAULT_FILTERS);
  const [currentPage,  setCurrentPage]  = useState(1);

  const fetchTransactions = useCallback(async (userId, appliedFilters) => {
    setTxnLoading(true);
    setTxnError(null);
    try {
      const data = await apiService.getTransactions(userId, appliedFilters);
      setTransactions(data);
      setCurrentPage(1);
    } catch (e) {
      setTxnError(e.message);
    } finally {
      setTxnLoading(false);
    }
  }, []);

  const fetchMonthlyData = useCallback(async (userId) => {
    setChartLoading(true);
    try {
      setMonthlyData(await apiService.getMonthlySpending(userId));
    } catch (_) {
      // Chart failure is non-critical — fail silently
    } finally {
      setChartLoading(false);
    }
  }, []);

  // Prepend a new transaction without refetching the whole list
  const prependTransaction = useCallback((txn) => {
    setTransactions((prev) => [txn, ...prev]);
  }, []);

  const paginated  = useMemo(
    () => transactions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [transactions, currentPage]
  );
  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);

  return (
    <AppContext.Provider
      value={{
        transactions,
        paginated,
        totalPages,
        currentPage,
        setCurrentPage,
        monthlyData,
        txnLoading,
        txnError,
        chartLoading,
        filters,
        setFilters,
        fetchTransactions,
        fetchMonthlyData,
        prependTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
