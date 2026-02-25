// src/services/mockDb.js
// In-memory database that simulates a backend.
// All mutations happen here — services read/write this object directly.

const seedTransactions = (userId) => {
  const parties = [
    "Google Pay","Stripe","Bank of America","Wise","Revolut",
    "Payoneer","Amazon","Netflix","Uber","Razorpay",
  ];
  const categories = [
    "Transfer","Salary","Rent","Food","Shopping",
    "Utilities","Investment","Freelance",
  ];

  return Array.from({ length: 48 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(i * 2.8));
    return {
      id:          `txn_${userId}_${i}`,
      date:        d.toISOString().split("T")[0],
      description: parties[i % parties.length],
      category:    categories[i % categories.length],
      amount:      parseFloat((Math.random() * 1800 + 50).toFixed(2)),
      type:        Math.random() > 0.42 ? "credit" : "debit",
      status:      Math.random() > 0.08 ? "completed" : "pending",
      reference:   `REF${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      note:        "",
    };
  }).sort((a, b) => b.date.localeCompare(a.date));
};

// FX mid-market rates (mock)
export const FX_RATES = {
  USD: { USD:1,    EUR:0.92, GBP:0.79, INR:83.2,  AED:3.67, SGD:1.35, CAD:1.36, AUD:1.53 },
  GBP: { USD:1.27, EUR:1.16, GBP:1,   INR:105.4, AED:4.65, SGD:1.71, CAD:1.72, AUD:1.93 },
  EUR: { USD:1.09, GBP:0.86, EUR:1,   INR:90.5,  AED:4.00, SGD:1.47, CAD:1.48, AUD:1.66 },
};

// Mutable in-memory store
const DB = {
  users: [
    {
      id: "usr_001", name: "Arjun Mehta",  email: "arjun@aspora.io",
      password: "demo1234",  role: "user",  avatar: "AM",
      currency: "USD", balance: 24850.75, country: "IN→US", joined: "2023-03-12",
    },
    {
      id: "usr_002", name: "Priya Sharma", email: "priya@aspora.io",
      password: "demo1234",  role: "user",  avatar: "PS",
      currency: "GBP", balance: 11420.00, country: "IN→UK", joined: "2023-06-08",
    },
    {
      id: "usr_003", name: "Admin User",   email: "admin@aspora.io",
      password: "admin1234", role: "admin", avatar: "AU",
      currency: "USD", balance: 0,         country: "US",    joined: "2022-01-01",
    },
  ],
  transactions: {
    usr_001: seedTransactions("usr_001"),
    usr_002: seedTransactions("usr_002"),
  },
};

export default DB;
