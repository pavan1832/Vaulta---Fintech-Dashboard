// src/components/TopBar.jsx
import T from "../styles/tokens";
import Avatar from "./Avatar";

const TopBar = ({ title, user }) => (
  <header
    style={{
      background: T.surface, borderBottom: `1px solid ${T.border}`,
      padding: "13px 22px", display: "flex", alignItems: "center",
      justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50,
    }}
  >
    <h1 style={{ fontFamily: T.fontDisplay, fontSize: 18, color: T.textPrimary }}>{title}</h1>

    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ fontSize: 11, color: T.textMuted, fontFamily: T.fontMono }}>
        {new Date().toLocaleDateString("en-US", {
          weekday: "short", month: "short", day: "numeric", year: "numeric",
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar initials={user?.avatar} size={28} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary }}>
            {user?.name?.split(" ")[0]}
          </div>
          <div style={{ fontSize: 10, color: T.textMuted }}>{user?.role}</div>
        </div>
      </div>
    </div>
  </header>
);

export default TopBar;
