// src/pages/AdminOverviewPage.jsx
import { useState, useEffect } from "react";
import apiService from "../services/apiService";
import T from "../styles/tokens";
import fmt from "../utils/formatters";
import { Card, StatCard } from "../components";

const AdminOverviewPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getAdminMetrics().then((m) => { setMetrics(m); setLoading(false); });
  }, []);

  return (
    <div className="fade-up" style={{ padding: "22px 22px 40px" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>
          🛡 Admin
        </div>
        <h2 style={{ fontFamily: T.fontDisplay, fontSize: 24, color: T.textPrimary }}>Platform Overview</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px,1fr))", gap: 12, marginBottom: 20 }}>
        <StatCard label="Total Users"   value={loading ? "—" : metrics?.totalUsers}                    icon="👥" color={T.accent} loading={loading} />
        <StatCard label="Total Volume"  value={loading ? "—" : fmt.currency(metrics?.totalVolume)}      icon="$"  color={T.green}  loading={loading} />
        <StatCard label="Transactions"  value={loading ? "—" : fmt.number(metrics?.totalTransactions)}  icon="≡"  color={T.gold}   loading={loading} />
        <StatCard label="Active Today"  value={loading ? "—" : metrics?.activeToday}                    icon="●"  color={T.green}  loading={loading} sub="Online" />
      </div>

      <Card>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, marginBottom: 16 }}>Platform Health</div>
        {[
          ["API Uptime",           99.98, T.green],
          ["Txn Success Rate",     97.4,  T.accent],
          ["KYC Completion",       84.2,  T.gold],
          ["Support SLA Met",      91.6,  T.green],
          ["Mobile Crash-free",    99.1,  T.green],
        ].map(([label, val, color]) => (
          <div key={label} style={{ marginBottom: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 13, color: T.textPrimary }}>{label}</span>
              <span style={{ fontSize: 13, fontFamily: T.fontMono, color, fontWeight: 700 }}>{val}%</span>
            </div>
            <div style={{ height: 5, background: T.border, borderRadius: 3 }}>
              <div style={{ height: "100%", width: `${val}%`, background: color, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default AdminOverviewPage;
