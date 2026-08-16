import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/components", label: "Components", icon: "🧩" },
    { to: "/builder", label: "Builder", icon: "⚡" },
    { to: "/tutorials", label: "Tutorials", icon: "📚" },
    { to: "/share", label: "Share", icon: "🌐" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Glassy Navigation Header */}
      <header style={styles.header}>
        {/* Brand Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link to="/dashboard" style={styles.brand}>
            <span style={styles.brandDot} />
            <span style={{ fontWeight: 800, letterSpacing: "0.06em" }}>CIRCUITLAB</span>
            <span style={styles.brandBadge}>PRO 3D</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav style={styles.desktopNav}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  ...styles.navLink,
                  color: isActive ? "#2fd66f" : "var(--text-dim)",
                  background: isActive ? "rgba(47, 214, 111, 0.1)" : "transparent",
                  borderColor: isActive ? "rgba(47, 214, 111, 0.35)" : "transparent",
                  fontWeight: isActive ? 700 : 500,
                })}
              >
                <span>{link.label}</span>
              </NavLink>
            ))}

            {user?.username && (
              <NavLink
                to={`/u/${user.username}`}
                style={({ isActive }) => ({
                  ...styles.navLink,
                  color: isActive ? "#2fd66f" : "var(--text-dim)",
                  background: isActive ? "rgba(47, 214, 111, 0.1)" : "transparent",
                  borderColor: isActive ? "rgba(47, 214, 111, 0.35)" : "transparent",
                  fontWeight: isActive ? 700 : 500,
                })}
              >
                <span>Profile</span>
              </NavLink>
            )}

            {/* Admin link for admin users */}
            {user?.is_admin && (
              <NavLink
                to="/admin"
                style={({ isActive }) => ({
                  ...styles.navLink,
                  color: isActive ? "#ff4757" : "var(--primary)",
                  background: isActive ? "rgba(255, 71, 87, 0.14)" : "rgba(47, 214, 111, 0.12)",
                  borderColor: isActive ? "rgba(255, 71, 87, 0.4)" : "rgba(47, 214, 111, 0.35)",
                  fontWeight: 700,
                })}
              >
                <span>🛡️ ADMIN PANEL</span>
              </NavLink>
            )}
          </nav>
        </div>

        {/* Right User & Utility Area */}
        <div style={styles.rightArea}>
          {/* People Finder */}
          <NavLink to="/people" style={styles.iconBtn} title="Explore creators & community">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </NavLink>

          <NotificationBell />

          {/* User Profile Capsule */}
          {user && (
            <Link to={`/u/${user.username}`} style={styles.userCapsule}>
              <div style={styles.userAvatar}>
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div style={styles.userInfo}>
                <span style={styles.userName}>{user.name}</span>
                <span style={styles.userRole}>{user.is_admin ? "SuperAdmin" : `@${user.username}`}</span>
              </div>
            </Link>
          )}

          {/* Sign out */}
          <button onClick={handleLogout} style={styles.logoutBtn} title="Sign Out">
            Sign out
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            style={styles.mobileHamburger}
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={styles.mobileDrawer}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                style={({ isActive }) => ({
                  ...styles.mobileNavLink,
                  color: isActive ? "#2fd66f" : "var(--text)",
                  background: isActive ? "rgba(47, 214, 111, 0.12)" : "rgba(255, 255, 255, 0.03)",
                })}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            ))}

            {user?.username && (
              <NavLink
                to={`/u/${user.username}`}
                onClick={() => setMobileMenuOpen(false)}
                style={styles.mobileNavLink}
              >
                <span>👤</span>
                <span>My Profile</span>
              </NavLink>
            )}

            {user?.is_admin && (
              <NavLink
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                style={{ ...styles.mobileNavLink, color: "var(--primary)", borderColor: "var(--primary)" }}
              >
                <span>🛡️</span>
                <span>Admin Console</span>
              </NavLink>
            )}
          </div>
        </div>
      )}

      {/* Main Viewport Content */}
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 4vw",
    background: "rgba(11, 16, 22, 0.88)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    borderBottom: "1px solid var(--border)",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "var(--font-display)",
    fontSize: 15,
    color: "var(--text)",
    textDecoration: "none",
    userSelect: "none",
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#2fd66f",
    boxShadow: "0 0 10px #2fd66f",
  },
  brandBadge: {
    fontSize: 9.5,
    fontWeight: 800,
    fontFamily: "var(--font-mono)",
    background: "rgba(69, 216, 196, 0.14)",
    color: "#45d8c4",
    border: "1px solid rgba(69, 216, 196, 0.35)",
    borderRadius: 6,
    padding: "1px 6px",
    letterSpacing: "0.06em",
  },
  desktopNav: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    "@media (max-width: 900px)": {
      display: "none",
    },
  },
  navLink: {
    fontSize: 13,
    fontFamily: "var(--font-body)",
    textDecoration: "none",
    padding: "6px 14px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid transparent",
    transition: "all 0.15s ease",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  rightArea: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  iconBtn: {
    display: "grid",
    placeItems: "center",
    width: 34,
    height: 34,
    borderRadius: "var(--radius-sm)",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid var(--border)",
    color: "var(--text-dim)",
    textDecoration: "none",
    transition: "all 0.15s ease",
    cursor: "pointer",
  },
  userCapsule: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "4px 10px 4px 4px",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-pill)",
    textDecoration: "none",
    transition: "border-color 0.15s ease",
  },
  userAvatar: {
    width: 26,
    height: 26,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2fd66f 0%, #1f9a51 100%)",
    color: "#0a0e13",
    fontWeight: 800,
    fontSize: 12,
    display: "grid",
    placeItems: "center",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.1,
  },
  userName: {
    fontSize: 12,
    fontWeight: 700,
    color: "var(--text)",
  },
  userRole: {
    fontSize: 10,
    color: "var(--text-dim)",
  },
  logoutBtn: {
    background: "rgba(255, 71, 87, 0.08)",
    border: "1px solid rgba(255, 71, 87, 0.25)",
    color: "var(--danger)",
    borderRadius: "var(--radius-sm)",
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.15s ease",
  },
  mobileHamburger: {
    display: "none",
    background: "none",
    border: "1px solid var(--border)",
    color: "var(--text)",
    fontSize: 16,
    borderRadius: "var(--radius-sm)",
    padding: "4px 8px",
    cursor: "pointer",
  },
  mobileDrawer: {
    padding: "16px 20px 24px",
    background: "#0d131a",
    borderBottom: "1px solid var(--border)",
  },
  mobileNavLink: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border)",
    fontSize: 13.5,
    textDecoration: "none",
    color: "var(--text)",
  },
};