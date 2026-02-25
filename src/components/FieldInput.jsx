// src/components/FieldInput.jsx
import T from "../styles/tokens";

const FieldInput = ({
  label, value, onChange,
  type = "text",
  placeholder,
  helper,
  error,
  style = {},
}) => (
  <div>
    {label && (
      <label
        style={{
          display: "block", fontSize: 11, fontWeight: 600,
          color: T.textSecondary, marginBottom: 5,
          letterSpacing: "0.07em", textTransform: "uppercase",
        }}
      >
        {label}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: "100%", padding: "11px 14px",
        background: T.surfaceHigh,
        border: `1px solid ${error ? T.red : T.border}`,
        borderRadius: 10, color: T.textPrimary, fontSize: 14,
        outline: "none", transition: "border-color 0.18s",
        ...style,
      }}
      onFocus={(e) => (e.target.style.borderColor = error ? T.red : T.accent)}
      onBlur={(e)  => (e.target.style.borderColor = error ? T.red : T.border)}
    />
    {error  && <div style={{ fontSize: 11, color: T.red,      marginTop: 4 }}>⚠ {error}</div>}
    {helper && !error && <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>{helper}</div>}
  </div>
);

export default FieldInput;
