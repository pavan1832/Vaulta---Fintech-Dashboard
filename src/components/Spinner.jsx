// src/components/Spinner.jsx
import T from "../styles/tokens";

const Spinner = ({ size = 20 }) => (
  <div
    style={{
      width: size, height: size,
      border: `2px solid ${T.border}`,
      borderTopColor: T.accent,
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
      display: "inline-block",
      flexShrink: 0,
    }}
  />
);

export default Spinner;
