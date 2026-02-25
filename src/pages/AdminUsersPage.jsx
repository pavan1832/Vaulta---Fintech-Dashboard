// src/pages/AdminUsersPage.jsx
import { useEffect } from "react";
import useAdminData from "../hooks/useAdminData";
import T from "../styles/tokens";
import fmt from "../utils/formatters";
import { Card, Btn, Avatar, Badge, Skeleton } from "../components";

const AdminUsersPage = () => {
  const {
    users, loading, loadData,
    selectedUser, selectedTxns, viewUserTransactions, clearSelectedUser,
  } = useAdminData();

  useEffect(() => { loadData(); }, []);

  return (
    <div className="fade-up" style={{ padding: "22px 22px 40px" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: T.fontDisplay, fontSize: 24, color: T.textPrimary, marginBottom: 1 }}>
          User Management
        </h2>
        <p style={{ fontSize: 13, color: T.textSecondary }}>{users.length} accounts</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selectedUser ? "1fr 1fr" : "1fr", gap: 16 }}>
        {/* Users table */}
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary }}>All Users</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: T.surfaceHigh }}>
                {["User", "Country", "Balance", "Joined", ""].map((h) => (
                  <th key={h} style={{ padding: "10px 13px", textAlign: "left", fontSize: 10, fontWeight: 700, color: T.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: `1px solid ${T.border}` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} style={{ padding: "12px 13px" }}>
                        <Skeleton h={18} />
                      </td>
                    </tr>
                  ))
                : users.map((u) => (
                  <tr
                    key={u.id}
                    style={{ borderBottom: `1px solid ${T.border}`, background: selectedUser?.id === u.id ? T.surfaceHigh : "transparent", transition: "background 0.12s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = T.surfaceHigh)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = selectedUser?.id === u.id ? T.surfaceHigh : "transparent")}
                  >
                    <td style={{ padding: "10px 13px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <Avatar initials={u.avatar} size={28} color={T.gold} />
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary }}>{u.name}</div>
                          <div style={{ fontSize: 10, color: T.textMuted }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "10px 13px", fontSize: 12, color: T.textSecondary }}>{u.country}</td>
                    <td style={{ padding: "10px 13px", fontSize: 12, fontFamily: T.fontMono, color: T.textPrimary }}>{fmt.currency(u.balance, u.currency)}</td>
                    <td style={{ padding: "10px 13px", fontSize: 11, color: T.textMuted, fontFamily: T.fontMono }}>{u.joined}</td>
                    <td style={{ padding: "10px 13px" }}>
                      <Btn size="sm" variant="ghost" onClick={() => viewUserTransactions(u)}>Txns →</Btn>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </Card>

        {/* Transaction drill-down panel */}
        {selectedUser && (
          <Card style={{ padding: 0, overflow: "hidden" }} className="slide-r">
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary }}>{selectedUser.name}</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>{selectedTxns.length} transactions</div>
              </div>
              <button
                onClick={clearSelectedUser}
                style={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 7, color: T.textMuted, width: 26, height: 26, cursor: "pointer", fontSize: 13 }}
              >
                ✕
              </button>
            </div>
            <div style={{ maxHeight: 480, overflowY: "auto" }}>
              {selectedTxns.slice(0, 30).map((t) => (
                <div
                  key={t.id}
                  style={{ padding: "10px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.12s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = T.surfaceHigh)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div>
                    <div style={{ fontSize: 12, color: T.textPrimary, fontWeight: 500 }}>{t.description}</div>
                    <div style={{ fontSize: 10, color: T.textMuted, marginTop: 2 }}>{t.date} · {t.category}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, fontFamily: T.fontMono, color: t.type === "credit" ? T.green : T.red }}>
                      {t.type === "credit" ? "+" : "-"}{fmt.currency(t.amount)}
                    </div>
                    <div style={{ marginTop: 3 }}><Badge type={t.status} /></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
