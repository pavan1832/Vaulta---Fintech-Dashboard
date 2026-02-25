// src/App.jsx
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import T from "./styles/tokens";
import "./styles/global.css";

import LoginPage         from "./pages/LoginPage";
import SignupPage        from "./pages/SignupPage";
import DashboardPage     from "./pages/DashboardPage";
import PaymentsPage      from "./pages/PaymentsPage";
import TransactionsPage  from "./pages/TransactionsPage";
import AnalyticsPage     from "./pages/AnalyticsPage";
import AdminOverviewPage from "./pages/AdminOverviewPage";
import AdminUsersPage    from "./pages/AdminUsersPage";
import Sidebar from "./components/Sidebar";
import TopBar  from "./components/TopBar";
import Spinner from "./components/Spinner";

const PAGE_TITLES = {
  dashboard:"Dashboard", payments:"Payments", transactions:"History",
  analytics:"Analytics", admin:"Admin Overview", users:"User Management",
};

const AuthRouter = () => {
  const [authPage, setAuthPage] = useState("login");
  return authPage === "signup"
    ? <SignupPage onNavigate={setAuthPage} />
    : <LoginPage  onNavigate={setAuthPage} />;
};

const AppShell = () => {
  const { user, loading, logout, isAdmin } = useAuth();
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    if (user) setPage(isAdmin ? "admin" : "dashboard");
  }, [user, isAdmin]);

  if (loading) return (
    <div style={{ height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:T.bg, flexDirection:"column", gap:16 }}>
      <div style={{ width:44, height:44, background:`linear-gradient(135deg,${T.accent},${T.accentDim})`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>⬡</div>
      <Spinner size={22} />
    </div>
  );

  if (!user) return <AuthRouter />;

  const renderPage = () => {
    if (isAdmin) return page === "users" ? <AdminUsersPage /> : <AdminOverviewPage />;
    switch (page) {
      case "payments":     return <PaymentsPage />;
      case "transactions": return <TransactionsPage />;
      case "analytics":    return <AnalyticsPage />;
      default:             return <DashboardPage onNavigate={setPage} />;
    }
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      <Sidebar activePage={page} onNavigate={setPage} isAdmin={isAdmin} user={user} onLogout={logout} />
      <main style={{ flex:1, overflowY:"auto", background:T.bg, display:"flex", flexDirection:"column" }}>
        <TopBar title={PAGE_TITLES[page] || "Dashboard"} user={user} />
        {renderPage()}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </AuthProvider>
  );
}
