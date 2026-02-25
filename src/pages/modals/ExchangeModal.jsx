// src/pages/modals/ExchangeModal.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApp }  from "../../context/AppContext";
import apiService  from "../../services/apiService";
import { FX_RATES } from "../../services/mockDb";
import T from "../../styles/tokens";
import fmt from "../../utils/formatters";
import { Modal, AlertBox, Btn } from "../../components";

const CURRENCIES = ["USD","EUR","GBP","INR","AED","SGD","CAD","AUD"];

const ExchangeModal = ({ onClose }) => {
  const { user, refreshUser }  = useAuth();
  const { prependTransaction } = useApp();
  const [fromCur, setFromCur] = useState(user.currency || "USD");
  const [toCur,   setToCur]   = useState("INR");
  const [fromAmt, setFromAmt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [done,    setDone]    = useState(null);

  const rate    = (FX_RATES[fromCur] || {})[toCur] || 0;
  const parsed  = parseFloat(fromAmt) || 0;
  const toAmt   = parsed > 0 ? (parsed * rate).toFixed(2) : "0.00";
  const fee     = parsed > 0 ? (parsed * 0.005).toFixed(2) : "0.00";

  const handleExchange = async () => {
    if (parsed <= 0)        { setError("Enter a valid amount."); return; }
    if (fromCur === toCur)  { setError("Select different currencies."); return; }
    setLoading(true); setError("");
    try {
      const r = await apiService.exchangeCurrency({ userId: user.id, fromCurrency: fromCur, toCurrency: toCur, fromAmount: parsed });
      refreshUser({ balance: r.newBalance });
      prependTransaction(r.txn);
      setDone(r);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const swap = () => { const t = fromCur; setFromCur(toCur); setToCur(t); };

  const selectStyle = { padding: "10px 12px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, color: T.textPrimary, fontSize: 14, fontWeight: 700, outline: "none", cursor: "pointer", minWidth: 88 };

  if (done) return (
    <Modal title="Exchange Complete" onClose={onClose}>
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <div style={{ width: 64, height: 64, background: T.goldDim, border: `2px solid ${T.gold}44`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 18px" }}>⇄</div>
        <div style={{ fontFamily: T.fontDisplay, fontSize: 28, color: T.gold, marginBottom: 4 }}>
          {fmt.currency(parsed, fromCur)} → {fmt.currency(done.toAmount, toCur)}
        </div>
        <div style={{ color: T.textSecondary, fontSize: 13, marginBottom: 22 }}>
          Rate: 1 {fromCur} = {done.rate.toFixed(4)} {toCur}
        </div>
        <div style={{ background: T.surfaceHigh, borderRadius: 12, padding: 16, marginBottom: 20, textAlign: "left" }}>
          {[["Fee (0.5%)", fmt.currency(done.fee, fromCur)], ["New Balance", fmt.currency(done.newBalance, fromCur)], ["Reference", done.txn.reference]].map(([k, v]) => (
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
    <Modal title="Currency Exchange" subtitle="Convert between 8 currencies at live rates" onClose={onClose}>
      {error && <AlertBox type="error" onClose={() => setError("")}>{error}</AlertBox>}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* From */}
        <div style={{ background: T.surfaceHigh, borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textSecondary, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>You Send</div>
          <div style={{ display: "flex", gap: 10 }}>
            <select value={fromCur} onChange={(e) => setFromCur(e.target.value)} style={selectStyle}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="number" value={fromAmt} onChange={(e) => setFromAmt(e.target.value)}
              placeholder="0.00" min="0" step="0.01"
              style={{ flex: 1, padding: "10px 14px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, color: T.textPrimary, fontSize: 22, fontFamily: T.fontMono, outline: "none" }}
              onFocus={(e) => (e.target.style.borderColor = T.accent)}
              onBlur={(e)  => (e.target.style.borderColor = T.border)}
            />
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 8 }}>
            Balance: {fmt.currency(user.balance, user.currency)}
          </div>
        </div>

        {/* Swap button */}
        <div style={{ textAlign: "center" }}>
          <button onClick={swap} style={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: "50%", width: 34, height: 34, cursor: "pointer", fontSize: 16, color: T.textSecondary }}>⇅</button>
        </div>

        {/* To */}
        <div style={{ background: T.surfaceHigh, borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textSecondary, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>You Receive</div>
          <div style={{ display: "flex", gap: 10 }}>
            <select value={toCur} onChange={(e) => setToCur(e.target.value)} style={selectStyle}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div style={{ flex: 1, padding: "10px 14px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, color: T.textPrimary, fontSize: 22, fontFamily: T.fontMono, opacity: 0.85 }}>
              {parseFloat(toAmt).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </div>
          {rate > 0 && (
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 8 }}>
              Rate: 1 {fromCur} = {rate.toFixed(4)} {toCur} · Fee: {fmt.currency(parseFloat(fee), fromCur)} (0.5%)
            </div>
          )}
        </div>

        <Btn onClick={handleExchange} loading={loading} variant="gold" size="lg" style={{ width: "100%" }} icon="⇄">
          Exchange {parsed > 0 ? `${fmt.currency(parsed, fromCur)} → ${fmt.currency(parseFloat(toAmt), toCur)}` : "Currencies"}
        </Btn>
      </div>
    </Modal>
  );
};

export default ExchangeModal;
