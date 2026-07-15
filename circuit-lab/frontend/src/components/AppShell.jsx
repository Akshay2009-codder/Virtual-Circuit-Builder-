import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AppShell({ children }) {
  const { user, logout } = useAuth();

  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <span style={{ color: "var(--teal)" }}>●</span> CIRCUITLAB
        </div>

        <nav style={styles.nav}>
          <NavLink to="/dashboard" style={navStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/components" style={navStyle}>
            Components
          </NavLink>
          <span style={{ ...navStyle({ isActive: false }), color: "var(--text-faint)", cursor: "default" }}>
            Builder — soon
          </span>
        </nav>

        <div style={styles.userArea}>
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
    color: isActive ? "var(--copper)" : "var(--text-dim)",
    textDecoration: "none",
    padding: "6px 0",
    borderBottom: isActive ? "2px solid var(--copper)" : "2px solid transparent",
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
