import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppShell from "../components/AppShell";
import NewCircuitModal from "../components/NewCircuitModal";
import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../utils/timeAgo";
import client from "../api/client";

const RUN_STATUS = {
  complete: { label: "Working", color: "var(--primary)" },
  open: { label: "Open circuit", color: "var(--gold)" },
  short: { label: "Short circuit", color: "var(--danger)" },
  no_source: { label: "No power source", color: "var(--text-faint)" },
};

const MotionLink = motion(Link);

const gridVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const cardVariants = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } } };

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function runBadge(project) {
  if (!project.last_run_status) return { label: "Not tested yet", color: "var(--text-faint)" };
  return RUN_STATUS[project.last_run_status] || { label: "Unknown", color: "var(--text-faint)" };
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    client
      .get("/projects")
      .then((res) => setProjects(res.data.projects))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate({ name, description }) {
    setCreating(true);
    setCreateError("");
    try {
      const res = await client.post("/projects", {
        name,
        description,
        circuit_json: { nodes: [], edges: [] },
      });
      navigate(`/builder/${res.data.project.id}`);
    } catch (err) {
      setCreateError(
        err.response?.data?.error ||
          "Couldn't create the circuit. Make sure the backend is running and up to date."
      );
    } finally {
      setCreating(false);
    }
  }

  const stats = useMemo(() => {
    const totalComponents = projects.reduce((sum, p) => sum + (p.circuit_json?.nodes?.length || 0), 0);
    const totalRuns = projects.reduce((sum, p) => sum + (p.run_count || 0), 0);
    return { active: projects.length, totalComponents, totalRuns };
  }, [projects]);

  const recentActivity = useMemo(() => {
    return projects
      .filter((p) => p.last_run_at)
      .sort((a, b) => new Date(b.last_run_at) - new Date(a.last_run_at))
      .slice(0, 6);
  }, [projects]);

  return (
    <AppShell>
      <div style={{ padding: "36px 6vw" }}>
        {/* welcome banner */}
        <div style={styles.banner}>
          <div>
            <h1 style={styles.bannerTitle}>
              {greeting()}, <span className="gradient-text">{user?.name}</span> 👋
            </h1>
            <p style={styles.bannerSub}>
              Build circuits, run real connectivity checks, and share projects with your team.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setModalOpen(true)} style={styles.newBtn}>
              + New circuit
            </motion.button>
            <Link to="/components" style={styles.secondaryBtn}>
              Browse parts
            </Link>
          </div>
        </div>

        {/* stat cards - real numbers only */}
        <div style={styles.statGrid}>
          <StatCard label="Active projects" value={stats.active} sub="circuits in your workspace" accent="var(--primary)" />
          <StatCard label="Components placed" value={stats.totalComponents} sub="across all your circuits" accent="var(--accent)" />
          <StatCard label="Simulations run" value={stats.totalRuns} sub="times you've hit Run circuit" accent="var(--gold)" />
        </div>

        <div style={styles.layout}>
          {/* project list */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, margin: 0 }}>Recent projects</h2>
              <span style={{ color: "var(--text-faint)", fontSize: 12 }}>Manage your circuit schematics</span>
            </div>

            {loading && <p style={{ color: "var(--text-dim)" }}>Loading your circuits…</p>}

            {!loading && projects.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={styles.empty}>
                No circuits yet. Click <strong style={{ color: "var(--primary)" }}>New circuit</strong> to start
                building, or check out <strong style={{ color: "var(--primary)" }}>Browse parts</strong> first.
              </motion.div>
            )}

            {!loading && projects.length > 0 && (
              <motion.div style={styles.list} variants={gridVariants} initial="hidden" animate="show">
                {projects.map((p) => {
                  const badge = runBadge(p);
                  return (
                    <MotionLink
                      key={p.id}
                      to={`/builder/${p.id}`}
                      style={styles.row}
                      variants={cardVariants}
                      whileHover={{ borderColor: "var(--primary)", x: 2 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={styles.rowName}>{p.name}</span>
                          {!p.is_owner && <span style={styles.sharedTag}>Shared</span>}
                        </div>
                        {p.description && <div style={styles.rowDesc}>{p.description}</div>}
                        <div style={styles.rowMeta}>
                          {(p.circuit_json?.nodes || []).length} components · updated {timeAgo(p.updated_at)}
                        </div>
                      </div>
                      <span style={{ ...styles.badge, color: badge.color, borderColor: badge.color }}>{badge.label}</span>
                    </MotionLink>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* real activity feed, built from actual run history */}
          <div style={styles.activityPanel}>
            <h2 style={{ fontSize: 14, margin: "0 0 14px" }}>Recent activity</h2>
            {recentActivity.length === 0 && (
              <p style={{ color: "var(--text-faint)", fontSize: 12.5 }}>
                Nothing yet — run a circuit to see activity here.
              </p>
            )}
            {recentActivity.map((p) => {
              const badge = runBadge(p);
              return (
                <div key={p.id} style={styles.activityRow}>
                  <span style={{ ...styles.activityDot, background: badge.color }} />
                  <div>
                    <div style={styles.activityTime}>{timeAgo(p.last_run_at)}</div>
                    <div style={styles.activityName}>{p.name}</div>
                    <div style={{ color: badge.color, fontSize: 11.5 }}>{badge.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <NewCircuitModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setCreateError("");
        }}
        onCreate={handleCreate}
        creating={creating}
        error={createError}
      />
    </AppShell>
  );
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={styles.statCard}>
      <div style={{ ...styles.statAccentBar, background: accent }} />
      <div className="eyebrow" style={{ color: accent }}>
        {label}
      </div>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statSub}>{sub}</div>
    </div>
  );
}

const styles = {
  banner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 28,
  },
  bannerTitle: { fontSize: 26, margin: 0, fontFamily: "var(--font-body)" },
  bannerSub: { color: "var(--text-dim)", fontSize: 13.5, margin: "8px 0 0" },
  newBtn: {
    background: "var(--primary)",
    color: "#062011",
    fontWeight: 600,
    fontSize: 13.5,
    padding: "10px 18px",
    borderRadius: "var(--radius-sm)",
    border: "none",
    cursor: "pointer",
  },
  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    background: "transparent",
    color: "var(--text-dim)",
    fontWeight: 600,
    fontSize: 13.5,
    padding: "10px 18px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border-bright)",
    textDecoration: "none",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 14,
    marginBottom: 32,
  },
  statCard: {
    position: "relative",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "18px 20px",
    overflow: "hidden",
  },
  statAccentBar: { position: "absolute", top: 0, left: 0, right: 0, height: 3 },
  statValue: { fontSize: 28, fontWeight: 700, margin: "8px 0 2px", fontFamily: "var(--font-display)" },
  statSub: { color: "var(--text-faint)", fontSize: 12 },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 300px",
    gap: 28,
    alignItems: "start",
  },
  empty: {
    border: "1px dashed var(--border-bright)",
    borderRadius: "var(--radius)",
    padding: "40px",
    color: "var(--text-dim)",
    textAlign: "center",
  },
  list: { display: "flex", flexDirection: "column", gap: 10 },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    padding: "14px 18px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    textDecoration: "none",
  },
  rowName: { fontSize: 14.5, fontWeight: 600, color: "var(--text)" },
  rowDesc: {
    fontSize: 12,
    color: "var(--text-dim)",
    marginTop: 3,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: 480,
  },
  rowMeta: { fontSize: 11.5, color: "var(--text-faint)", marginTop: 5, fontFamily: "var(--font-display)" },
  sharedTag: {
    fontSize: 10,
    fontFamily: "var(--font-display)",
    color: "var(--accent)",
    border: "1px solid var(--accent)",
    borderRadius: 10,
    padding: "1px 7px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  badge: {
    fontSize: 11,
    fontFamily: "var(--font-display)",
    border: "1px solid",
    borderRadius: 20,
    padding: "4px 10px",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  activityPanel: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "18px 20px",
    position: "sticky",
    top: 90,
  },
  activityRow: {
    display: "flex",
    gap: 10,
    padding: "10px 0",
    borderTop: "1px solid var(--border)",
  },
  activityDot: { width: 7, height: 7, borderRadius: "50%", marginTop: 5, flexShrink: 0 },
  activityTime: { fontSize: 10.5, color: "var(--text-faint)", fontFamily: "var(--font-display)" },
  activityName: { fontSize: 13, fontWeight: 600, color: "var(--text)", margin: "2px 0" },
};