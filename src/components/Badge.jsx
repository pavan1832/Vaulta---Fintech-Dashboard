// src/components/Badge.jsx
import T from "../styles/tokens";

const BADGE_MAP = {
  credit:    { bg: T.greenDim, c: T.green,  l: "Credit"  },
  debit:     { bg: T.redDim,   c: T.red,    l: "Debit"   },
  completed: { bg: "rgba(0,198,255,0.1)", c: T.accent, l: "Done" },
  pending:   { bg: T.goldDim,  c: T.gold,   l: "Pending" },
  failed:    { bg: T.redDim,   c: T.red,    l: "Failed"  },
};

const Badge = ({ type }) => {
  const s = BADGE_MAP[type] || BADGE_MAP.completed;
  return (
    <span
      style={{
        padding: "3px 9px", borderRadius: 20, fontSize: 10,
        fontWeight: 700, fontFamily: T.fontMono,
        background: s.bg, color: s.c, letterSpacing: "0.04em",
      }}
    >
      {s.l}
    </span>
  );
};

export default Badge;
