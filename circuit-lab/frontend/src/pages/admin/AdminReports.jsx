import React, { useEffect, useState } from "react";
import client from "../../api/client";
import { timeAgo } from "../../utils/timeAgo";
import ConfirmModal from "../../components/admin/ConfirmModal";
import Circuit3DViewModal from "../../components/builder3d/Circuit3DViewModal";
import { TableLoadingOverlay, TableEmptyState } from "../../components/admin/AdminTable";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [previewProject, setPreviewProject] = useState(null);
  const [confirmModalData, setConfirmModalData] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  function triggerToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  }

  function loadReports() {
    setLoading(true);
    setError("");
    client
      .get("/admin/reports", { params: { status: statusFilter } })
      .then((res) => setReports(res.data.reports || []))
      .catch((err) => setError(err.response?.data?.error || "Failed to load reports queue."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  async function handleInspectProject(report) {
    try {
      const res = await client.get(`/projects/${report.project_id}`);
      setPreviewProject(res.data.project);
    } catch (err) {
      alert("Could not load circuit details for preview.");
    }
  }

  async function executeAction(reportId, actionType, msg) {
    setActionLoading(true);
    try {
      await client.post(`/admin/reports/${reportId}/action`, { action: actionType });
      triggerToast(msg);
      setConfirmModalData(null);
      loadReports();
    } catch (err) {
      alert(err.response?.data?.error || "Action failed.");
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
          <div style={styles.eyebrow}>CONTENT MODERATION</div>
          <h1 style={styles.title}>Reports & Flags Queue</h1>
          <p style={styles.subtitle}>
            Review flagged community circuits, investigate potential rule violations, and take moderation action.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={styles.filterBar}>
        <div style={styles.filterTabs}>
          {[
            { key: "all", label: "All Reports" },
            { key: "pending", label: "Pending Review" },
            { key: "resolved", label: "Resolved" },
            { key: "dismissed", label: "Dismissed" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
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

      {/* Reports Table / Card Container */}
      <div style={styles.tableCard}>
        {error && <div style={styles.errorText}>⚠️ {error}</div>}

        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Reported Circuit</th>
                <th style={styles.th}>Report Reason & Note</th>
                <th style={styles.th}>Reporter</th>
                <th style={styles.th}>Reported</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Moderation Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>
                    <TableLoadingOverlay text="Checking moderation queue…" />
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <TableEmptyState
                      icon="🛡️"
                      title="No reports in queue"
                      subtitle="The community gallery is in good standing."
                    />
                  </td>
                </tr>
              ) : (
                reports.map((rep) => {
                  const isPending = rep.status === "pending";
                  return (
                    <tr key={rep.id} style={styles.tr}>
                      {/* Project */}
                      <td style={styles.td}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--text)" }}>
                            {rep.project_name}
                          </div>
                          <div style={{ fontSize: 11.5, color: "var(--text-dim)" }}>
                            by {rep.owner_name} (ID: #{rep.project_id})
                          </div>
                        </div>
                      </td>

                      {/* Reason */}
                      <td style={{ ...styles.td, maxWidth: 320 }}>
                        <div style={styles.reasonText}>"{rep.reason}"</div>
                      </td>

                      {/* Reporter */}
                      <td style={styles.td}>
                        <span style={{ fontSize: 12.5, color: "var(--text)" }}>@{rep.reporter_name}</span>
                      </td>

                      {/* Timestamp */}
                      <td style={styles.td}>
                        <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{timeAgo(rep.created_at)}</span>
                      </td>

                      {/* Status */}
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusPill,
                            color: isPending ? "var(--gold)" : rep.status === "resolved" ? "var(--primary)" : "var(--text-dim)",
                            background: isPending ? "rgba(255, 201, 77, 0.12)" : "rgba(255, 255, 255, 0.04)",
                            borderColor: isPending ? "rgba(255, 201, 77, 0.3)" : "var(--border)",
                          }}
                        >
                          {rep.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Moderation Actions */}
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          {/* Inspect 3D */}
                          <button
                            onClick={() => handleInspectProject(rep)}
                            style={{ ...styles.actionBtn, color: "var(--primary)" }}
                            title="Inspect 3D circuit schematic"
                          >
                            👁️ Inspect
                          </button>

                          {isPending && (
                            <>
                              {/* Dismiss */}
                              <button
                                onClick={() =>
                                  executeAction(rep.id, "dismiss", `Report #${rep.id} dismissed.`)
                                }
                                style={styles.actionBtn}
                                title="Dismiss report without taking action"
                              >
                                ✓ Dismiss
                              </button>

                              {/* Unpublish */}
                              <button
                                onClick={() =>
                                  setConfirmModalData({
                                    reportId: rep.id,
                                    action: "unpublish",
                                    title: `Unpublish "${rep.project_name}"?`,
                                    message: `This will take "${rep.project_name}" down from the public gallery and make it private to the owner.`,
                                    confirmText: "Unpublish from Gallery",
                                    type: "warning",
                                  })
                                }
                                style={{ ...styles.actionBtn, color: "var(--gold)" }}
                                title="Make circuit private"
                              >
                                🚫 Unpublish
                              </button>

                              {/* Delete Circuit */}
                              <button
                                onClick={() =>
                                  setConfirmModalData({
                                    reportId: rep.id,
                                    action: "delete_project",
                                    title: `Delete Violating Circuit?`,
                                    message: `Permanently delete "${rep.project_name}" and wipe all data.`,
                                    confirmText: "Delete Circuit",
                                    type: "danger",
                                  })
                                }
                                style={{ ...styles.actionBtn, color: "var(--danger)" }}
                                title="Delete reported circuit"
                              >
                                🗑️ Delete
                              </button>
                            </>
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
      </div>

      {/* Confirmation Modal */}
      {confirmModalData && (
        <ConfirmModal
          isOpen={!!confirmModalData}
          title={confirmModalData.title}
          message={confirmModalData.message}
          confirmText={confirmModalData.confirmText}
          type={confirmModalData.type}
          loading={actionLoading}
          onConfirm={() =>
            executeAction(
              confirmModalData.reportId,
              confirmModalData.action,
              `Action completed on report #${confirmModalData.reportId}.`
            )
          }
          onCancel={() => setConfirmModalData(null)}
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
    alignItems: "center",
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
    padding: "14px 16px",
    fontSize: 13,
    color: "var(--text)",
    verticalAlign: "middle",
  },
  reasonText: {
    fontSize: 12.5,
    color: "var(--text)",
    fontStyle: "italic",
    lineHeight: 1.4,
  },
  statusPill: {
    fontSize: 10.5,
    fontWeight: 700,
    border: "1px solid",
    borderRadius: 12,
    padding: "2px 8px",
    letterSpacing: "0.04em",
    fontFamily: "var(--font-display)",
  },
  actionBtn: {
    padding: "5px 10px",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    fontSize: 12,
    fontWeight: 600,
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
