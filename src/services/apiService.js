// src/services/apiService.js
// All API calls are isolated here. Components never call these directly —
// they go through context actions or custom hooks.

import DB, { FX_RATES } from "./mockDb";
import fmt from "../utils/formatters";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const mkToken = (user) =>
  btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 }));

const apiService = {
  // ── AUTH ────────────────────────────────────────────────────────────────────

  async login(email, password) {
    await delay(800);
    const user = DB.users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error("Invalid email or password.");
    const { password: _, ...safe } = user;
    return { token: mkToken(user), user: safe };
  },

  async signup(name, email, password) {
    await delay(1000);
    if (DB.users.find((u) => u.email === email))
      throw new Error("Email already registered.");
    const nu = {
      id:       `usr_${Date.now()}`,
      name,
      email,
      password,
      role:     "user",
      avatar:   name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
      currency: "USD",
      balance:  0,
      country:  "IN→US",
      joined:   new Date().toISOString().split("T")[0],
    };
    DB.users.push(nu);
    DB.transactions[nu.id] = [];
    const { password: _, ...safe } = nu;
    return {
      token: mkToken(nu),
      user:  safe,
    };
  },

  // ── TRANSACTIONS ─────────────────────────────────────────────────────────────

  async getTransactions(userId, filters = {}) {
    await delay(450);
    let txns = [...(DB.transactions[userId] || [])];
    if (filters.type && filters.type !== "all")
      txns = txns.filter((t) => t.type === filters.type);
    if (filters.minAmount)
      txns = txns.filter((t) => t.amount >= parseFloat(filters.minAmount));
    if (filters.maxAmount)
      txns = txns.filter((t) => t.amount <= parseFloat(filters.maxAmount));
    if (filters.dateFrom)
      txns = txns.filter((t) => t.date >= filters.dateFrom);
    if (filters.dateTo)
      txns = txns.filter((t) => t.date <= filters.dateTo);
    if (filters.search)
      txns = txns.filter(
        (t) =>
          t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          t.reference.toLowerCase().includes(filters.search.toLowerCase())
      );
    return txns;
  },

  async getMonthlySpending(userId) {
    await delay(380);
    const txns = DB.transactions[userId] || [];
    const monthly = {};
    txns.forEach((t) => {
      const k = t.date.slice(0, 7);
      if (!monthly[k]) monthly[k] = { month: k, credit: 0, debit: 0 };
      monthly[k][t.type] += t.amount;
    });
    return Object.values(monthly)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-7)
      .map((x) => ({
        ...x,
        month: new Date(x.month + "-01").toLocaleString("default", {
          month: "short", year: "2-digit",
        }),
      }));
  },

  // ── PAYMENTS ─────────────────────────────────────────────────────────────────

  async sendMoney({ fromUserId, toEmail, amount, note }) {
    await delay(1100);
    const sender    = DB.users.find((u) => u.id === fromUserId);
    const recipient = DB.users.find((u) => u.email === toEmail);

    if (!recipient)                throw new Error("No Borderless account found for that email.");
    if (recipient.id === fromUserId) throw new Error("You cannot send money to yourself.");
    if (amount <= 0)               throw new Error("Amount must be greater than zero.");
    if (sender.balance < amount)   throw new Error(
      `Insufficient balance. Available: ${fmt.currency(sender.balance, sender.currency)}`
    );

    sender.balance    = parseFloat((sender.balance - amount).toFixed(2));
    recipient.balance = parseFloat((recipient.balance + amount).toFixed(2));

    const ref   = `REF${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    const today = new Date().toISOString().split("T")[0];

    const debitTxn = {
      id: `txn_${fromUserId}_${Date.now()}`, date: today,
      description: `Sent to ${recipient.name}`, category: "Transfer",
      amount, type: "debit", status: "completed", reference: ref, note,
    };
    const creditTxn = {
      id: `txn_${recipient.id}_${Date.now() + 1}`, date: today,
      description: `Received from ${sender.name}`, category: "Transfer",
      amount, type: "credit", status: "completed", reference: ref, note,
    };

    DB.transactions[fromUserId] = [debitTxn, ...(DB.transactions[fromUserId] || [])];
    if (DB.transactions[recipient.id])
      DB.transactions[recipient.id] = [creditTxn, ...DB.transactions[recipient.id]];

    return { debitTxn, newBalance: sender.balance, recipientName: recipient.name };
  },

  async addFunds({ userId, amount, method }) {
    await delay(950);
    const user = DB.users.find((u) => u.id === userId);
    if (amount <= 0)     throw new Error("Amount must be greater than zero.");
    if (amount > 50000)  throw new Error("Maximum single deposit is $50,000.");

    user.balance = parseFloat((user.balance + amount).toFixed(2));
    const ref = `DEP${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    const txn = {
      id: `txn_${userId}_${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      description: `Funds added via ${method}`,
      category: "Deposit", amount, type: "credit",
      status: "completed", reference: ref, note: "",
    };
    DB.transactions[userId] = [txn, ...(DB.transactions[userId] || [])];
    return { txn, newBalance: user.balance };
  },

  async exchangeCurrency({ userId, fromCurrency, toCurrency, fromAmount }) {
    await delay(1050);
    const user = DB.users.find((u) => u.id === userId);
    const rate = (FX_RATES[fromCurrency] || {})[toCurrency];
    if (!rate)            throw new Error("Currency pair not supported.");
    if (fromAmount <= 0)  throw new Error("Amount must be greater than zero.");

    const fee          = parseFloat((fromAmount * 0.005).toFixed(2));
    const totalDeducted = parseFloat((fromAmount + fee).toFixed(2));
    if (user.balance < totalDeducted)
      throw new Error(`Need ${fmt.currency(totalDeducted, fromCurrency)} incl. 0.5% fee.`);

    const toAmount = parseFloat((fromAmount * rate).toFixed(2));
    user.balance   = parseFloat((user.balance - totalDeducted).toFixed(2));

    const ref = `FX${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    const txn = {
      id: `txn_${userId}_${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      description: `FX: ${fromCurrency}→${toCurrency} @ ${rate.toFixed(4)}`,
      category: "Exchange", amount: fromAmount, type: "debit",
      status: "completed", reference: ref,
      note: `Received ${fmt.currency(toAmount, toCurrency)}`,
    };
    DB.transactions[userId] = [txn, ...(DB.transactions[userId] || [])];
    return { txn, toAmount, rate, fee, newBalance: user.balance };
  },

  // ── HELPERS ──────────────────────────────────────────────────────────────────

  async getRecipients(userId) {
    await delay(250);
    return DB.users
      .filter((u) => u.id !== userId && u.role !== "admin")
      .map(({ password: _, ...u }) => u);
  },

  async getAllUsers() {
    await delay(550);
    return DB.users.filter((u) => u.role !== "admin").map(({ password: _, ...u }) => u);
  },

  async getUserTransactions(userId) {
    await delay(380);
    return DB.transactions[userId] || [];
  },

  async getAdminMetrics() {
    await delay(380);
    const users   = DB.users.filter((u) => u.role !== "admin");
    const allTxns = Object.values(DB.transactions).flat();
    return {
      totalUsers:        users.length,
      totalVolume:       allTxns.reduce((s, t) => s + t.amount, 0).toFixed(2),
      totalTransactions: allTxns.length,
      activeToday:       2,
    };
  },

  getFxRates: (from) => FX_RATES[from] || {},
};

export default apiService;
