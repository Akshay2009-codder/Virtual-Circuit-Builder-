import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import client from "../../api/client";
import { timeAgo } from "../../utils/timeAgo";
import Circuit3DViewModal from "../../components/builder3d/Circuit3DViewModal";

export default function AdminDashboard({ onNavigateTab }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewProject, setPreviewProject] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    client
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load dashboard metrics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p style={{ color: "var(--text-dim)", fontFamily: "var(--font-display)", fontSize: 13 }}>
          Loading admin metrics…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorBanner}>
        <span>⚠️ {error}</span>
        <button onClick={() => window.location.reload()} style={styles.retryBtn}>
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Registered Users",
      value: stats?.user_count ?? 0,
      change: `+${stats?.new_users_7d ?? 0} new this week`,
      icon: "👥",
      color: "var(--primary)",
      tabKey: "users",
    },
    {
      title: "Total Circuit Projects",
      value: stats?.project_count ?? 0,
      change: `+${stats?.new_projects_7d ?? 0} created this week`,
      icon: "⚡",
      color: "#45d8c4",
      tabKey: "projects",
    },
    {
      title: "Public Gallery Circuits",
      value: stats?.public_project_count ?? 0,
      change: `${Math.round(((stats?.public_project_count || 0) / Math.max(1, stats?.project_count || 1)) * 100)}% of all circuits`,
      icon: "🌐",
      color: "var(--gold)",
      tabKey: "projects",
    },
    {
      title: "Simulations Run Today",
      value: stats?.today_runs ?? 0,
      change: `${stats?.total_runs ?? 0} lifetime solves`,
      icon: "▶️",
      color: "#2ed573",
      tabKey: "projects",
    },
    {
      title: "Catalog Component Types",
      value: stats?.component_count ?? 0,
      change: "Active in circuit palette",
      icon: "🧩",
      color: "#a55eea",
      tabKey: "components",
    },
    {
      title: "Pending Reports / Flags",
      value: stats?.pending_reports_count ?? 0,
      change: stats?.pending_reports_count > 0 ? "Requires review" : "Queue clear",
      icon: "🚩",
      color: stats?.pending_reports_count > 0 ? "var(--danger)" : "var(--text-dim)",
      tabKey: "reports",
    },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>ADMIN CONSOLE OVERVIEW</div>
          <h1 style={styles.title}>
            CircuitLab <span className="gradient-text">Control Center</span>
          </h1>
          <p style={styles.subtitle}>
            Real-time telemetry, user management, and moderation control panel.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={styles.grid}>
        {statCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            style={styles.card}
            onClick={() => onNavigateTab && onNavigateTab(card.tabKey)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={styles.cardTitle}>{card.title}</span>
              <span style={styles.cardIcon}>{card.icon}</span>
            </div>
            <div style={{ ...styles.cardValue, color: card.color }}>{card.value}</div>
            <div style={styles.cardChange}>{card.change}</div>
          </motion.div>
        ))}
      </div>

      {/* Activity Feeds */}
      <div style={styles.feedRow}>
        {/* Recent Circuits Created */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>⚡</span>
              <span style={styles.panelTitle}>Recent Circuits Created</span>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab("projects")}
              style={styles.panelActionBtn}
            >
              View All Projects →
            </button>
          </div>

          <div style={styles.feedList}>
            {(!stats?.recent_projects || stats.recent_projects.length === 0) && (
              <div style={styles.emptyFeed}>No recent projects found.</div>
            )}
            {stats?.recent_projects?.map((p) => (
              <div key={p.id} style={styles.feedItem}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={styles.projectName}>{p.name}</span>
                    {p.is_public && <span style={styles.publicBadge}>PUBLIC</span>}
                  </div>
                  <div style={styles.projectMeta}>
                    by <strong style={{ color: "var(--text)" }}>{p.owner_name || `@${p.owner_username}`}</strong> · {timeAgo(p.created_at)}
                  </div>
                </div>

                <button
                  onClick={() => setPreviewProject(p)}
                  style={styles.previewBtn}
                  title="Inspect 3D circuit schematic"
                >
                  👁️ 3D Preview
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Published to Gallery */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>🌐</span>
              <span style={styles.panelTitle}>Recent Gallery Publications</span>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab("projects")}
              style={styles.panelActionBtn}
            >
              Manage Gallery →
            </button>
          </div>

          <div style={styles.feedList}>
            {(!stats?.recent_published || stats.recent_published.length === 0) && (
              <div style={styles.emptyFeed}>No public gallery projects yet.</div>
            )}
            {stats?.recent_published?.map((p) => (
              <div key={p.id} style={styles.feedItem}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={styles.projectName}>{p.name}</span>
                    <span style={styles.runBadge}>{p.run_count || 0} Runs</span>
                  </div>
                  <div style={styles.projectMeta}>
                    Shared by <strong style={{ color: "var(--text)" }}>{p.owner_name || `@${p.owner_username}`}</strong> · {timeAgo(p.updated_at || p.created_at)}
                  </div>
                </div>

                <button
                  onClick={() => setPreviewProject(p)}
                  style={styles.previewBtn}
                  title="Inspect 3D circuit schematic"
                >
                  👁️ Inspect
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive 3D Circuit Preview Modal */}
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
    gap: 28,
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
    fontSize: 26,
    fontWeight: 800,
    color: "var(--text)",
  },
  subtitle: {
    margin: 0,
    fontSize: 14,
    color: "var(--text-dim)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },
  card: {
    padding: "20px",
    background: "rgba(16, 22, 29, 0.75)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    backdropFilter: "blur(12px)",
    cursor: "pointer",
    transition: "transform 0.15s ease, border-color 0.15s ease",
    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--text-dim)",
    letterSpacing: "0.02em",
  },
  cardIcon: {
    fontSize: 18,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 800,
    fontFamily: "var(--font-display)",
    margin: "12px 0 4px",
    lineHeight: 1,
  },
  cardChange: {
    fontSize: 11.5,
    color: "var(--text-faint)",
  },
  feedRow: {
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
    fontSize: 14,
    fontWeight: 700,
    color: "var(--text)",
  },
  panelActionBtn: {
    background: "none",
    border: "none",
    color: "var(--primary)",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  feedList: {
    display: "flex",
    flexDirection: "column",
  },
  feedItem: {
    padding: "14px 20px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    transition: "background 0.15s ease",
  },
  projectName: {
    fontWeight: 700,
    fontSize: 13.5,
    color: "var(--text)",
  },
  projectMeta: {
    fontSize: 11.5,
    color: "var(--text-dim)",
    marginTop: 2,
  },
  publicBadge: {
    fontSize: 9.5,
    fontWeight: 700,
    background: "rgba(47, 214, 111, 0.12)",
    color: "#2fd66f",
    border: "1px solid rgba(47, 214, 111, 0.3)",
    borderRadius: 4,
    padding: "1px 5px",
  },
  runBadge: {
    fontSize: 9.5,
    fontWeight: 700,
    background: "rgba(69, 216, 196, 0.12)",
    color: "#45d8c4",
    borderRadius: 4,
    padding: "1px 5px",
  },
  previewBtn: {
    padding: "6px 12px",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  emptyFeed: {
    padding: "30px 20px",
    textAlign: "center",
    color: "var(--text-dim)",
    fontSize: 13,
  },
  loadingContainer: {
    padding: "100px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  spinner: {
    width: 32,
    height: 32,
    border: "3px solid rgba(47, 214, 111, 0.2)",
    borderTopColor: "var(--primary)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  errorBanner: {
    padding: "16px 20px",
    background: "rgba(255, 71, 87, 0.12)",
    border: "1px solid var(--danger)",
    borderRadius: "var(--radius)",
    color: "var(--danger)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  retryBtn: {
    padding: "6px 12px",
    background: "var(--danger)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius-sm)",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
};
