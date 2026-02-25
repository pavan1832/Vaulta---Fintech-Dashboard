// src/utils/formatters.js
// Pure utility functions — no side effects, no imports

/**
 * Format a number as currency string
 * @param {number} amount
 * @param {string} currency - ISO 4217 currency code
 */
export const formatCurrency = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

/**
 * Format a date string to human-readable format
 * @param {string} dateStr - ISO date string e.g. "2024-03-15"
 */
export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

/**
 * Format a number with thousands separators
 * @param {number} n
 */
export const formatNumber = (n) =>
  new Intl.NumberFormat("en-US").format(n);

// Convenience alias object — matches usage in components
const fmt = {
  currency: formatCurrency,
  date:     formatDate,
  number:   formatNumber,
};

export default fmt;
