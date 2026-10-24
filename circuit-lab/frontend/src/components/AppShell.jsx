import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function AppShell({ children }) {
  const { user, logout } = useAuth();

  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <span style={{ color: "var(--accent)" }}>●</span> CIRCUITLAB
        </div>

        <nav style={styles.nav}>
          <NavLink to="/dashboard" style={navStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/components" style={navStyle}>
            Components
          </NavLink>
          <NavLink to="/builder" style={navStyle}>
            Builder
          </NavLink>
          <NavLink to="/tutorials" style={navStyle}>
            Tutorials
          </NavLink>
          <NavLink to="/share" style={navStyle}>
            Share
          </NavLink>
          {user?.username && (
            <NavLink to={`/u/${user.username}`} style={navStyle}>
              Profile
            </NavLink>
          )}
          {user?.is_admin && (
            <NavLink
              to="/admin"
              style={({ isActive }) => ({
                ...navStyle({ isActive }),
                color: isActive ? "var(--primary)" : "var(--primary)",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 4,
              })}
            >
              <span style={{ fontSize: 9, background: "rgba(47, 214, 111, 0.2)", padding: "1px 5px", borderRadius: 4, border: "1px solid rgba(47, 214, 111, 0.4)" }}>ADMIN</span>
            </NavLink>
          )}
        </nav>

        <div style={styles.userArea}>
          <NavLink to="/people" style={styles.iconBtn} title="Find people">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </NavLink>
          <NotificationBell />
          <span style={{ color: "var(--text-dim)", fontSize: 13.5 }}>{user?.name}</span>
          <button onClick={logout} style={styles.logoutBtn}>
            Sign out
          </button>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}

function navStyle({ isActive }) {
  return {
    fontSize: 13.5,
    fontFamily: "var(--font-display)",
    letterSpacing: "0.03em",
    color: isActive ? "var(--primary)" : "var(--text-dim)",
    textDecoration: "none",
    padding: "6px 0",
    borderBottom: isActive ? "2px solid var(--primary)" : "2px solid transparent",
  };
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 6vw",
    background: "rgba(10,14,19,0.85)",
    backdropFilter: "blur(8px)",
    borderBottom: "1px solid var(--border)",
  },
  brand: {
    fontFamily: "var(--font-display)",
    fontSize: 13,
    letterSpacing: "0.08em",
    color: "var(--text)",
  },
  nav: {
    display: "flex",
    gap: 28,
  },
  userArea: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  iconBtn: {
    display: "grid",
    placeItems: "center",
    width: 34,
    height: 34,
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border-bright)",
    color: "var(--text-dim)",
    textDecoration: "none",
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid var(--border-bright)",
    color: "var(--text-dim)",
    borderRadius: "var(--radius-sm)",
    padding: "6px 12px",
    fontSize: 12.5,
    cursor: "pointer",
  },
};