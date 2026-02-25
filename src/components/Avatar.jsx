// src/components/Avatar.jsx
import T from "../styles/tokens";

const Avatar = ({ initials, size = 36, color = T.accent }) => (
  <div
    style={{
      width: size, height: size, borderRadius: "50%",
      background: `${color}1A`, border: `1.5px solid ${color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: T.fontBody, fontWeight: 700, color,
      fontSize: size * 0.35, flexShrink: 0,
    }}
  >
    {initials}
  </div>
);

export default Avatar;
