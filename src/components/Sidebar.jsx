// src/components/Sidebar.jsx
import T from "../styles/tokens";
import Avatar from "./Avatar";
import Btn from "./Btn";

const Sidebar = ({ activePage, onNavigate, isAdmin, user, onLogout }) => {
  const userNav = [
    { id: "dashboard",    icon: "⬡", label: "Dashboard"  },
    { id: "payments",     icon: "⇄", label: "Payments"   },
    { id: "transactions", icon: "≡", label: "History"    },
    { id: "analytics",   icon: "▲", label: "Analytics"  },
  ];

  const adminNav = [
    { id: "admin", icon: "🛡", label: "Overview" },
    { id: "users", icon: "👥", label: "Users"    },
  ];

  const nav = isAdmin ? adminNav : userNav;

  return (
    <aside
      style={{
        width: 214, minHeight: "100vh",
        background: T.surface, borderRight: `1px solid ${T.border}`,
        display: "flex", flexDirection: "column", flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "20px 18px 18px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{
            width: 28, height: 28,
            background: `linear-gradient(135deg, ${T.accent}, ${T.accentDim})`,
            borderRadius: 7, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 14,
          }}>⬡</div>
          <span style={{ fontFamily: T.fontDisplay, fontSize: 18, color: T.textPrimary }}>
            Borderless
          </span>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        {nav.map((item) => {
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 11px", borderRadius: 10, border: "none",
                cursor: "pointer", marginBottom: 2, textAlign: "left",
                fontFamily: T.fontBody, fontSize: 14,
                fontWeight: active ? 600 : 400,
                background: active ? `${T.accent}12` : "transparent",
                color: active ? T.accent : T.textSecondary,
                borderLeft: `2.5px solid ${active ? T.accent : "transparent"}`,
                transition: "all 0.14s",
              }}
            >
              <span style={{ width: 20, textAlign: "center", fontSize: 15 }}>{item.icon}</span>
              {item.label}
              {item.id === "payments" && !isAdmin && (
                <span style={{
                  marginLeft: "auto", background: T.accent, color: T.bg,
                  fontSize: 9, fontWeight: 800, padding: "2px 5px", borderRadius: 8,
                }}>
                  NEW
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding: "14px", borderTop: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
          <Avatar initials={user?.avatar} size={32} />
          <div style={{ overflow: "hidden" }}>
            <div style={{
              fontSize: 13, fontWeight: 600, color: T.textPrimary,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {user?.name?.split(" ")[0]}
            </div>
            <div style={{ fontSize: 10, color: T.textMuted }}>
              {user?.role === "admin" ? "Administrator" : user?.country}
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            width: "100%", padding: "7px", background: "transparent",
            border: `1px solid ${T.border}`, borderRadius: 8,
            color: T.textMuted, fontSize: 12, cursor: "pointer",
            fontFamily: T.fontBody,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          ⎋ Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
