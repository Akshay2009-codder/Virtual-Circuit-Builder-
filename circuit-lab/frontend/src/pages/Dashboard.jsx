import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import AppShell from "../components/AppShell";
import NewCircuitModal from "../components/NewCircuitModal";
import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../utils/timeAgo";
import client from "../api/client";

const RUN_STATUS = {
  complete: { label: "Operational", color: "#2fd66f", bg: "rgba(47, 214, 111, 0.12)", border: "rgba(47, 214, 111, 0.35)" },
  open: { label: "Open Loop", color: "#ffd32a", bg: "rgba(255, 211, 42, 0.12)", border: "rgba(255, 211, 42, 0.35)" },
  short: { label: "Short Circuit", color: "#ff4757", bg: "rgba(255, 71, 87, 0.12)", border: "rgba(255, 71, 87, 0.35)" },
  no_source: { label: "No Power Source", color: "var(--text-dim)", bg: "rgba(255, 255, 255, 0.04)", border: "var(--border)" },
};

const gridVariants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } },
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function runBadge(project) {
  if (!project.last_run_status) return { label: "Unchecked", color: "var(--text-dim)", bg: "rgba(255, 255, 255, 0.03)", border: "var(--border)" };
  return RUN_STATUS[project.last_run_status] || { label: "Simulated", color: "var(--text-dim)", bg: "rgba(255, 255, 255, 0.03)", border: "var(--border)" };
}

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
  }, [value]);

  return <>{display}</>;
}

function StatCard({ label, value, sub, icon, accent = "var(--primary)" }) {
  return (
    <div style={{ ...styles.statCard, borderColor: "var(--border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={styles.statLabel}>{label}</div>
          <div style={{ ...styles.statNumber, color: accent }}>
            <AnimatedNumber value={value} />
          </div>
        </div>
        <div style={{ ...styles.statIconBox, background: `${accent}18`, color: accent, borderColor: `${accent}40` }}>
          {icon}
        </div>
      </div>
      <div style={styles.statSub}>{sub}</div>
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
      <button
        onClick={(e) => {
          stop(e);
          setOpen((o) => !o);
        }}
        style={styles.kebabBtn}
        aria-label="Circuit options"
      >
        ⋮
      </button>
      {open && (
        <div style={styles.menu} onClick={stop}>
          <button
            style={styles.menuItem}
            onClick={(e) => {
              stop(e);
              setOpen(false);
              onRename(project);
            }}
          >
            ✏️ Rename Circuit
          </button>
          <button
            style={styles.menuItem}
            onClick={(e) => {
              stop(e);
              setOpen(false);
              onDuplicate(project);
            }}
          >
            📋 Duplicate Project
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
            🗑️ Delete Circuit
          </button>
        </div>
      )}
    </div>
  );
}

function DeleteConfirmModal({ project, onCancel, onConfirm, deleting }) {
  if (!project) return null;
  return (
    <div style={styles.backdrop} onClick={onCancel}>
      <div style={styles.confirmPanel} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 22 }}>⚠️</span>
          <h3 style={{ margin: 0, fontSize: 17, color: "var(--text)" }}>Delete this circuit?</h3>
        </div>
        <p style={{ margin: "0 0 20px", fontSize: 13.5, color: "var(--text-dim)", lineHeight: 1.5 }}>
          <strong style={{ color: "var(--text)" }}>"{project.name}"</strong> and all placed component wiring will be permanently removed.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button style={styles.cancelBtn} onClick={onCancel} disabled={deleting}>
            Cancel
          </button>
          <button style={styles.deleteBtn} onClick={onConfirm} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete Circuit"}
          </button>
        </div>
      </div>
    </div>
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid"); // grid | list

  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  function loadProjects() {
    client
      .get("/projects")
      .then((res) => setProjects(res.data.projects || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadProjects();
    window.addEventListener("project-invite-accepted", loadProjects);
    return () => window.removeEventListener("project-invite-accepted", loadProjects);
  }, []);

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  function showToast(message, type = "success") {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => setToast(null), 2800);
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
      setCreateError(err.response?.data?.error || "Couldn't create circuit.");
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

    setProjects((ps) => ps.map((p) => (p.id === project.id ? { ...p, name: nextName } : p)));
    try {
      await client.patch(`/projects/${project.id}`, { name: nextName });
      showToast("Circuit renamed successfully.");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to rename.", "error");
      loadProjects();
    }
  }

  async function handleDuplicate(project) {
    try {
      const res = await client.post("/projects", {
        name: `${project.name} (Copy)`,
        description: project.description,
        circuit_json: project.circuit_json || { nodes: [], edges: [] },
      });
      setProjects((ps) => [res.data.project, ...ps]);
      showToast("Circuit duplicated.");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to duplicate.", "error");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await client.delete(`/projects/${deleteTarget.id}`);
      setProjects((ps) => ps.filter((p) => p.id !== deleteTarget.id));
      showToast("Circuit deleted.");
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to delete.", "error");
    } finally {
      setDeleting(false);
    }
  }

  const stats = useMemo(() => {
    const totalComponents = projects.reduce((sum, p) => sum + (p.circuit_json?.nodes?.length || 0), 0);
    const totalRuns = projects.reduce((sum, p) => sum + (p.run_count || 0), 0);
    const workingCount = projects.filter((p) => p.last_run_status === "complete").length;
    return { active: projects.length, totalComponents, totalRuns, workingCount };
  }, [projects]);

  const visibleProjects = useMemo(() => {
    let list = projects;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      if (statusFilter === "shared") {
        list = list.filter((p) => p.is_public);
      } else {
        list = list.filter((p) => p.last_run_status === statusFilter);
      }
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
  }, [projects, query, statusFilter, sortBy]);

  return (
    <AppShell>
      <div style={styles.page}>
        {/* Toast Alert */}
        {toast && (
          <div style={{ ...styles.toast, borderColor: toast.type === "error" ? "var(--danger)" : "#2fd66f" }}>
            <span>{toast.type === "error" ? "⚠️" : "✓"}</span>
            <span>{toast.message}</span>
          </div>
        )}

        {/* WORKBENCH WELCOME HERO */}
        <section style={styles.heroSection}>
          <div style={styles.heroContent}>
            <div>
              <div className="eyebrow">⚡ VIRTUAL ELECTRONICS WORKBENCH</div>
              <h1 style={styles.heroTitle}>
                {greeting()}, <span className="gradient-text">{user?.name}</span>
              </h1>
              <p style={styles.heroSub}>
                Design, test, and simulate 3D circuits with real-time electronic physics analysis.
              </p>
            </div>

            <div style={styles.heroBtnGroup}>
              <button onClick={() => setModalOpen(true)} style={styles.primaryNewBtn}>
                <span>+ New Circuit</span>
              </button>
              <Link to="/components" style={styles.secondaryBrowseBtn}>
                <span>🧩 Component Catalog</span>
              </Link>
            </div>
          </div>
        </section>

        {/* METRICS ROW */}
        <div style={styles.statGrid}>
          <StatCard label="Total Circuits" value={stats.active} sub="Saved in your workspace" icon="⚡" accent="#2fd66f" />
          <StatCard label="Components Placed" value={stats.totalComponents} sub="Across active schematics" icon="🧩" accent="#45d8c4" />
          <StatCard label="Simulations Run" value={stats.totalRuns} sub="Real-time solver checks" icon="🔬" accent="#ffd32a" />
          <StatCard label="Operational Circuits" value={stats.workingCount} sub="Verified working loops" icon="✅" accent="#20bf6b" />
        </div>

        {/* CONTROL TOOLBAR: SEARCH, FILTERS & VIEW TOGGLE */}
        <div style={styles.toolbar}>
          <div style={styles.toolbarLeft}>
            {/* Search Input */}
            <div style={styles.searchWrap}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search circuits by name or description…"
                style={styles.searchInput}
              />
              {query && (
                <button onClick={() => setQuery("")} style={styles.searchClear}>
                  ✕
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div style={styles.filterPills}>
              {[
                { id: "all", label: "All" },
                { id: "complete", label: "Operational" },
                { id: "open", label: "Open Loop" },
                { id: "shared", label: "Shared" },
              ].map((tab) => {
                const active = statusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    style={{
                      ...styles.filterPill,
                      background: active ? "rgba(47, 214, 111, 0.15)" : "rgba(255, 255, 255, 0.03)",
                      color: active ? "#2fd66f" : "var(--text-dim)",
                      borderColor: active ? "rgba(47, 214, 111, 0.4)" : "var(--border)",
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={styles.toolbarRight}>
            {/* Sort Dropdown */}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.sortSelect}>
              <option value="recent">Recently Updated</option>
              <option value="name">Name (A–Z)</option>
              <option value="components">Most Components</option>
            </select>

            {/* View Mode Toggle */}
            <div style={styles.viewToggleGroup}>
              <button
                onClick={() => setViewMode("grid")}
                style={{
                  ...styles.viewBtn,
                  background: viewMode === "grid" ? "rgba(47, 214, 111, 0.15)" : "transparent",
                  color: viewMode === "grid" ? "#2fd66f" : "var(--text-dim)",
                }}
                title="Grid View"
              >
                🪟
              </button>
              <button
                onClick={() => setViewMode("list")}
                style={{
                  ...styles.viewBtn,
                  background: viewMode === "list" ? "rgba(47, 214, 111, 0.15)" : "transparent",
                  color: viewMode === "list" ? "#2fd66f" : "var(--text-dim)",
                }}
                title="List View"
              >
                📋
              </button>
            </div>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && <p style={{ color: "var(--text-dim)", padding: 20 }}>Loading your circuits…</p>}

        {/* EMPTY STATE */}
        {!loading && projects.length === 0 && (
          <div style={styles.emptyState}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>⚡</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 20, color: "var(--text)" }}>Your Workbench is Empty</h2>
            <p style={{ margin: "0 0 20px", fontSize: 14, color: "var(--text-dim)", maxWidth: 460 }}>
              Start by creating your first circuit or exploring component models in the 3D catalog.
            </p>
            <button onClick={() => setModalOpen(true)} style={styles.primaryNewBtn}>
              + Create First Circuit
            </button>
          </div>
        )}

        {/* NO SEARCH RESULTS */}
        {!loading && projects.length > 0 && visibleProjects.length === 0 && (
          <div style={styles.emptyState}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 17, color: "var(--text)" }}>No matching circuits</h3>
            <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "var(--text-dim)" }}>
              No circuits match "{query}". Try adjusting your search or filters.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setStatusFilter("all");
              }}
              style={styles.cancelBtn}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* CIRCUIT CARDS / LIST VIEW */}
        {!loading && visibleProjects.length > 0 && (
          <div style={viewMode === "grid" ? styles.grid : styles.listContainer}>
            {visibleProjects.map((p) => {
              const badge = runBadge(p);
              const nodes = p.circuit_json?.nodes || [];
              const isRenaming = renamingId === p.id;

              return (
                <div key={p.id} style={viewMode === "grid" ? styles.card : styles.listRow}>
                  {/* Top Row: Name + Kebab Options */}
                  <div style={styles.cardHeader}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      {isRenaming ? (
                        <input
                          ref={renameInputRef}
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitRename(p);
                            if (e.key === "Escape") setRenamingId(null);
                          }}
                          onBlur={() => commitRename(p)}
                          style={styles.renameInput}
                        />
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Link to={`/builder/${p.id}`} style={styles.cardTitle}>
                            {p.name}
                          </Link>
                          {p.is_public && <span style={styles.publicBadge}>🌐 Public</span>}
                        </div>
                      )}
                    </div>
                    <ProjectMenu
                      project={p}
                      onRename={startRename}
                      onDuplicate={handleDuplicate}
                      onDelete={(target) => setDeleteTarget(target)}
                    />
                  </div>

                  {/* Description */}
                  {p.description && !isRenaming && (
                    <p style={styles.cardDesc}>{p.description}</p>
                  )}

                  {/* Component Chips */}
                  <div style={styles.chipsRow}>
                    {nodes.slice(0, 3).map((n, idx) => (
                      <span key={idx} style={styles.partChip}>
                        {n.name}
                      </span>
                    ))}
                    {nodes.length > 3 && (
                      <span style={styles.morePartsChip}>+{nodes.length - 3} more</span>
                    )}
                  </div>

                  {/* Footer: Status Badge + Launch Button */}
                  <div style={styles.cardFooter}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        color: badge.color,
                        background: badge.bg,
                        borderColor: badge.border,
                      }}
                    >
                      ● {badge.label}
                    </span>

                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={styles.timeText}>{timeAgo(p.updated_at)}</span>
                      <Link to={`/builder/${p.id}`} style={styles.launchBtn}>
                        <span>Open 3D ➔</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* NEW CIRCUIT MODAL */}
        <NewCircuitModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreate}
          loading={creating}
          error={createError}
        />

        {/* DELETE CONFIRM MODAL */}
        <DeleteConfirmModal
          project={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          deleting={deleting}
        />
      </div>
    </AppShell>
  );
}

const styles = {
  page: {
    padding: "32px 5vw 80px",
    maxWidth: 1400,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 28,
  },
  heroSection: {
    padding: "32px 36px",
    background: "linear-gradient(135deg, rgba(16, 23, 32, 0.9) 0%, rgba(10, 14, 19, 0.95) 100%)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius)",
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.45)",
  },
  heroContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
    flexWrap: "wrap",
  },
  heroTitle: {
    margin: "6px 0",
    fontSize: "clamp(24px, 3.2vw, 36px)",
    fontWeight: 800,
    color: "var(--text)",
  },
  heroSub: {
    margin: 0,
    fontSize: 14,
    color: "var(--text-dim)",
  },
  heroBtnGroup: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  primaryNewBtn: {
    padding: "10px 18px",
    background: "#2fd66f",
    color: "#0a0e13",
    border: "none",
    borderRadius: "var(--radius-sm)",
    fontSize: 13.5,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(47, 214, 111, 0.3)",
    transition: "transform 0.15s ease",
  },
  secondaryBrowseBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "10px 16px",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    fontSize: 13.5,
    fontWeight: 600,
    textDecoration: "none",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },
  statCard: {
    background: "rgba(16, 22, 29, 0.75)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "18px 20px",
    backdropFilter: "blur(12px)",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--text-dim)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    fontFamily: "var(--font-mono)",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 800,
    fontFamily: "var(--font-mono)",
    margin: "4px 0",
  },
  statIconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    border: "1px solid",
    display: "grid",
    placeItems: "center",
    fontSize: 16,
  },
  statSub: {
    fontSize: 11.5,
    color: "var(--text-faint)",
    marginTop: 4,
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  toolbarLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 300,
    flexWrap: "wrap",
  },
  searchWrap: {
    position: "relative",
    flex: 1,
    minWidth: 220,
    maxWidth: 400,
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 13,
    opacity: 0.5,
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "9px 32px 9px 36px",
    background: "rgba(16, 22, 29, 0.85)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    fontSize: 13,
    outline: "none",
  },
  searchClear: {
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
  filterPills: {
    display: "flex",
    gap: 6,
  },
  filterPill: {
    padding: "6px 12px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border)",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  toolbarRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  sortSelect: {
    padding: "8px 12px",
    background: "rgba(16, 22, 29, 0.85)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    fontSize: 12.5,
    outline: "none",
    cursor: "pointer",
  },
  viewToggleGroup: {
    display: "flex",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    overflow: "hidden",
  },
  viewBtn: {
    padding: "6px 10px",
    border: "none",
    cursor: "pointer",
    fontSize: 13,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: 20,
  },
  card: {
    background: "rgba(16, 22, 29, 0.8)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
    transition: "transform 0.15s ease, border-color 0.15s ease",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "var(--text)",
    textDecoration: "none",
  },
  publicBadge: {
    fontSize: 10,
    padding: "1px 6px",
    borderRadius: 4,
    background: "rgba(69, 216, 196, 0.12)",
    color: "#45d8c4",
    border: "1px solid rgba(69, 216, 196, 0.3)",
  },
  cardDesc: {
    margin: 0,
    fontSize: 12.5,
    color: "var(--text-dim)",
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  chipsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },
  partChip: {
    fontSize: 11,
    padding: "2px 8px",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid var(--border)",
    borderRadius: 4,
    color: "var(--text-dim)",
  },
  morePartsChip: {
    fontSize: 11,
    color: "#2fd66f",
    fontWeight: 600,
    padding: "2px 4px",
  },
  cardFooter: {
    marginTop: "auto",
    paddingTop: 12,
    borderTop: "1px solid var(--border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "var(--font-mono)",
    padding: "2px 8px",
    borderRadius: 10,
    border: "1px solid",
  },
  timeText: {
    fontSize: 11.5,
    color: "var(--text-faint)",
  },
  launchBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 10px",
    background: "rgba(47, 214, 111, 0.12)",
    border: "1px solid rgba(47, 214, 111, 0.35)",
    borderRadius: "var(--radius-sm)",
    color: "#2fd66f",
    fontSize: 11.5,
    fontWeight: 700,
    textDecoration: "none",
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  listRow: {
    background: "rgba(16, 22, 29, 0.8)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "14px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  kebabBtn: {
    background: "none",
    border: "none",
    color: "var(--text-dim)",
    fontSize: 16,
    cursor: "pointer",
    padding: "2px 6px",
    borderRadius: 4,
  },
  menu: {
    position: "absolute",
    right: 0,
    top: 24,
    zIndex: 20,
    background: "#121922",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
    padding: 4,
    minWidth: 160,
    display: "flex",
    flexDirection: "column",
  },
  menuItem: {
    background: "none",
    border: "none",
    color: "var(--text)",
    padding: "8px 12px",
    textAlign: "left",
    fontSize: 12.5,
    cursor: "pointer",
    borderRadius: 4,
  },
  menuDivider: {
    height: 1,
    background: "var(--border)",
    margin: "4px 0",
  },
  renameInput: {
    width: "100%",
    padding: "4px 8px",
    background: "#0a0e13",
    border: "1px solid #2fd66f",
    borderRadius: 4,
    color: "var(--text)",
    fontSize: 14,
    outline: "none",
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    background: "rgba(0,0,0,0.75)",
    display: "grid",
    placeItems: "center",
    backdropFilter: "blur(6px)",
  },
  confirmPanel: {
    background: "#10161d",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: 24,
    maxWidth: 400,
    width: "90%",
    boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
  },
  cancelBtn: {
    padding: "8px 14px",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    fontSize: 13,
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "8px 14px",
    background: "var(--danger)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius-sm)",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  emptyState: {
    padding: "60px 20px",
    textAlign: "center",
    background: "rgba(16, 22, 29, 0.6)",
    border: "1px dashed var(--border-bright)",
    borderRadius: "var(--radius)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  toast: {
    position: "fixed",
    top: 24,
    right: 24,
    zIndex: 3000,
    background: "rgba(16, 22, 29, 0.95)",
    border: "1px solid",
    padding: "10px 18px",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    fontSize: 13,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 8,
    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
  },
};