// src/components/StatCard.jsx
import T from "../styles/tokens";
import Card from "./Card";
import Skeleton from "./Skeleton";

const StatCard = ({ label, value, sub, icon, color = T.accent, trend, loading = false }) => (
  <Card>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div
          style={{
            fontSize: 11, color: T.textSecondary, textTransform: "uppercase",
            letterSpacing: "0.09em", fontWeight: 600, marginBottom: 10,
          }}
        >
          {label}
        </div>

        {loading
          ? <Skeleton h={26} w="60%" style={{ marginBottom: 6 }} />
          : (
            <div
              style={{
                fontSize: 24, fontFamily: T.fontDisplay, color: T.textPrimary,
                letterSpacing: "-0.02em", marginBottom: 2,
              }}
            >
              {value}
            </div>
          )
        }

        {sub && <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{sub}</div>}

        {trend !== undefined && !loading && (
          <div style={{ fontSize: 12, color: trend >= 0 ? T.green : T.red, marginTop: 4, fontWeight: 600 }}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}% vs last month
          </div>
        )}
      </div>

      <div
        style={{
          width: 42, height: 42, borderRadius: 12,
          background: `${color}15`, border: `1px solid ${color}28`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, flexShrink: 0,
        }}
      >
        {icon}
      </div>
    </div>
  </Card>
);

export default StatCard;
