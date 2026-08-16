import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { timeAgo } from "../../utils/timeAgo";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { SortableTh, TablePagination, TableLoadingOverlay, TableEmptyState } from "../../components/admin/AdminTable";

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals
  const [deleteModalUser, setDeleteModalUser] = useState(null);
  const [resetModalUser, setResetModalUser] = useState(null);
  const [newPassword, setNewPassword] = useState("CircuitLab@2026");
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  function triggerToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  }

  function loadUsers() {
    setLoading(true);
    setError("");
    client
      .get("/admin/users", {
        params: {
          q: search,
          status: statusFilter !== "all" ? statusFilter : undefined,
          sort_by: sortBy,
          order: order,
          page: page,
          per_page: perPage,
        },
      })
      .then((res) => {
        setUsers(res.data.users || []);
        setTotal(res.data.total || 0);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to load user directory.");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter, sortBy, order, page]);

  function handleSort(field) {
    if (sortBy === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setOrder("desc");
    }
  }

  async function handleToggleSuspend(u) {
    const newStatus = u.status === "active" ? "suspended" : "active";
    try {
      const res = await client.patch(`/admin/users/${u.id}`, { status: newStatus });
      setUsers((prev) => prev.map((item) => (item.id === u.id ? res.data.user : item)));
      triggerToast(`User @${u.username} has been ${newStatus === "active" ? "reactivated" : "suspended"}.`);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update user status.");
    }
  }

  async function handleToggleAdmin(u) {
    if (u.id === me?.id) {
      alert("You cannot remove your own admin access.");
      return;
    }
    const newIsAdmin = !u.is_admin;
    try {
      const res = await client.patch(`/admin/users/${u.id}`, { is_admin: newIsAdmin });
      setUsers((prev) => prev.map((item) => (item.id === u.id ? res.data.user : item)));
      triggerToast(`Admin role ${newIsAdmin ? "granted to" : "revoked from"} @${u.username}.`);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update admin role.");
    }
  }

  async function handleConfirmDelete() {
    if (!deleteModalUser) return;
    setActionLoading(true);
    try {
      await client.delete(`/admin/users/${deleteModalUser.id}`);
      setUsers((prev) => prev.filter((item) => item.id !== deleteModalUser.id));
      setTotal((t) => Math.max(0, t - 1));
      triggerToast(`Deleted user @${deleteModalUser.username} and associated circuits.`);
      setDeleteModalUser(null);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete user account.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleConfirmResetPassword(e) {
    e.preventDefault();
    if (!resetModalUser) return;
    setActionLoading(true);
    try {
      await client.post(`/admin/users/${resetModalUser.id}/reset-password`, {
        password: newPassword,
      });
      triggerToast(`Password reset successfully for @${resetModalUser.username}.`);
      setResetModalUser(null);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to reset password.");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      {/* Toast Notification */}
      {toastMsg && <div style={styles.toast}>{toastMsg}</div>}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>USER ADMINISTRATION</div>
          <h1 style={styles.title}>Users Directory</h1>
          <p style={styles.subtitle}>
            Manage user accounts, roles, access permissions, and authentication security.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={styles.filterBar}>
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by username, name, or email…"
            style={styles.searchInput}
          />
          {search && (
            <button onClick={() => setSearch("")} style={styles.clearSearchBtn}>
              ✕
            </button>
          )}
        </div>

        <div style={styles.filterTabs}>
          {[
            { key: "all", label: "All Users" },
            { key: "active", label: "Active" },
            { key: "suspended", label: "Suspended" },
            { key: "admin", label: "Admins" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setStatusFilter(tab.key);
                setPage(1);
              }}
              style={{
                ...styles.filterTabBtn,
                background: statusFilter === tab.key ? "rgba(47, 214, 111, 0.15)" : "rgba(255, 255, 255, 0.03)",
                color: statusFilter === tab.key ? "#2fd66f" : "var(--text-dim)",
                borderColor: statusFilter === tab.key ? "rgba(47, 214, 111, 0.4)" : "var(--border)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div style={styles.tableCard}>
        {error && <div style={styles.errorText}>⚠️ {error}</div>}

        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <SortableTh field="username" currentSort={sortBy} order={order} onSort={handleSort} label="User" />
                <SortableTh field="email" currentSort={sortBy} order={order} onSort={handleSort} label="Email" />
                <SortableTh field="created_at" currentSort={sortBy} order={order} onSort={handleSort} label="Joined Date" />
                <th style={styles.th}>Circuits</th>
                <th style={styles.th}>Last Active</th>
                <th style={styles.th}>Status / Role</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7}>
                    <TableLoadingOverlay text="Loading users from database…" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <TableEmptyState
                      icon="👥"
                      title="No users match your criteria"
                      subtitle="Try refining your query or resetting filters."
                    />
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isActive = u.status === "active" || u.is_verified;
                  const isMe = u.id === me?.id;

                  return (
                    <tr key={u.id} style={styles.tr}>
                      {/* User Avatar + Name */}
                      <td style={styles.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={styles.avatarCircle}>{u.name?.[0]?.toUpperCase() || "U"}</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--text)" }}>
                              {u.name}
                              {isMe && <span style={styles.youBadge}>YOU</span>}
                            </div>
                            <div style={{ fontSize: 12, color: "var(--primary)" }}>@{u.username}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={styles.td}>
                        <span style={styles.emailText}>{u.email}</span>
                      </td>

                      {/* Joined Date */}
                      <td style={styles.td}>
                        <span style={styles.dateText}>{new Date(u.created_at).toLocaleDateString()}</span>
                      </td>

                      {/* Project Count */}
                      <td style={styles.td}>
                        <span style={styles.countBadge}>{u.project_count || 0} projects</span>
                      </td>

                      {/* Last Active */}
                      <td style={styles.td}>
                        <span style={{ fontSize: 12, color: "var(--text-dim)" }}>
                          {u.last_active ? timeAgo(u.last_active) : timeAgo(u.created_at)}
                        </span>
                      </td>

                      {/* Status / Role */}
                      <td style={styles.td}>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <span
                            style={{
                              ...styles.statusPill,
                              color: isActive ? "#2fd66f" : "#ff4757",
                              background: isActive ? "rgba(47, 214, 111, 0.12)" : "rgba(255, 71, 87, 0.12)",
                              borderColor: isActive ? "rgba(47, 214, 111, 0.3)" : "rgba(255, 71, 87, 0.3)",
                            }}
                          >
                            ● {isActive ? "Active" : "Suspended"}
                          </span>

                          {u.is_admin && <span style={styles.adminRoleBadge}>ADMIN</span>}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          {/* View Profile */}
                          <Link
                            to={`/u/${u.username}`}
                            target="_blank"
                            style={styles.actionIconBtn}
                            title="View public profile"
                          >
                            👤
                          </Link>

                          {/* Reset Password */}
                          <button
                            onClick={() => {
                              setResetModalUser(u);
                              setNewPassword("CircuitLab@2026");
                            }}
                            style={styles.actionIconBtn}
                            title="Reset password"
                          >
                            🔑
                          </button>

                          {/* Suspend / Reactivate */}
                          {!isMe && (
                            <button
                              onClick={() => handleToggleSuspend(u)}
                              style={{
                                ...styles.actionIconBtn,
                                color: isActive ? "var(--gold)" : "var(--primary)",
                              }}
                              title={isActive ? "Suspend user" : "Reactivate user"}
                            >
                              {isActive ? "⏸️" : "▶️"}
                            </button>
                          )}

                          {/* Toggle Admin */}
                          {!isMe && (
                            <button
                              onClick={() => handleToggleAdmin(u)}
                              style={{
                                ...styles.actionIconBtn,
                                color: u.is_admin ? "var(--danger)" : "var(--primary)",
                              }}
                              title={u.is_admin ? "Revoke admin role" : "Grant admin role"}
                            >
                              🛡️
                            </button>
                          )}

                          {/* Delete */}
                          {!isMe && (
                            <button
                              onClick={() => setDeleteModalUser(u)}
                              style={{ ...styles.actionIconBtn, color: "var(--danger)" }}
                              title="Delete account permanently"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <TablePagination
          total={total}
          page={page}
          perPage={perPage}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>

      {/* Delete User Confirmation Modal */}
      {deleteModalUser && (
        <ConfirmModal
          isOpen={!!deleteModalUser}
          title={`Delete User @${deleteModalUser.username}?`}
          message={`This will permanently delete ${deleteModalUser.name}'s account and ALL their circuits, likes, and comments. This action cannot be recovered.`}
          confirmText="Yes, Delete Account"
          type="danger"
          loading={actionLoading}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalUser(null)}
        />
      )}

      {/* Reset Password Modal */}
      {resetModalUser && (
        <div style={styles.modalBackdrop} onClick={() => setResetModalUser(null)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, color: "var(--text)" }}>
              Reset Password for @{resetModalUser.username}
            </h3>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "var(--text-dim)" }}>
              Enter a temporary or new password for this user:
            </p>

            <form onSubmit={handleConfirmResetPassword}>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={styles.modalInput}
                placeholder="New password…"
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" disabled={actionLoading} style={styles.saveBtn}>
                  {actionLoading ? "Updating…" : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  filterBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  searchBox: {
    position: "relative",
    flex: 1,
    minWidth: 280,
    maxWidth: 450,
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 14,
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "9px 34px 9px 36px",
    background: "rgba(16, 22, 29, 0.8)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    fontSize: 13,
    outline: "none",
  },
  clearSearchBtn: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "var(--text-dim)",
    cursor: "pointer",
    fontSize: 12,
  },
  filterTabs: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
  },
  filterTabBtn: {
    padding: "7px 14px",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  tableCard: {
    background: "rgba(16, 22, 29, 0.75)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    overflow: "hidden",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    padding: "12px 16px",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontFamily: "var(--font-display)",
    color: "var(--text-dim)",
    borderBottom: "1px solid var(--border)",
    background: "rgba(16, 22, 29, 0.6)",
  },
  tr: {
    borderBottom: "1px solid rgba(35, 46, 58, 0.5)",
    transition: "background 0.12s ease",
  },
  td: {
    padding: "12px 16px",
    fontSize: 13,
    color: "var(--text)",
    verticalAlign: "middle",
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "rgba(47, 214, 111, 0.15)",
    color: "#2fd66f",
    border: "1px solid rgba(47, 214, 111, 0.3)",
    fontWeight: 700,
    display: "grid",
    placeItems: "center",
    fontSize: 13,
    flexShrink: 0,
  },
  youBadge: {
    fontSize: 9,
    fontWeight: 800,
    background: "rgba(47, 214, 111, 0.2)",
    color: "#2fd66f",
    borderRadius: 4,
    padding: "1px 4px",
    marginLeft: 6,
  },
  emailText: {
    color: "var(--text-dim)",
    fontFamily: "var(--font-display)",
    fontSize: 12,
  },
  dateText: {
    color: "var(--text-dim)",
    fontSize: 12,
  },
  countBadge: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "3px 8px",
    fontSize: 11.5,
    color: "var(--text)",
  },
  statusPill: {
    fontSize: 11,
    fontWeight: 700,
    border: "1px solid",
    borderRadius: 12,
    padding: "2px 8px",
  },
  adminRoleBadge: {
    fontSize: 9.5,
    fontWeight: 800,
    background: "rgba(255, 71, 87, 0.14)",
    color: "#ff4757",
    border: "1px solid rgba(255, 71, 87, 0.3)",
    borderRadius: 4,
    padding: "1px 5px",
    letterSpacing: "0.04em",
  },
  actionIconBtn: {
    width: 30,
    height: 30,
    borderRadius: "var(--radius-sm)",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid var(--border)",
    display: "grid",
    placeItems: "center",
    fontSize: 13,
    color: "var(--text)",
    cursor: "pointer",
    textDecoration: "none",
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
  errorText: {
    padding: "12px 16px",
    color: "var(--danger)",
    background: "rgba(255, 71, 87, 0.1)",
    fontSize: 13,
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 2000,
    background: "rgba(6, 10, 15, 0.8)",
    backdropFilter: "blur(10px)",
    display: "grid",
    placeItems: "center",
    padding: 20,
  },
  modalBox: {
    width: "100%",
    maxWidth: 420,
    background: "rgba(16, 22, 29, 0.96)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.75)",
    padding: 24,
  },
  modalInput: {
    width: "100%",
    padding: "10px 12px",
    background: "#0c1219",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    fontSize: 14,
    fontFamily: "var(--font-display)",
    outline: "none",
  },
  cancelBtn: {
    padding: "8px 14px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-dim)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  saveBtn: {
    padding: "8px 16px",
    background: "var(--primary)",
    color: "#0a0e13",
    border: "none",
    borderRadius: "var(--radius-sm)",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
};
