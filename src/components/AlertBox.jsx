// src/components/AlertBox.jsx
import T from "../styles/tokens";

const AlertBox = ({ type, children, onClose }) => (
  <div
    style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "11px 14px", borderRadius: 10,
      background: type === "success" ? T.greenDim : T.redDim,
      border: `1px solid ${type === "success" ? T.green + "44" : T.red + "44"}`,
      color: type === "success" ? T.green : T.red,
      fontSize: 13, marginBottom: 14,
    }}
  >
    <span style={{ flexShrink: 0 }}>{type === "success" ? "✓" : "⚠"}</span>
    <span style={{ flex: 1 }}>{children}</span>
    {onClose && (
      <span style={{ cursor: "pointer", opacity: 0.7 }} onClick={onClose}>✕</span>
    )}
  </div>
);

export default AlertBox;
