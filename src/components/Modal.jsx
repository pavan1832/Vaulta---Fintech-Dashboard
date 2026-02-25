// src/components/Modal.jsx
import T from "../styles/tokens";

const Modal = ({ title, subtitle, onClose, children, width = 480 }) => (
  <div
    className="modal-overlay"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div
      className="scale-in"
      style={{
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 20, width: "100%", maxWidth: width,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "22px 22px 0",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}
      >
        <div>
          <h3 style={{ fontFamily: T.fontDisplay, fontSize: 20, color: T.textPrimary, marginBottom: 2 }}>
            {title}
          </h3>
          {subtitle && <p style={{ fontSize: 13, color: T.textSecondary }}>{subtitle}</p>}
        </div>
        <button
          onClick={onClose}
          style={{
            background: T.surfaceHigh, border: `1px solid ${T.border}`,
            borderRadius: 8, color: T.textSecondary, width: 30, height: 30,
            cursor: "pointer", fontSize: 15,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: 22 }}>{children}</div>
    </div>
  </div>
);

export default Modal;
