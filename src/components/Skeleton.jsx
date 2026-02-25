// src/components/Skeleton.jsx
import T from "../styles/tokens";

const Skeleton = ({ w = "100%", h = 16, r = 6, style = {} }) => (
  <div
    style={{
      width: w, height: h, borderRadius: r, flexShrink: 0,
      background: `linear-gradient(90deg, ${T.surfaceHigh} 25%, ${T.border} 50%, ${T.surfaceHigh} 75%)`,
      backgroundSize: "200% 100%",
      animation: "shimmer 1.6s infinite",
      ...style,
    }}
  />
);

export default Skeleton;
