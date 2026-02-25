// src/pages/modals/RequestMoneyModal.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import T from "../../styles/tokens";
import { Modal, Btn, FieldInput } from "../../components";

const RequestMoneyModal = ({ onClose }) => {
  const { user } = useAuth();
  const [amount,  setAmount]  = useState("");
  const [message, setMessage] = useState("");
  const [copied,  setCopied]  = useState(false);

  const link = `borderless://pay/${user.id}?amount=${amount}&msg=${encodeURIComponent(message)}&to=${user.email}`;

  const copy = () => {
    navigator.clipboard?.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal title="Request Money" subtitle="Generate a payment request to share" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: T.textSecondary, marginBottom: 5, letterSpacing: "0.07em", textTransform: "uppercase" }}>
            Request Amount ({user.currency})
          </label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: T.textMuted, fontSize: 16, fontFamily: T.fontMono }}>$</span>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              min="0" step="0.01" placeholder="0.00"
              style={{ width: "100%", padding: "11px 14px 11px 32px", background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 10, color: T.textPrimary, fontSize: 22, fontFamily: T.fontMono, outline: "none" }}
            />
          </div>
        </div>

        <FieldInput label="Message" value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="For rent, freelance work, etc." />

        <div style={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textSecondary, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
            Payment Link
          </div>
          <div style={{ fontFamily: T.fontMono, fontSize: 11, color: T.textMuted, wordBreak: "break-all", marginBottom: 12, lineHeight: 1.6 }}>
            {link}
          </div>
          <Btn variant={copied ? "ghost" : "primary"} size="sm" onClick={copy} style={{ width: "100%" }}>
            {copied ? "✓ Copied!" : "Copy Payment Link"}
          </Btn>
        </div>

        <div style={{ background: T.surfaceHigh, borderRadius: 10, padding: "11px 14px", fontSize: 12, color: T.textMuted }}>
          💡 Share this link with anyone — they can pay you directly from their Borderless account.
        </div>
      </div>
    </Modal>
  );
};

export default RequestMoneyModal;
