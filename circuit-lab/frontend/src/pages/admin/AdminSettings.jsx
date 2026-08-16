import React, { useEffect, useState } from "react";
import client from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function AdminSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    gallery_submissions_enabled: true,
    user_registrations_enabled: true,
    maintenance_mode: false,
    max_projects_per_user: 50,
    simulation_rate_limit_per_min: 60,
  });

  const [settingsLoading, setSettingsLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  // Change Password Form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  function triggerToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  }

  useEffect(() => {
    client
      .get("/admin/settings")
      .then((res) => setSettings(res.data.settings || {}))
      .catch(() => {})
      .finally(() => setSettingsLoading(false));
  }, []);

  async function handleToggleSetting(key) {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    setSavingSettings(true);
    try {
      await client.post("/admin/settings", updated);
      triggerToast("System settings updated live.");
    } catch (err) {
      alert("Failed to save settings.");
    } finally {
      setSavingSettings(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await client.post("/admin/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPasswordSuccess(res.data.message || "Admin password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.response?.data?.error || "Failed to update admin password.");
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      {/* Toast Notification */}
      {toastMsg && <div style={styles.toast}>{toastMsg}</div>}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>CONFIGURATION & SECURITY</div>
          <h1 style={styles.title}>System Settings</h1>
          <p style={styles.subtitle}>
            Platform-wide operational toggles and Super Admin credentials management.
          </p>
        </div>
      </div>

      {/* Grid: Toggles + Password Change */}
      <div style={styles.grid}>
        {/* Left Column: Platform Toggles */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>🎛️</span>
              <h2 style={styles.panelTitle}>Platform Feature Toggles</h2>
            </div>
            {savingSettings && <span style={styles.savingBadge}>Saving…</span>}
          </div>

          <div style={styles.panelBody}>
            {/* Gallery Submissions Toggle */}
            <div style={styles.toggleRow}>
              <div>
                <div style={styles.toggleLabel}>Public Gallery Submissions</div>
                <div style={styles.toggleDesc}>
                  Allow users to publish their circuits to the public 3D community showcase.
                </div>
              </div>
              <button
                onClick={() => handleToggleSetting("gallery_submissions_enabled")}
                style={{
                  ...styles.toggleSwitch,
                  background: settings.gallery_submissions_enabled ? "#2fd66f" : "#232e3a",
                }}
              >
                <span
                  style={{
                    ...styles.toggleKnob,
                    transform: settings.gallery_submissions_enabled ? "translateX(20px)" : "translateX(0)",
                  }}
                />
              </button>
            </div>

            {/* User Registrations Toggle */}
            <div style={styles.toggleRow}>
              <div>
                <div style={styles.toggleLabel}>New User Registrations</div>
                <div style={styles.toggleDesc}>
                  Accept new user signups. Disable temporarily during private maintenance.
                </div>
              </div>
              <button
                onClick={() => handleToggleSetting("user_registrations_enabled")}
                style={{
                  ...styles.toggleSwitch,
                  background: settings.user_registrations_enabled ? "#2fd66f" : "#232e3a",
                }}
              >
                <span
                  style={{
                    ...styles.toggleKnob,
                    transform: settings.user_registrations_enabled ? "translateX(20px)" : "translateX(0)",
                  }}
                />
              </button>
            </div>

            {/* Maintenance Mode Toggle */}
            <div style={styles.toggleRow}>
              <div>
                <div style={styles.toggleLabel}>Maintenance Mode Alert</div>
                <div style={styles.toggleDesc}>
                  Display PCB bench maintenance banner on the frontend.
                </div>
              </div>
              <button
                onClick={() => handleToggleSetting("maintenance_mode")}
                style={{
                  ...styles.toggleSwitch,
                  background: settings.maintenance_mode ? "var(--gold)" : "#232e3a",
                }}
              >
                <span
                  style={{
                    ...styles.toggleKnob,
                    transform: settings.maintenance_mode ? "translateX(20px)" : "translateX(0)",
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: SuperAdmin Credentials */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>🔒</span>
              <h2 style={styles.panelTitle}>Super Admin Security</h2>
            </div>
          </div>

          <div style={styles.panelBody}>
            {/* Identity Card */}
            <div style={styles.adminIdentityBox}>
              <div style={styles.avatarBig}>A</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "var(--text)" }}>
                  {user?.username || "Akshay_07"}
                </div>
                <div style={{ fontSize: 12, color: "#2fd66f", marginTop: 2 }}>
                  Role: Super Administrator · Root Access
                </div>
                <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>
                  Authenticated via dedicated /api/admin/login JWT
                </div>
              </div>
            </div>

            {/* Password Change Form */}
            <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <h3 style={{ margin: "6px 0 2px", fontSize: 13.5, color: "var(--text)", fontWeight: 700 }}>
                Change Super Admin Password
              </h3>

              {passwordError && <div style={styles.errorText}>⚠️ {passwordError}</div>}
              {passwordSuccess && <div style={styles.successText}>✓ {passwordSuccess}</div>}

              <div>
                <label style={styles.label}>Current Password *</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={styles.input}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={styles.label}>New Password *</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="New password"
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>Confirm Password *</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                    style={styles.input}
                  />
                </div>
              </div>

              <button type="submit" disabled={passwordLoading} style={styles.submitBtn}>
                {passwordLoading ? "Updating Password…" : "Update Admin Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 22,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.1em",
    color: "#2fd66f",
    fontFamily: "var(--font-display)",
    marginBottom: 4,
  },
  title: {
    margin: "0 0 6px",
    fontSize: 24,
    fontWeight: 800,
    color: "var(--text)",
  },
  subtitle: {
    margin: 0,
    fontSize: 13.5,
    color: "var(--text-dim)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: 20,
  },
  panel: {
    background: "rgba(16, 22, 29, 0.75)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    overflow: "hidden",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
  },
  panelHeader: {
    padding: "16px 20px",
    background: "rgba(22, 30, 40, 0.6)",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  panelTitle: {
    margin: 0,
    fontSize: 14,
    fontWeight: 700,
    color: "var(--text)",
  },
  panelBody: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  savingBadge: {
    fontSize: 11,
    color: "#2fd66f",
  },
  toggleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    paddingBottom: 14,
    borderBottom: "1px solid rgba(35, 46, 58, 0.4)",
  },
  toggleLabel: {
    fontSize: 13.5,
    fontWeight: 600,
    color: "var(--text)",
  },
  toggleDesc: {
    fontSize: 12,
    color: "var(--text-dim)",
    marginTop: 2,
    maxWidth: 340,
  },
  toggleSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    border: "none",
    padding: 2,
    cursor: "pointer",
    position: "relative",
    transition: "background 0.2s ease",
    flexShrink: 0,
  },
  toggleKnob: {
    display: "block",
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#ffffff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
    transition: "transform 0.2s ease",
  },
  adminIdentityBox: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "14px 16px",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
  },
  avatarBig: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2fd66f 0%, #1f9a51 100%)",
    color: "#0a0e13",
    fontWeight: 800,
    fontSize: 18,
    display: "grid",
    placeItems: "center",
    boxShadow: "0 2px 10px rgba(47, 214, 111, 0.4)",
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "var(--text-dim)",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "9px 12px",
    background: "#0c1219",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    fontSize: 13,
    outline: "none",
  },
  submitBtn: {
    marginTop: 4,
    padding: "10px 16px",
    background: "var(--primary)",
    color: "#0a0e13",
    border: "none",
    borderRadius: "var(--radius-sm)",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  errorText: {
    padding: "8px 12px",
    background: "rgba(255, 71, 87, 0.12)",
    border: "1px solid var(--danger)",
    borderRadius: "var(--radius-sm)",
    color: "var(--danger)",
    fontSize: 12.5,
  },
  successText: {
    padding: "8px 12px",
    background: "rgba(47, 214, 111, 0.12)",
    border: "1px solid var(--primary)",
    borderRadius: "var(--radius-sm)",
    color: "var(--primary)",
    fontSize: 12.5,
  },
  toast: {
    position: "fixed",
    top: 24,
    right: 24,
    zIndex: 3000,
    background: "rgba(16, 22, 29, 0.95)",
    border: "1px solid #2fd66f",
    color: "#2fd66f",
    padding: "10px 18px",
    borderRadius: "var(--radius-sm)",
    fontSize: 13,
    fontWeight: 600,
    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
  },
};
