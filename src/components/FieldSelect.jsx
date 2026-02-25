// src/components/FieldSelect.jsx
import T from "../styles/tokens";

const FieldSelect = ({ label, value, onChange, options }) => (
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
    <select
      value={value}
      onChange={onChange}
      style={{
        width: "100%", padding: "11px 14px",
        background: T.surfaceHigh, border: `1px solid ${T.border}`,
        borderRadius: 10, color: T.textPrimary, fontSize: 14,
        outline: "none", cursor: "pointer",
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ background: T.surface }}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

export default FieldSelect;
