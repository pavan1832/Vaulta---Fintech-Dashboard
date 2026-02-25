// src/pages/modals/AddFundsModal.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApp }  from "../../context/AppContext";
import apiService  from "../../services/apiService";
import T from "../../styles/tokens";
import fmt from "../../utils/formatters";
import { Modal, AlertBox, Btn, FieldSelect } from "../../components";

const METHODS = ["Bank Transfer","Debit Card","Credit Card","UPI","NEFT / RTGS","Wire Transfer"];

const AddFundsModal = ({ onClose }) => {
  const { user, refreshUser }  = useAuth();
  const { prependTransaction } = useApp();
  const [amount,  setAmount]  = useState("");
  const [method,  setMethod]  = useState("Bank Transfer");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [done,    setDone]    = useState(null);
  const parsed = parseFloat(amount) || 0;

  const handleAdd = async () => {
    if (parsed <= 0) { setError("Enter a valid amount."); return; }
    setLoading(true); setError("");
    try {
      const r = await apiService.addFunds({ userId: user.id, amount: parsed, method });
      refreshUser({ balance: r.newBalance });
      prependTransaction(r.txn);
      setDone(r);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  if (done) return (
    <Modal title="Funds Added" onClose={onClose}>
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <div style={{ width: 64, height: 64, background: T.accentGlow, border: `2px solid ${T.accent}44`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 18px" }}>↓</div>
        <div style={{ fontFamily: T.fontDisplay, fontSize: 36, color: T.accent, marginBottom: 4 }}>{fmt.currency(parsed, user.currency)}</div>
        <div style={{ color: T.textSecondary, fontSize: 14, marginBottom: 22 }}>Added via {method}</div>
        <div style={{ background: T.surfaceHigh, borderRadius: 12, padding: 16, marginBottom: 20, textAlign: "left" }}>
          {[["New Balance", fmt.currency(done.newBalance, user.currency)], ["Reference", done.txn.reference]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 13, color: T.textMuted }}>{k}</span>
              <span style={{ fontSize: 13, fontFamily: T.fontMono, color: T.textPrimary }}>{v}</span>
            </div>
          ))}
        </div>
        <Btn onClick={onClose} style={{ width: "100%" }}>Done</Btn>
      </div>
    </Modal>
  );

  return (
    <Modal title="Add Funds" subtitle="Top up your Borderless account" onClose={onClose}>
      {error && <AlertBox type="error" onClose={() => setError("")}>{error}</AlertBox>}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: T.textSecondary, marginBottom: 5, letterSpacing: "0.07em", textTransform: "uppercase" }}>
            Amount ({user.currency})
          </label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: T.textMuted, fontSize: 16, fontFamily: T.fontMono }}>$</span>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="0" step="0.01" placeholder="0.00"
              style={{ width: "100%", padding: "11px 14px 11px 32px", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 10, color: T.textPrimary, fontSize: 22, fontFamily: T.fontMono, outline: "none" }}
              onFocus={(e) => (e.target.style.borderColor = T.accent)}
              onBlur={(e)  => (e.target.style.borderColor = T.border)}
            />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {[500, 1000, 2500, 5000, 10000].map((v) => (
              <button key={v} onClick={() => setAmount(String(v))}
                style={{ padding: "6px 14px", background: amount === String(v) ? `${T.accent}18` : T.surfaceHigh, border: `1px solid ${amount === String(v) ? T.accent : T.border}`, borderRadius: 8, color: amount === String(v) ? T.accent : T.textSecondary, fontSize: 12, cursor: "pointer", fontFamily: T.fontMono, transition: "all 0.14s" }}>
                ${v.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <FieldSelect label="Payment Method" value={method} onChange={(e) => setMethod(e.target.value)}
          options={METHODS.map((m) => ({ value: m, label: m }))} />

        <div style={{ background: T.surfaceHigh, borderRadius: 10, padding: "11px 14px", fontSize: 12, color: T.textMuted }}>
          💡 Bank transfers take 1–2 business days. UPI and card deposits are instant.
        </div>

        <Btn onClick={handleAdd} loading={loading} size="lg" style={{ width: "100%" }} icon="↓">
          Add {parsed > 0 ? fmt.currency(parsed, user.currency) : "Funds"}
        </Btn>
      </div>
    </Modal>
  );
};

export default AddFundsModal;
