// src/components/Card.jsx
import T from "../styles/tokens";

const Card = ({ children, style = {}, glow = false }) => (
  <div
    style={{
      background: T.surface,
      borderRadius: 16,
      padding: 22,
      border: `1px solid ${glow ? T.accentDim + "66" : T.border}`,
      boxShadow: glow
        ? `0 0 40px ${T.accentGlow}`
        : "0 2px 18px rgba(0,0,0,0.25)",
      ...style,
    }}
  >
    {children}
  </div>
);

export default Card;
