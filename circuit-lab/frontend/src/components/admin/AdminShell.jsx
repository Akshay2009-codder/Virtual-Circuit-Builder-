import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { path: "/admin", exact: true, label: "Dashboard", icon: "📊", key: "dashboard" },
  { path: "/admin/users", label: "Users", icon: "👥", key: "users" },
  { path: "/admin/projects", label: "Projects", icon: "⚡", key: "projects" },
  { path: "/admin/components", label: "Component Catalog", icon: "🧩", key: "components" },
  { path: "/admin/reports", label: "Reports / Flags", icon: "🚩", key: "reports" },
  { path: "/admin/settings", label: "Settings", icon: "⚙️", key: "settings" },
];

export default function AdminShell({ children, activeTab, onSelectTab, statsData }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  function isItemActive(item) {
    if (activeTab) {
      return activeTab === item.key;
    }
    if (item.exact) {
      return location.pathname === item.path || location.pathname === `${item.path}/dashboard`;
    }
    return location.pathname.startsWith(item.path);
  }

  function handleNavClick(item) {
    setMobileDrawerOpen(false);
    if (onSelectTab) {
      onSelectTab(item.key);
    } else {
      navigate(item.path);
    }
  }

  return (
    <div style={styles.shell}>
      {/* Top Mobile Bar */}
      <div style={styles.mobileHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setMobileDrawerOpen(true)}
            style={styles.hamburgerBtn}
            aria-label="Open navigation menu"
          >
            ☰
          </button>
          <div style={styles.brandTitle}>
            <span style={styles.brandDot} />
            CIRCUITLAB <span style={styles.adminPill}>ADMIN</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={styles.adminUserPill}>Akshay_07</span>
          <button onClick={handleLogout} style={styles.logoutBtnSmall} title="Sign Out">
            Sign out
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div style={styles.body}>
        {/* Desktop Glassy Left Sidebar */}
        <aside style={styles.sidebar}>
          {/* Brand Header */}
          <div style={styles.sidebarBrand}>
            <Link to="/admin" style={styles.brandLink}>
              <span style={styles.brandDot} />
              <span style={{ fontWeight: 800, letterSpacing: "0.04em", fontSize: 16 }}>CIRCUITLAB</span>
              <span style={styles.adminPill}>SUPERADMIN</span>
            </Link>
          </div>

          {/* Super Admin User Card */}
          <div style={styles.superAdminCard}>
            <div style={styles.avatarCircle}>A</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.username || "Akshay_07"}
              </div>
              <div style={{ fontSize: 11, color: "#2fd66f", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2fd66f" }} />
                Super Admin Access
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav style={styles.nav}>
            <div style={styles.navGroupLabel}>NAVIGATION</div>
            {NAV_ITEMS.map((item) => {
              const active = isItemActive(item);
              return (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item)}
                  style={{
                    ...styles.navItem,
                    background: active ? "rgba(47, 214, 111, 0.12)" : "transparent",
                    color: active ? "#2fd66f" : "var(--text-dim)",
                    borderColor: active ? "rgba(47, 214, 111, 0.4)" : "transparent",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span style={{ flex: 1, textAlign: "left", fontWeight: active ? 700 : 500 }}>{item.label}</span>
                  {active && <span style={styles.activeIndicator} />}
                </button>
              );
            })}
          </nav>

          {/* Footer Quick Links */}
          <div style={styles.sidebarFooter}>
            <Link to="/dashboard" style={styles.footerLink}>
              <span>➔</span>
              <span>Back to CircuitLab App</span>
            </Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              <span>🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Slide-in Drawer */}
        <AnimatePresence>
          {mobileDrawerOpen && (
            <div style={styles.mobileBackdrop} onClick={() => setMobileDrawerOpen(false)}>
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.22 }}
                style={styles.mobileDrawer}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={styles.sidebarBrand}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={styles.brandDot} />
                      <span style={{ fontWeight: 800, fontSize: 16 }}>CIRCUITLAB</span>
                      <span style={styles.adminPill}>ADMIN</span>
                    </div>
                    <button onClick={() => setMobileDrawerOpen(false)} style={styles.closeDrawerBtn}>
                      ×
                    </button>
                  </div>
                </div>

                <nav style={{ ...styles.nav, marginTop: 16 }}>
                  {NAV_ITEMS.map((item) => {
                    const active = isItemActive(item);
                    return (
                      <button
                        key={item.key}
                        onClick={() => handleNavClick(item)}
                        style={{
                          ...styles.navItem,
                          background: active ? "rgba(47, 214, 111, 0.12)" : "transparent",
                          color: active ? "#2fd66f" : "var(--text-dim)",
                          borderColor: active ? "rgba(47, 214, 111, 0.4)" : "transparent",
                        }}
                      >
                        <span style={{ fontSize: 16 }}>{item.icon}</span>
                        <span style={{ flex: 1, textAlign: "left", fontWeight: active ? 700 : 500 }}>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                <div style={styles.sidebarFooter}>
                  <Link to="/dashboard" style={styles.footerLink}>
                    <span>➔</span>
                    <span>Back to CircuitLab App</span>
                  </Link>
                  <button onClick={handleLogout} style={styles.logoutBtn}>
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <main style={styles.contentArea}>
          <div style={styles.scrollWrapper}>{children}</div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  shell: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "#080c10",
    color: "var(--text)",
    fontFamily: "var(--font-body)",
  },
  mobileHeader: {
    display: "none",
    height: 56,
    padding: "0 16px",
    background: "rgba(16, 22, 29, 0.95)",
    borderBottom: "1px solid var(--border)",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(12px)",
    "@media (max-width: 900px)": {
      display: "flex",
    },
  },
  hamburgerBtn: {
    background: "none",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    padding: "5px 10px",
    fontSize: 16,
    cursor: "pointer",
  },
  body: {
    display: "flex",
    flex: 1,
    height: "100vh",
    overflow: "hidden",
  },
  sidebar: {
    width: 260,
    background: "rgba(13, 18, 25, 0.85)",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    backdropFilter: "blur(16px)",
    boxShadow: "4px 0 24px rgba(0,0,0,0.4)",
    zIndex: 20,
  },
  sidebarBrand: {
    padding: "20px 20px",
    borderBottom: "1px solid var(--border)",
  },
  brandLink: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    textDecoration: "none",
    color: "var(--text)",
  },
  brandTitle: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 800,
    fontSize: 15,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#ff4757",
    boxShadow: "0 0 8px #ff4757",
  },
  adminPill: {
    fontSize: 9.5,
    fontWeight: 800,
    fontFamily: "var(--font-display)",
    background: "rgba(47, 214, 111, 0.15)",
    color: "#2fd66f",
    border: "1px solid rgba(47, 214, 111, 0.4)",
    borderRadius: 6,
    padding: "2px 6px",
    letterSpacing: "0.08em",
  },
  adminUserPill: {
    fontSize: 11,
    fontWeight: 700,
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "3px 8px",
    color: "var(--text)",
  },
  superAdminCard: {
    margin: "16px 14px 8px",
    padding: "12px 14px",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2fd66f 0%, #1f9a51 100%)",
    color: "#0a0e13",
    fontWeight: 800,
    display: "grid",
    placeItems: "center",
    fontSize: 14,
    boxShadow: "0 2px 8px rgba(47, 214, 111, 0.3)",
  },
  nav: {
    flex: 1,
    padding: "12px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    overflowY: "auto",
  },
  navGroupLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "var(--text-faint)",
    letterSpacing: "0.08em",
    fontFamily: "var(--font-display)",
    padding: "6px 10px 4px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 14px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid transparent",
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.15s ease",
    background: "none",
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#2fd66f",
    boxShadow: "0 0 8px #2fd66f",
  },
  sidebarFooter: {
    padding: "14px 14px",
    borderTop: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    background: "rgba(10, 14, 19, 0.5)",
  },
  footerLink: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    color: "var(--text-dim)",
    textDecoration: "none",
    padding: "6px 10px",
    borderRadius: "var(--radius-sm)",
    transition: "color 0.15s ease",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    fontWeight: 600,
    color: "var(--danger)",
    background: "rgba(255, 71, 87, 0.08)",
    border: "1px solid rgba(255, 71, 87, 0.25)",
    padding: "8px 12px",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
  },
  logoutBtnSmall: {
    fontSize: 11,
    color: "var(--danger)",
    background: "rgba(255, 71, 87, 0.1)",
    border: "1px solid rgba(255, 71, 87, 0.3)",
    borderRadius: "var(--radius-sm)",
    padding: "4px 8px",
    cursor: "pointer",
  },
  mobileBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    background: "rgba(0, 0, 0, 0.75)",
    backdropFilter: "blur(6px)",
  },
  mobileDrawer: {
    width: 270,
    height: "100%",
    background: "#0d131a",
    borderRight: "1px solid var(--border-bright)",
    display: "flex",
    flexDirection: "column",
  },
  closeDrawerBtn: {
    background: "none",
    border: "none",
    color: "var(--text-dim)",
    fontSize: 22,
    cursor: "pointer",
    padding: "0 6px",
  },
  contentArea: {
    flex: 1,
    height: "100%",
    overflow: "hidden",
    background: "radial-gradient(ellipse at 20% 0%, #111822 0%, #080c10 70%)",
  },
  scrollWrapper: {
    height: "100%",
    overflowY: "auto",
    padding: "32px 36px 60px",
  },
};
