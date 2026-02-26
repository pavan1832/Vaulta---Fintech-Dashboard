// src/pages/AnalyticsPage.jsx
import { useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { useApp }  from "../context/AppContext";
import T from "../styles/tokens";
import fmt from "../utils/formatters";
import { Card, Skeleton } from "../components";

const COLORS = [T.accent, T.green, T.gold, T.red, T.purple, "#FB923C", "#34D399", "#60A5FA"];

const CATEGORY_DATA = [
  { name: "Salary",     value: 3200 },
  { name: "Rent",       value: 1500 },
  { name: "Investment", value: 1200 },
  { name: "Transfer",   value: 950  },
  { name: "Freelance",  value: 750  },
  { name: "Food",       value: 820  },
  { name: "Shopping",   value: 640  },
  { name: "Utilities",  value: 280  },
];

const AnalyticsPage = () => {
  const { user } = useAuth();
  const { monthlyData, chartLoading, fetchMonthlyData } = useApp();

    useEffect(() => {
    if (user?.id) fetchMonthlyData(user.id);
  }, [user?.id]);

  const total = CATEGORY_DATA.reduce((s, c) => s + c.value, 0);

  return (
    <div className="fade-up" style={{ padding: "22px 22px 40px" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: T.fontDisplay, fontSize: 24, color: T.textPrimary, marginBottom: 2 }}>Analytics</h2>
        <p style={{ fontSize: 13, color: T.textSecondary }}>Financial patterns and spending insights</p>
      </div>

      {/* Bar chart */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, marginBottom: 1 }}>Monthly Volume</div>
        <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>Credit vs debit per month</div>
        {chartLoading ? <Skeleton h={230} /> : (
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={monthlyData} barCategoryGap="22%">
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: T.textMuted, fontSize: 10, fontFamily: T.fontMono }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.textMuted, fontSize: 10, fontFamily: T.fontMono }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8, fontFamily: T.fontBody, fontSize: 12 }}
                formatter={(v, n) => [fmt.currency(v), n === "credit" ? "Inflow" : "Outflow"]}
              />
              <Legend formatter={(v) => <span style={{ color: T.textSecondary, fontSize: 12 }}>{v === "credit" ? "Inflow" : "Outflow"}</span>} />
              <Bar dataKey="credit" name="credit" fill={T.green} radius={[4, 4, 0, 0]} />
              <Bar dataKey="debit"  name="debit"  fill={T.red}   radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Pie */}
        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, marginBottom: 14 }}>By Category</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={CATEGORY_DATA} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                {CATEGORY_DATA.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 8, fontFamily: T.fontBody, fontSize: 12 }}
                formatter={(v) => fmt.currency(v)}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Progress bars */}
        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, marginBottom: 14 }}>Breakdown</div>
          {CATEGORY_DATA.sort((a, b) => b.value - a.value).map((c, i) => {
            const pct = ((c.value / total) * 100).toFixed(1);
            return (
              <div key={c.name} style={{ marginBottom: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: T.textPrimary }}>{c.name}</span>
                  </div>
                  <span style={{ fontSize: 12, fontFamily: T.fontMono, color: T.textSecondary }}>{fmt.currency(c.value)}</span>
                </div>
                <div style={{ height: 4, background: T.border, borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: COLORS[i % COLORS.length], borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
