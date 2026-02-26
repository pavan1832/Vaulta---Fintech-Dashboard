// src/pages/modals/SendMoneyModal.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApp }  from "../../context/AppContext";
import apiService  from "../../services/apiService";
import T from "../../styles/tokens";
import fmt from "../../utils/formatters";
import { Modal, AlertBox, Btn, FieldInput, Avatar } from "../../components";

const SendMoneyModal = ({ onClose }) => {
  const { user, refreshUser }  = useAuth();
  const { prependTransaction } = useApp();
  const [step, setStep]       = useState(1);
  const [toEmail, setToEmail] = useState("");
  const [amount,  setAmount]  = useState("");
  const [note,    setNote]    = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [result,  setResult]  = useState(null);
  const [recipients, setRecipients] = useState([]);

  useEffect(() => { apiService.getRecipients(user.id).then(setRecipients); }, [user.id]);

  const parsed    = parseFloat(amount) || 0;
  const selectedR = recipients.find((r) => r.email === toEmail);

  const validate = () => {
    if (!toEmail)              return "Please enter a recipient email.";
    if (!toEmail.includes("@")) return "Enter a valid email address.";
    if (!amount || parsed <= 0) return "Enter a valid amount.";
    if (parsed > user.balance)  return `Insufficient funds. Balance: ${fmt.currency(user.balance, user.currency)}`;
    return null;
  };

  const handleReview = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError(""); setStep(2);
  };

  const handleConfirm = async () => {
    setLoading(true); setError("");
    try {
      const r = await apiService.sendMoney({ fromUserId: user.id, toEmail, amount: parsed, note });
      refreshUser({ balance: r.newBalance });
      prependTransaction(r.debitTxn);
      setResult(r); setStep(3);
    } catch (e) { setError(e.message); setStep(1); }
    finally { setLoading(false); }
  };

  // ── Step 3: success ─────────────────────────────────────────────────────────
  if (step === 3 && result) return (
    <Modal title="Transfer Complete" onClose={onClose}>
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <div style={{ width: 68, height: 68, background: T.greenDim, border: `2px solid ${T.green}44`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 18px" }}>✓</div>
        <div style={{ fontFamily: T.fontDisplay, fontSize: 36, color: T.green, marginBottom: 4 }}>{fmt.currency(parsed, user.currency)}</div>
        <div style={{ color: T.textSecondary, fontSize: 14, marginBottom: 22 }}>
          Sent to <strong style={{ color: T.textPrimary }}>{result.recipientName}</strong>
        </div>
        <div style={{ background: T.surfaceHigh, borderRadius: 12, padding: 16, marginBottom: 20, textAlign: "left" }}>
          {[["Reference", result.debitTxn.reference], ["New Balance", fmt.currency(result.newBalance, user.currency)], ["Status", "Completed"]].map(([k, v]) => (
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
    <Modal title="Send Money" subtitle="Transfer to any Borderless user instantly" onClose={onClose}>
      {error && <AlertBox type="error" onClose={() => setError("")}>{error}</AlertBox>}

      {/* ── Step 1: Form ── */}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {recipients.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.textSecondary, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Quick Select</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {recipients.map((r) => (
                  <button key={r.id} onClick={() => setToEmail(r.email)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "8px 14px",
                      background: toEmail === r.email ? `${T.accent}18` : T.surfaceHigh,
                      border: `1px solid ${toEmail === r.email ? T.accent : T.border}`,
                      borderRadius: 10, cursor: "pointer", transition: "all 0.14s",
                    }}>
                    <Avatar initials={r.avatar} size={26} color={T.gold} />
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary }}>{r.name.split(" ")[0]}</div>
                      <div style={{ fontSize: 10, color: T.textMuted }}>{r.country}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <FieldInput label="Recipient Email" type="email" value={toEmail}
            onChange={(e) => setToEmail(e.target.value)} placeholder="recipient@borderless.io" />

          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: T.textSecondary, marginBottom: 5, letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Amount ({user.currency})
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: T.textMuted, fontSize: 16, fontFamily: T.fontMono }}>$</span>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                min="0" step="0.01" placeholder="0.00"
                style={{ width: "100%", padding: "11px 14px 11px 32px", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 10, color: T.textPrimary, fontSize: 20, fontFamily: T.fontMono, outline: "none" }}
                onFocus={(e) => (e.target.style.borderColor = T.accent)}
                onBlur={(e)  => (e.target.style.borderColor = T.border)}
              />
            </div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 5 }}>
              Available: {fmt.currency(user.balance, user.currency)}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {[25, 50, 100, 250, 500].map((v) => (
                <button key={v} onClick={() => setAmount(String(v))}
                  style={{
                    padding: "5px 12px",
                    background: amount === String(v) ? `${T.accent}18` : T.surfaceHigh,
                    border: `1px solid ${amount === String(v) ? T.accent : T.border}`,
                    borderRadius: 8, color: amount === String(v) ? T.accent : T.textSecondary,
                    fontSize: 12, cursor: "pointer", fontFamily: T.fontMono, transition: "all 0.14s",
                  }}>
                  ${v}
                </button>
              ))}
            </div>
          </div>

          <FieldInput label="Note (optional)" value={note}
            onChange={(e) => setNote(e.target.value)} placeholder="Rent, dinner, etc." />

          <Btn onClick={handleReview} size="lg" style={{ width: "100%" }} icon="→">Review Transfer</Btn>
        </div>
      )}

      {/* ── Step 2: Confirm ── */}
      {step === 2 && (
        <div>
          <div style={{ background: T.surfaceHigh, borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 4 }}>You're sending</div>
              <div style={{ fontFamily: T.fontDisplay, fontSize: 38, color: T.textPrimary }}>
                {fmt.currency(parsed, user.currency)}
              </div>
            </div>
            {[
              ["To",           selectedR ? `${selectedR.name} (${toEmail})` : toEmail],
              ["From",         `${user.name} · ${user.currency}`],
              ["Fee",          "Free · Borderless-to-Borderless"],
              ...(note ? [["Note", note]] : []),
              ["Balance After", fmt.currency(user.balance - parsed, user.currency)],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 13, color: T.textMuted }}>{k}</span>
                <span style={{ fontSize: 13, color: T.textPrimary, fontWeight: 500, maxWidth: "58%", textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</Btn>
            <Btn variant="green" onClick={handleConfirm} loading={loading} style={{ flex: 2 }}>Confirm & Send</Btn>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default SendMoneyModal;
