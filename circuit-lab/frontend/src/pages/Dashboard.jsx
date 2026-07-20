import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, x: -24, scale: 0.98, transition: { duration: 0.2, ease: "easeIn" } },
};
const menuVariants = {
  hidden: { opacity: 0, scale: 0.92, y: -6 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.94, y: -4, transition: { duration: 0.1 } },
};
const modalBackdropVariants = { hidden: { opacity: 0 }, show: { opacity: 1 }, exit: { opacity: 0 } };
const modalPanelVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 12 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15 } },
};

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

// Counts up from 0 to `value` whenever value changes - used on the stat cards
// so the dashboard feels alive instead of just printing static numbers.
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    const duration = 500;
    const start = performance.now();
    let raf;

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{display}</>;
}

function Toast({ toast }) {
  return (
    <div style={styles.toastWrap}>
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              ...styles.toast,
              borderColor: toast.type === "error" ? "var(--danger)" : "var(--primary)",
            }}
          >
            <span
              style={{
                ...styles.toastDot,
                background: toast.type === "error" ? "var(--danger)" : "var(--primary)",
              }}
            />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectMenu({ project, onRename, onDuplicate, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  function stop(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div ref={ref} style={{ position: "relative" }} onClick={stop}>
      <motion.button
        whileHover={{ background: "var(--border)" }}
        whileTap={{ scale: 0.92 }}
        onClick={(e) => {
          stop(e);
          setOpen((o) => !o);
        }}
        style={styles.kebabBtn}
        aria-label="Circuit options"
      >
        ⋮
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            style={styles.menu}
            onClick={stop}
          >
            <button
              style={styles.menuItem}
              onClick={(e) => {
                stop(e);
                setOpen(false);
                onRename(project);
              }}
            >
              Rename
            </button>
            <button
              style={styles.menuItem}
              onClick={(e) => {
                stop(e);
                setOpen(false);
                onDuplicate(project);
              }}
            >
              Duplicate
            </button>
            <div style={styles.menuDivider} />
            <button
              style={{ ...styles.menuItem, color: "var(--danger)" }}
              onClick={(e) => {
                stop(e);
                setOpen(false);
                onDelete(project);
              }}
            >
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DeleteConfirmModal({ project, onCancel, onConfirm, deleting }) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          variants={modalBackdropVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          style={styles.backdrop}
          onClick={onCancel}
        >
          <motion.div
            variants={modalPanelVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            style={styles.confirmPanel}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>Delete this circuit?</h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "var(--text-dim)" }}>
              <strong style={{ color: "var(--text)" }}>{project.name}</strong> and its circuit data
              will be permanently removed. This can't be undone.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button style={styles.cancelBtn} onClick={onCancel} disabled={deleting}>
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: deleting ? 1 : 1.03 }}
                whileTap={{ scale: deleting ? 1 : 0.97 }}
                style={styles.deleteBtn}
                onClick={onConfirm}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Delete circuit"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // recent | name | components

  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    client
      .get("/projects")
      .then((res) => setProjects(res.data.projects))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  function showToast(message, type = "success") {
    setToast({ id: Date.now(), message, type });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2600);
  }

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

  function startRename(project) {
    setRenamingId(project.id);
    setRenameValue(project.name);
  }

  async function commitRename(project) {
    const nextName = renameValue.trim();
    setRenamingId(null);
    if (!nextName || nextName === project.name) return;

    const prevProjects = projects;
    setProjects((ps) => ps.map((p) => (p.id === project.id ? { ...p, name: nextName } : p)));

    try {
      await client.patch(`/projects/${project.id}`, { name: nextName });
      showToast("Circuit renamed");
    } catch (err) {
      setProjects(prevProjects);
      showToast(err.response?.data?.error || "Couldn't rename the circuit", "error");
    }
  }

  async function handleDuplicate(project) {
    try {
      const res = await client.post("/projects", {
        name: `${project.name} (copy)`,
        description: project.description,
        circuit_json: project.circuit_json || { nodes: [], edges: [] },
      });
      setProjects((ps) => [res.data.project, ...ps]);
      showToast("Circuit duplicated");
    } catch (err) {
      showToast(err.response?.data?.error || "Couldn't duplicate the circuit", "error");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await client.delete(`/projects/${deleteTarget.id}`);
      setProjects((ps) => ps.filter((p) => p.id !== deleteTarget.id));
      showToast("Circuit deleted");
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.response?.data?.error || "Couldn't delete the circuit", "error");
    } finally {
      setDeleting(false);
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

  const visibleProjects = useMemo(() => {
    let list = projects;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q)
      );
    }
    list = [...list];
    if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "components") {
      list.sort((a, b) => (b.circuit_json?.nodes?.length || 0) - (a.circuit_json?.nodes?.length || 0));
    } else {
      list.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    }
    return list;
  }, [projects, query, sortBy]);

  return (
    <AppShell>
      <div style={{ padding: "36px 6vw" }}>
        {/* welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={styles.banner}
        >
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
        </motion.div>

        {/* stat cards - real numbers, animated on change */}
        <motion.div
          style={styles.statGrid}
          variants={gridVariants}
          initial="hidden"
          animate="show"
        >
          <StatCard label="Active projects" value={stats.active} sub="circuits in your workspace" accent="var(--primary)" />
          <StatCard label="Components placed" value={stats.totalComponents} sub="across all your circuits" accent="var(--accent)" />
          <StatCard label="Simulations run" value={stats.totalRuns} sub="times you've hit Run circuit" accent="var(--gold)" />
        </motion.div>

        <div style={styles.layout}>
          {/* project list */}
          <div>
            <div style={styles.listHeader}>
              <h2 style={{ fontSize: 16, margin: 0 }}>Recent projects</h2>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search circuits…"
                  style={styles.searchInput}
                />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.sortSelect}>
                  <option value="recent">Recently updated</option>
                  <option value="name">Name (A–Z)</option>
                  <option value="components">Most components</option>
                </select>
              </div>
            </div>

            {loading && <p style={{ color: "var(--text-dim)" }}>Loading your circuits…</p>}

            {!loading && projects.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={styles.empty}>
                No circuits yet. Click <strong style={{ color: "var(--primary)" }}>New circuit</strong> to start
                building, or check out <strong style={{ color: "var(--primary)" }}>Browse parts</strong> first.
              </motion.div>
            )}

            {!loading && projects.length > 0 && visibleProjects.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.empty}>
                No circuits match <strong style={{ color: "var(--text)" }}>"{query}"</strong>.
              </motion.div>
            )}

            {!loading && visibleProjects.length > 0 && (
              <motion.div style={styles.list} variants={gridVariants} initial="hidden" animate="show" layout>
                <AnimatePresence initial={false}>
                  {visibleProjects.map((p) => {
                    const badge = runBadge(p);
                    const isRenaming = renamingId === p.id;
                    return (
                      <MotionLink
                        key={p.id}
                        to={`/builder/${p.id}`}
                        style={styles.row}
                        layout
                        variants={cardVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        whileHover={{ borderColor: "var(--primary)", x: 2 }}
                        transition={{ duration: 0.15 }}
                        onClick={(e) => {
                          if (isRenaming) e.preventDefault();
                        }}
                      >
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {isRenaming ? (
                              <input
                                ref={renameInputRef}
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    commitRename(p);
                                  }
                                  if (e.key === "Escape") {
                                    e.preventDefault();
                                    setRenamingId(null);
                                  }
                                }}
                                onBlur={() => commitRename(p)}
                                style={styles.renameInput}
                              />
                            ) : (
                              <span style={styles.rowName}>{p.name}</span>
                            )}
                            {!p.is_owner && <span style={styles.sharedTag}>Shared</span>}
                          </div>
                          {p.description && !isRenaming && <div style={styles.rowDesc}>{p.description}</div>}
                          <div style={styles.rowMeta}>
                            {(p.circuit_json?.nodes || []).length} components · updated {timeAgo(p.updated_at)}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                          <span style={{ ...styles.badge, color: badge.color, borderColor: badge.color }}>{badge.label}</span>
                          {p.is_owner !== false && (
                            <ProjectMenu
                              project={p}
                              onRename={startRename}
                              onDuplicate={handleDuplicate}
                              onDelete={setDeleteTarget}
                            />
                          )}
                        </div>
                      </MotionLink>
                    );
                  })}
                </AnimatePresence>
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
            {recentActivity.map((p, i) => {
              const badge = runBadge(p);
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  style={styles.activityRow}
                >
                  <span style={{ ...styles.activityDot, background: badge.color }} />
                  <div>
                    <div style={styles.activityTime}>{timeAgo(p.last_run_at)}</div>
                    <div style={styles.activityName}>{p.name}</div>
                    <div style={{ color: badge.color, fontSize: 11.5 }}>{badge.label}</div>
                  </div>
                </motion.div>
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

      <DeleteConfirmModal
        project={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        deleting={deleting}
      />

      <Toast toast={toast} />
    </AppShell>
  );
}

function StatCard({ label, value, sub, accent }) {
  return (
    <motion.div variants={cardVariants} style={styles.statCard} whileHover={{ y: -2, borderColor: accent }}>
      <div style={{ ...styles.statAccentBar, background: accent }} />
      <div className="eyebrow" style={{ color: accent }}>
        {label}
      </div>
      <div style={styles.statValue}>
        <AnimatedNumber value={value} />
      </div>
      <div style={styles.statSub}>{sub}</div>
    </motion.div>
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
    transition: "border-color 0.2s ease",
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
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  searchInput: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    fontSize: 12.5,
    padding: "7px 10px",
    outline: "none",
    width: 170,
  },
  sortSelect: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-dim)",
    fontSize: 12.5,
    padding: "7px 8px",
    outline: "none",
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
  renameInput: {
    fontSize: 14.5,
    fontWeight: 600,
    color: "var(--text)",
    background: "var(--bg)",
    border: "1px solid var(--primary)",
    borderRadius: 6,
    padding: "3px 7px",
    outline: "none",
    minWidth: 160,
  },
  kebabBtn: {
    background: "transparent",
    border: "1px solid var(--border)",
    borderRadius: 6,
    color: "var(--text-dim)",
    width: 28,
    height: 28,
    fontSize: 16,
    lineHeight: 1,
    cursor: "pointer",
  },
  menu: {
    position: "absolute",
    top: 34,
    right: 0,
    background: "var(--surface)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius-sm)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
    minWidth: 140,
    padding: 6,
    zIndex: 20,
  },
  menuItem: {
    display: "block",
    width: "100%",
    textAlign: "left",
    background: "transparent",
    border: "none",
    color: "var(--text)",
    fontSize: 13,
    padding: "8px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },
  menuDivider: { height: 1, background: "var(--border)", margin: "4px 2px" },
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
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  confirmPanel: {
    background: "var(--surface)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius)",
    padding: "22px 24px",
    width: 360,
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
  },
  cancelBtn: {
    background: "transparent",
    border: "1px solid var(--border-bright)",
    color: "var(--text-dim)",
    fontSize: 13,
    fontWeight: 600,
    padding: "9px 16px",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "var(--danger)",
    border: "none",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    padding: "9px 16px",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
  },
  toastWrap: {
    position: "fixed",
    bottom: 24,
    right: 24,
    zIndex: 200,
  },
  toast: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "var(--surface)",
    border: "1px solid",
    borderRadius: "var(--radius-sm)",
    padding: "10px 16px",
    fontSize: 13,
    color: "var(--text)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
  },
  toastDot: { width: 7, height: 7, borderRadius: "50%", flexShrink: 0 },
};