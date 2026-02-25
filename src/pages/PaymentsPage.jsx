// src/pages/PaymentsPage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FX_RATES } from "../services/mockDb";
import T from "../styles/tokens";
import fmt from "../utils/formatters";
import { Card } from "../components";
import SendMoneyModal    from "./modals/SendMoneyModal";
import AddFundsModal     from "./modals/AddFundsModal";
import ExchangeModal     from "./modals/ExchangeModal";
import RequestMoneyModal from "./modals/RequestMoneyModal";

const PaymentsPage = () => {
  const { user }  = useAuth();
  const [modal, setModal] = useState(null);

  const tiles = [
    {
      id: "send", icon: "↑", title: "Send Money",
      desc: "Transfer to any Borderless user instantly. Free for all Borderless-to-Borderless transfers.",
      color: T.accent, bg: T.accentGlow,
    },
    {
      id: "add", icon: "↓", title: "Add Funds",
      desc: "Top up via bank transfer, UPI, debit/credit card, or NEFT. Most methods are instant.",
      color: T.green, bg: T.greenDim,
    },
    {
      id: "exchange", icon: "⇄", title: "Exchange Currency",
      desc: "Convert between 8 currencies at live mid-market rates. 0.5% fee, no hidden charges.",
      color: T.gold, bg: T.goldDim,
    },
    {
      id: "request", icon: "←", title: "Request Money",
      desc: "Generate a shareable payment link. Paste it in any chat — anyone can pay you instantly.",
      color: T.purple, bg: "rgba(167,139,250,0.1)",
    },
  ];

  return (
    <div className="fade-up" style={{ padding: "22px 22px 40px" }}>
      {modal === "send"     && <SendMoneyModal     onClose={() => setModal(null)} />}
      {modal === "add"      && <AddFundsModal       onClose={() => setModal(null)} />}
      {modal === "exchange" && <ExchangeModal       onClose={() => setModal(null)} />}
      {modal === "request"  && <RequestMoneyModal   onClose={() => setModal(null)} />}

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: T.fontDisplay, fontSize: 24, color: T.textPrimary, marginBottom: 2 }}>Payments</h2>
        <p style={{ fontSize: 13, color: T.textSecondary }}>Send, receive, and exchange money across borders</p>
      </div>

      {/* Available balance pill */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 12, padding: "9px 16px", marginBottom: 24,
      }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.green, boxShadow: `0 0 6px ${T.green}` }} />
        <span style={{ fontSize: 13, color: T.textSecondary }}>Available Balance</span>
        <span style={{ fontSize: 16, fontFamily: T.fontMono, fontWeight: 700, color: T.textPrimary }}>
          {fmt.currency(user?.balance, user?.currency)}
        </span>
      </div>

      {/* Action tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))", gap: 14, marginBottom: 28 }}>
        {tiles.map((t) => (
          <button
            key={t.id}
            onClick={() => setModal(t.id)}
            style={{
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 16, padding: "20px",
              cursor: "pointer", textAlign: "left",
              transition: "all 0.2s", fontFamily: T.fontBody,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = t.color + "55";
              e.currentTarget.style.transform   = "translateY(-2px)";
              e.currentTarget.style.boxShadow   = `0 8px 28px ${t.bg}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.transform   = "translateY(0)";
              e.currentTarget.style.boxShadow   = "none";
            }}
          >
            <div style={{
              width: 46, height: 46, borderRadius: 13,
              background: t.bg, border: `1px solid ${t.color}28`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, color: t.color, marginBottom: 14,
            }}>
              {t.icon}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary, marginBottom: 5 }}>{t.title}</div>
            <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.6, marginBottom: 14 }}>{t.desc}</div>
            <div style={{ fontSize: 12, color: t.color, fontWeight: 600 }}>Open →</div>
          </button>
        ))}
      </div>

      {/* FX rate board */}
      <Card>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, marginBottom: 2 }}>Live FX Rates</div>
        <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>Mid-market rates from {user?.currency}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px,1fr))", gap: 10 }}>
          {Object.entries(FX_RATES[user?.currency] || FX_RATES["USD"])
            .filter(([c]) => c !== user?.currency)
            .map(([currency, rate]) => (
              <div key={currency} style={{
                background: T.surfaceHigh, border: `1px solid ${T.border}`,
                borderRadius: 12, padding: "13px",
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, letterSpacing: "0.08em", marginBottom: 5 }}>
                  1 {user?.currency}
                </div>
                <div style={{ fontSize: 19, fontFamily: T.fontMono, fontWeight: 700, color: T.textPrimary, marginBottom: 2 }}>
                  {rate.toFixed(4)}
                </div>
                <div style={{ fontSize: 12, color: T.accent }}>{currency}</div>
              </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default PaymentsPage;
