// src/pages/TransactionsPage.jsx
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useApp }  from "../context/AppContext";
import T from "../styles/tokens";
import fmt from "../utils/formatters";
import { Card, Btn, FieldInput, FieldSelect, Badge, Skeleton } from "../components";

const TransactionsPage = () => {
  const { user } = useAuth();
  const {
    paginated, totalPages, currentPage, setCurrentPage,
    txnLoading, txnError, transactions,
    filters, setFilters, fetchTransactions,
  } = useApp();

  useEffect(() => {
    if (user?.id) fetchTransactions(user.id, filters);
  }, [user?.id]);

  const apply = () => fetchTransactions(user.id, filters);
  const reset = () => {
    const r = { type: "all", minAmount: "", maxAmount: "", dateFrom: "", dateTo: "", search: "" };
    setFilters(r);
    fetchTransactions(user.id, r);
  };

  return (
    <div className="fade-up" style={{ padding: "22px 22px 40px" }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontFamily: T.fontDisplay, fontSize: 24, color: T.textPrimary, marginBottom: 1 }}>
          Transaction History
        </h2>
        <p style={{ fontSize: 13, color: T.textSecondary }}>{transactions.length} records</p>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 18, padding: "16px 18px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px,1fr))", gap: 12, marginBottom: 12 }}>
          <FieldInput label="Search" value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Description, ref…" />
          <FieldSelect label="Type" value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            options={[
              { value: "all",    label: "All Types" },
              { value: "credit", label: "Credit"    },
              { value: "debit",  label: "Debit"     },
            ]} />
          <FieldInput label="Min $" type="number" value={filters.minAmount}
            onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })} placeholder="0" />
          <FieldInput label="Max $" type="number" value={filters.maxAmount}
            onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })} placeholder="9999" />
          <FieldInput label="From" type="date" value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            style={{ colorScheme: "dark" }} />
          <FieldInput label="To"   type="date" value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            style={{ colorScheme: "dark" }} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={apply} size="sm" icon="⌕">Apply</Btn>
          <Btn onClick={reset} variant="ghost" size="sm">Reset</Btn>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: T.surfaceHigh }}>
                {["Date","Description","Category","Reference","Amount","Type","Status"].map((h) => (
                  <th key={h} style={{
                    padding: "11px 14px", textAlign: "left", fontSize: 10,
                    fontWeight: 700, color: T.textMuted, letterSpacing: "0.08em",
                    textTransform: "uppercase", borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {txnLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {[70, 110, 80, 100, 65, 60, 60].map((w, j) => (
                        <td key={j} style={{ padding: "12px 14px" }}>
                          <Skeleton h={13} w={w} />
                        </td>
                      ))}
                    </tr>
                  ))
                : txnError
                  ? <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: T.red }}>⚠ {txnError}</td></tr>
                  : paginated.length === 0
                    ? (
                      <tr>
                        <td colSpan={7} style={{ padding: 52, textAlign: "center", color: T.textMuted }}>
                          <div style={{ fontSize: 26, marginBottom: 10 }}>📭</div>
                          <div>No transactions match your filters.</div>
                        </td>
                      </tr>
                    )
                    : paginated.map((txn) => (
                      <tr
                        key={txn.id}
                        style={{ borderBottom: `1px solid ${T.border}`, transition: "background 0.12s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = T.surfaceHigh)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "12px 14px", fontSize: 11, color: T.textSecondary, fontFamily: T.fontMono, whiteSpace: "nowrap" }}>
                          {fmt.date(txn.date)}
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>{txn.description}</div>
                          {txn.note && <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{txn.note}</div>}
                        </td>
                        <td style={{ padding: "12px 14px", fontSize: 12, color: T.textMuted }}>{txn.category}</td>
                        <td style={{ padding: "12px 14px", fontSize: 10, color: T.textMuted, fontFamily: T.fontMono }}>{txn.reference}</td>
                        <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 700, fontFamily: T.fontMono, color: txn.type === "credit" ? T.green : T.red, whiteSpace: "nowrap" }}>
                          {txn.type === "credit" ? "+" : "-"}{fmt.currency(txn.amount, user?.currency)}
                        </td>
                        <td style={{ padding: "12px 14px" }}><Badge type={txn.type} /></td>
                        <td style={{ padding: "12px 14px" }}><Badge type={txn.status} /></td>
                      </tr>
                    ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", borderTop: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 12, color: T.textMuted }}>
              Page {currentPage} of {totalPages} · {transactions.length} total
            </span>
            <div style={{ display: "flex", gap: 5 }}>
              <Btn variant="ghost" size="sm" disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}>←</Btn>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return p <= totalPages
                  ? <Btn key={p} size="sm" variant={p === currentPage ? "primary" : "ghost"}
                      onClick={() => setCurrentPage(p)} style={{ minWidth: 32 }}>{p}</Btn>
                  : null;
              })}
              <Btn variant="ghost" size="sm" disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}>→</Btn>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TransactionsPage;
