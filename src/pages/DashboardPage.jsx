// src/pages/DashboardPage.jsx
import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { useApp }  from "../context/AppContext";
import T from "../styles/tokens";
import fmt from "../utils/formatters";
import { Card, StatCard, Skeleton } from "../components";
import SendMoneyModal    from "./modals/SendMoneyModal";
import AddFundsModal     from "./modals/AddFundsModal";
import ExchangeModal     from "./modals/ExchangeModal";
import RequestMoneyModal from "./modals/RequestMoneyModal";

const DashboardPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const { fetchTransactions, fetchMonthlyData, monthlyData, chartLoading, transactions } = useApp();
  const [modal, setModal] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchTransactions(user.id, {});
      fetchMonthlyData(user.id);
    }
  }, [user?.id]);

  const recentTxns = transactions.slice(0, 5);
  const totalIn    = monthlyData.reduce((s, m) => s + (m.credit || 0), 0);
  const totalOut   = monthlyData.reduce((s, m) => s + (m.debit  || 0), 0);

  const quickActions = [
    { id: "send",     icon: "↑", label: "Send",      color: T.accent, bg: T.accentGlow },
    { id: "add",      icon: "↓", label: "Add Funds",  color: T.green,  bg: T.greenDim  },
    { id: "exchange", icon: "⇄", label: "Exchange",   color: T.gold,   bg: T.goldDim   },
    { id: "request",  icon: "←", label: "Request",    color: T.purple, bg: "rgba(167,139,250,0.12)" },
  ];

  return (
    <div className="fade-up" style={{ padding: "22px 22px 40px" }}>
      {modal === "send"     && <SendMoneyModal     onClose={() => setModal(null)} />}
      {modal === "add"      && <AddFundsModal       onClose={() => setModal(null)} />}
      {modal === "exchange" && <ExchangeModal       onClose={() => setModal(null)} />}
      {modal === "request"  && <RequestMoneyModal   onClose={() => setModal(null)} />}

      {/* Balance hero */}
      <div style={{
        background: `linear-gradient(135deg, rgba(0,198,255,0.1) 0%, rgba(0,144,187,0.05) 100%)`,
        border: `1px solid ${T.accentDim}28`, borderRadius: 20,
        padding: "26px 26px 22px", marginBottom: 20,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -60, right: -60, width: 220, height: 220,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${T.accentGlow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: T.accent, marginBottom: 5, fontWeight: 700 }}>
          Total Balance
        </div>
        <div style={{ fontFamily: T.fontDisplay, fontSize: 42, color: T.textPrimary, marginBottom: 6, letterSpacing: "-0.02em" }}>
          {fmt.currency(user?.balance, user?.currency)}
        </div>
        <div style={{ color: T.textSecondary, fontSize: 13, marginBottom: 20 }}>
          <span style={{ color: T.green, fontWeight: 600 }}>▲ 3.2%</span>{" "}
          vs last month · {user?.currency} · {user?.country}
        </div>

        {/* Quick action buttons */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {quickActions.map((a) => (
            <button
              key={a.id}
              onClick={() => setModal(a.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "9px 16px",
                background: a.bg, border: `1px solid ${a.color}33`,
                borderRadius: 11, color: a.color,
                cursor: "pointer", fontSize: 13, fontWeight: 600,
                fontFamily: T.fontBody, transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = `0 4px 16px ${a.bg}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={{ fontSize: 15 }}>{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 12, marginBottom: 20 }}>
        <StatCard label="Total Inflow"  value={fmt.currency(totalIn)}           icon="↑" color={T.green}  trend={3.2}  />
        <StatCard label="Total Outflow" value={fmt.currency(totalOut)}          icon="↓" color={T.red}    trend={-1.4} />
        <StatCard label="Net Savings"   value={fmt.currency(totalIn - totalOut)} icon="≡" color={T.gold}              />
        <StatCard label="Transactions"  value={fmt.number(transactions.length)}  icon="#" color={T.purple} sub="All time" />
      </div>

      {/* Chart + Recents */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16 }}>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, marginBottom: 1 }}>Cash Flow</div>
          <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>Monthly credit vs debit</div>
          {chartLoading ? <Skeleton h={190} /> : (
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="cG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={T.green} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={T.green} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={T.red} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={T.red} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="month" tick={{ fill: T.textMuted, fontSize: 10, fontFamily: T.fontMono }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: T.textMuted, fontSize: 10, fontFamily: T.fontMono }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8, fontFamily: T.fontBody, fontSize: 12 }}
                  formatter={(v, n) => [fmt.currency(v), n === "credit" ? "Inflow" : "Outflow"]} />
                <Area type="monotone" dataKey="credit" stroke={T.green} fill="url(#cG)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="debit"  stroke={T.red}   fill="url(#dG)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card style={{ padding: 0 }}>
          <div style={{ padding: "16px 16px 12px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary }}>Recent</span>
            <button onClick={() => onNavigate("transactions")}
              style={{ background: "none", border: "none", color: T.accent, fontSize: 12, cursor: "pointer", fontFamily: T.fontBody }}>
              All →
            </button>
          </div>

          {recentTxns.length === 0
            ? <div style={{ padding: 32, textAlign: "center", color: T.textMuted, fontSize: 13 }}>No transactions yet</div>
            : recentTxns.map((txn) => (
              <div
                key={txn.id}
                style={{ padding: "11px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.12s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = T.surfaceHigh)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: txn.type === "credit" ? T.greenDim : T.redDim,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
                  }}>
                    {txn.type === "credit" ? "↓" : "↑"}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {txn.description}
                    </div>
                    <div style={{ fontSize: 10, color: T.textMuted }}>{txn.date}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: T.fontMono, color: txn.type === "credit" ? T.green : T.red, flexShrink: 0 }}>
                  {txn.type === "credit" ? "+" : "-"}{fmt.currency(txn.amount, user?.currency)}
                </div>
              </div>
            ))
          }
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
