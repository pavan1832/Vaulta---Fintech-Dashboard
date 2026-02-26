// src/pages/LoginPage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import T from "../styles/tokens";
import { Card, Btn, FieldInput, AlertBox } from "../components";

const AuthLayout = ({ children }) => (
  <div
    style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: 20,
      background: `
        radial-gradient(ellipse at 20% 60%, rgba(0,198,255,0.07) 0%, transparent 55%),
        radial-gradient(ellipse at 80% 20%, rgba(245,200,66,0.04) 0%, transparent 50%),
        ${T.bg}
      `,
    }}
  >
    <div
      style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
      }}
    />
    <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}
      className="fade-up">
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 34 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 36, height: 36,
            background: `linear-gradient(135deg, ${T.accent}, ${T.accentDim})`,
            borderRadius: 10, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 18,
          }}>⬡</div>
          <span style={{ fontFamily: T.fontDisplay, fontSize: 26, color: T.textPrimary, letterSpacing: "-0.02em" }}>
            Vaulta
          </span>
        </div>
        <div style={{ fontSize: 12, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Banking for the global workforce
        </div>
      </div>
      {children}
    </div>
  </div>
);

const LoginPage = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email,    setEmail]    = useState("arjun@aspora.io");
  const [password, setPassword] = useState("demo1234");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try   { await login(email, password); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <AuthLayout>
      <Card>
        <h2 style={{ fontFamily: T.fontDisplay, fontSize: 22, color: T.textPrimary, marginBottom: 2 }}>
          Welcome back
        </h2>
        <p style={{ fontSize: 14, color: T.textSecondary, marginBottom: 22 }}>
          Sign in to your Vaulta account
        </p>

        {error && <AlertBox type="error">{error}</AlertBox>}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <FieldInput label="Email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <FieldInput label="Password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          <Btn onClick={handleLogin} loading={loading} size="lg" style={{ width: "100%", marginTop: 4 }}>
            Sign In
          </Btn>
        </div>

        {/* Demo shortcuts */}
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Demo credentials
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { l: "👤 User",     e: "arjun@aspora.io",  p: "demo1234"  },
              { l: "🛡️ Admin",   e: "admin@aspora.io",  p: "admin1234" },
            ].map((d) => (
              <button key={d.e} onClick={() => { setEmail(d.e); setPassword(d.p); }}
                style={{
                  flex: 1, padding: "8px",
                  background: T.surfaceHigh, border: `1px solid ${T.border}`,
                  borderRadius: 8, color: T.textSecondary, fontSize: 12, cursor: "pointer",
                }}>
                {d.l}
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: T.textSecondary }}>
          No account?{" "}
          <span style={{ color: T.accent, cursor: "pointer", fontWeight: 600 }}
            onClick={() => onNavigate("signup")}>
            Create one →
          </span>
        </p>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;
