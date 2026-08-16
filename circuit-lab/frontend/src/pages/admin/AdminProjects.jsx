import React, { useEffect, useState } from "react";
import client from "../../api/client";
import { timeAgo } from "../../utils/timeAgo";
import ConfirmModal from "../../components/admin/ConfirmModal";
import Circuit3DViewModal from "../../components/builder3d/Circuit3DViewModal";
import { SortableTh, TablePagination, TableLoadingOverlay, TableEmptyState } from "../../components/admin/AdminTable";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // "all" | "public" | "private" | "flagged"
  const [sortBy, setSortBy] = useState("updated_at");
  const [order, setOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals
  const [deleteModalProject, setDeleteModalProject] = useState(null);
  const [previewProject, setPreviewProject] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  function triggerToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  }

  function loadProjects() {
    setLoading(true);
    setError("");
    client
      .get("/admin/projects", {
        params: {
          q: search,
          filter: filterMode,
          sort_by: sortBy,
          order: order,
          page: page,
          per_page: perPage,
        },
      })
      .then((res) => {
        setProjects(res.data.projects || []);
        setTotal(res.data.total || 0);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to load circuit projects.");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProjects();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, filterMode, sortBy, order, page]);

  function handleSort(field) {
    if (sortBy === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setOrder("desc");
    }
  }

  async function handleTogglePublish(p) {
    const newIsPublic = !p.is_public;
    try {
      const res = await client.patch(`/admin/projects/${p.id}`, { is_public: newIsPublic });
      setProjects((prev) => prev.map((item) => (item.id === p.id ? res.data.project : item)));
      triggerToast(`Project "${p.name}" has been ${newIsPublic ? "published to gallery" : "unpublished from gallery"}.`);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update project visibility.");
    }
  }

  async function handleConfirmDelete() {
    if (!deleteModalProject) return;
    setActionLoading(true);
    try {
      await client.delete(`/admin/projects/${deleteModalProject.id}`);
      setProjects((prev) => prev.filter((item) => item.id !== deleteModalProject.id));
      setTotal((t) => Math.max(0, t - 1));
      triggerToast(`Circuit "${deleteModalProject.name}" deleted permanently.`);
      setDeleteModalProject(null);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete circuit.");
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
          <div style={styles.eyebrow}>PROJECT GOVERNANCE</div>
          <h1 style={styles.title}>Circuits Directory</h1>
          <p style={styles.subtitle}>
            Inspect user circuits in 3D, govern gallery visibility, and moderate community schematics.
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
            placeholder="Search by circuit name or description…"
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
            { key: "all", label: "All Circuits" },
            { key: "public", label: "Public Only" },
            { key: "private", label: "Private Only" },
            { key: "flagged", label: "Flagged Only" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setFilterMode(tab.key);
                setPage(1);
              }}
              style={{
                ...styles.filterTabBtn,
                background: filterMode === tab.key ? "rgba(47, 214, 111, 0.15)" : "rgba(255, 255, 255, 0.03)",
                color: filterMode === tab.key ? "#2fd66f" : "var(--text-dim)",
                borderColor: filterMode === tab.key ? "rgba(47, 214, 111, 0.4)" : "var(--border)",
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
                <SortableTh field="name" currentSort={sortBy} order={order} onSort={handleSort} label="Circuit Name" />
                <th style={styles.th}>Owner</th>
                <SortableTh field="created_at" currentSort={sortBy} order={order} onSort={handleSort} label="Created Date" />
                <SortableTh field="run_count" currentSort={sortBy} order={order} onSort={handleSort} label="Runs" />
                <th style={styles.th}>Visibility</th>
                <th style={styles.th}>Components</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7}>
                    <TableLoadingOverlay text="Loading circuits database…" />
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <TableEmptyState
                      icon="⚡"
                      title="No circuits match your criteria"
                      subtitle="Try adjusting your search keywords or filter tab."
                    />
                  </td>
                </tr>
              ) : (
                projects.map((p) => {
                  const nodeCount = p.circuit_json?.nodes?.length || 0;
                  const edgeCount = p.circuit_json?.edges?.length || 0;

                  return (
                    <tr key={p.id} style={styles.tr}>
                      {/* Project Name + Status */}
                      <td style={styles.td}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={styles.projectName}>{p.name}</span>
                            {p.is_flagged && <span style={styles.flaggedBadge}>⚠️ FLAGGED</span>}
                          </div>
                          {p.description && (
                            <div style={styles.projectDesc}>
                              {p.description.length > 70 ? `${p.description.slice(0, 70)}…` : p.description}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Owner */}
                      <td style={styles.td}>
                        <span style={{ fontWeight: 600, color: "var(--text)" }}>{p.owner_name}</span>
                        {p.owner_username && (
                          <div style={{ fontSize: 11.5, color: "var(--text-dim)" }}>@{p.owner_username}</div>
                        )}
                      </td>

                      {/* Created Date */}
                      <td style={styles.td}>
                        <span style={{ fontSize: 12, color: "var(--text-dim)" }}>
                          {new Date(p.created_at).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Run Count */}
                      <td style={styles.td}>
                        <span style={styles.runBadge}>{p.run_count || 0} solves</span>
                      </td>

                      {/* Visibility Status */}
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusPill,
                            color: p.is_public ? "#2fd66f" : "var(--text-dim)",
                            background: p.is_public ? "rgba(47, 214, 111, 0.12)" : "rgba(255, 255, 255, 0.04)",
                            borderColor: p.is_public ? "rgba(47, 214, 111, 0.3)" : "var(--border)",
                          }}
                        >
                          {p.is_public ? "● Public Gallery" : "○ Private"}
                        </span>
                      </td>

                      {/* Components & Wire Stats */}
                      <td style={styles.td}>
                        <span style={styles.partsBadge}>
                          {nodeCount} parts · {edgeCount} wires
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          {/* 3D Inspect */}
                          <button
                            onClick={() => setPreviewProject(p)}
                            style={{ ...styles.actionIconBtn, color: "#2fd66f" }}
                            title="Inspect 3D circuit in read-only preview"
                          >
                            👁️
                          </button>

                          {/* Publish / Unpublish Toggle */}
                          <button
                            onClick={() => handleTogglePublish(p)}
                            style={{
                              ...styles.actionIconBtn,
                              color: p.is_public ? "var(--gold)" : "var(--primary)",
                            }}
                            title={p.is_public ? "Unpublish from gallery" : "Publish to gallery"}
                          >
                            {p.is_public ? "🚫" : "🌐"}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteModalProject(p)}
                            style={{ ...styles.actionIconBtn, color: "var(--danger)" }}
                            title="Delete circuit permanently"
                          >
                            🗑️
                          </button>
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

      {/* Delete Confirmation Modal */}
      {deleteModalProject && (
        <ConfirmModal
          isOpen={!!deleteModalProject}
          title={`Delete Circuit "${deleteModalProject.name}"?`}
          message={`Are you sure you want to permanently delete this circuit built by ${deleteModalProject.owner_name}? All wires, components, likes, and comments will be wiped.`}
          confirmText="Delete Circuit"
          type="danger"
          loading={actionLoading}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalProject(null)}
        />
      )}

      {/* 3D Read-Only Preview Modal */}
      {previewProject && (
        <Circuit3DViewModal
          project={previewProject}
          isOpen={!!previewProject}
          onClose={() => setPreviewProject(null)}
          onOpenBuilder={(p) => {
            setPreviewProject(null);
            window.open(`/circuits/${p.id}`, "_blank");
          }}
        />
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
  projectName: {
    fontWeight: 700,
    fontSize: 14,
    color: "var(--text)",
  },
  projectDesc: {
    fontSize: 12,
    color: "var(--text-dim)",
    marginTop: 3,
  },
  flaggedBadge: {
    fontSize: 9.5,
    fontWeight: 800,
    background: "rgba(255, 71, 87, 0.15)",
    color: "#ff4757",
    border: "1px solid rgba(255, 71, 87, 0.35)",
    borderRadius: 4,
    padding: "1px 5px",
  },
  runBadge: {
    fontSize: 11.5,
    fontFamily: "var(--font-display)",
    color: "var(--text)",
  },
  statusPill: {
    fontSize: 11,
    fontWeight: 700,
    border: "1px solid",
    borderRadius: 12,
    padding: "2px 8px",
    whiteSpace: "nowrap",
  },
  partsBadge: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "3px 8px",
    fontSize: 11.5,
    color: "var(--text-dim)",
    whiteSpace: "nowrap",
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
};
