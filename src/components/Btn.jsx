// src/components/Btn.jsx
import T from "../styles/tokens";
import Spinner from "./Spinner";

const Btn = ({
  children, onClick,
  variant = "primary",
  size    = "md",
  disabled = false,
  loading  = false,
  icon,
  style = {},
}) => {
  const isOff = disabled || loading;

  const sizeStyles = {
    sm: { padding: "7px 14px",  fontSize: 12 },
    md: { padding: "10px 20px", fontSize: 14 },
    lg: { padding: "13px 26px", fontSize: 15 },
  };

  const variantStyles = {
    primary: {
      background: `linear-gradient(135deg, ${T.accent}, ${T.accentDim})`,
      color: T.bg,
      boxShadow: `0 4px 18px ${T.accentGlow}`,
    },
    green: {
      background: `linear-gradient(135deg, ${T.green}, #0BC47A)`,
      color: T.bg,
    },
    gold: {
      background: `linear-gradient(135deg, ${T.gold}, #D4A90A)`,
      color: T.bg,
    },
    danger: {
      background: T.redDim,
      color: T.red,
      border: `1px solid rgba(255,77,106,0.25)`,
    },
    ghost: {
      background: "transparent",
      color: T.textSecondary,
      border: `1px solid ${T.border}`,
    },
    neutral: {
      background: T.surfaceHigh,
      color: T.textPrimary,
      border: `1px solid ${T.border}`,
    },
  };

  return (
    <button
      onClick={isOff ? undefined : onClick}
      disabled={isOff}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        fontFamily: T.fontBody,
        fontWeight: 600,
        cursor: isOff ? "not-allowed" : "pointer",
        border: "none",
        borderRadius: 10,
        transition: "all 0.18s ease",
        opacity: isOff ? 0.55 : 1,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
        ...sizeStyles[size] || sizeStyles.md,
        ...variantStyles[variant] || variantStyles.primary,
        ...style,
      }}
    >
      {loading ? <Spinner size={14} /> : icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Btn;
