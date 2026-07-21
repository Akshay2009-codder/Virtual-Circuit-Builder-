import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AppShell from "../components/AppShell";
import client from "../api/client";

const STATUS_LABEL = {
  complete: "Working",
  open: "Open circuit",
  short: "Short circuit",
  no_source: "No power",
};
const STATUS_COLOR = {
  complete: "var(--primary)",
  open: "var(--gold)",
  short: "var(--danger)",
  no_source: "var(--text-faint)",
};

const gridVariants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const cardVariants = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function Share() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  function load(q = "") {
    setLoading(true);
    client
      .get("/community/projects", { params: q ? { q } : {} })
      .then((res) => setProjects(res.data.projects))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(query), 300); // debounce search
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function toggleLike(e, projectId) {
    e.preventDefault();
    e.stopPropagation();
    const res = await client.post(`/community/projects/${projectId}/like`);
    setProjects((ps) =>
      ps.map((p) => (p.id === projectId ? { ...p, liked_by_me: res.data.liked, like_count: res.data.like_count } : p))
    );
  }

  return (
    <AppShell>
      <div style={{ padding: "40px 6vw 60px" }}>
        <div style={{ maxWidth: 680, marginBottom: 26 }}>
          <div className="eyebrow">Community</div>
          <h1 style={styles.heroTitle}>
            Browse <span className="gradient-text">shared circuits</span>
          </h1>
          <p style={{ color: "var(--text-dim)", fontSize: 14.5, lineHeight: 1.6, margin: "10px 0 0" }}>
            Public circuits other CircuitLab builders have shared. Make one of your own public from the
            Builder toolbar.
          </p>
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search shared circuits by name or description…"
          style={styles.search}
        />

        {loading && <p style={{ color: "var(--text-dim)", marginTop: 20 }}>Loading…</p>}

        {!loading && projects.length === 0 && (
          <div style={styles.empty}>
            {query ? `No shared circuits match "${query}".` : "No public circuits yet — be the first to share one!"}
          </div>
        )}

        {!loading && projects.length > 0 && (
          <motion.div style={styles.grid} variants={gridVariants} initial="hidden" animate="show">
            {projects.map((p) => (
              <motion.div key={p.id} variants={cardVariants}>
                <Link to={`/circuits/${p.id}`} style={styles.card}>
                  <div style={styles.cardTop}>
                    <span style={styles.cardName}>{p.name}</span>
                    {p.last_run_status && (
                      <span style={{ ...styles.statusPill, color: STATUS_COLOR[p.last_run_status] }}>
                        {STATUS_LABEL[p.last_run_status]}
                      </span>
                    )}
                  </div>
                  {p.description && <p style={styles.cardDesc}>{p.description}</p>}
                  <div style={styles.cardFooter}>
                    <span style={styles.owner}>by {p.owner_name}</span>
                    <div style={{ display: "flex", gap: 14 }}>
                      <button
                        onClick={(e) => toggleLike(e, p.id)}
                        style={{ ...styles.likeBtn, color: p.liked_by_me ? "var(--danger)" : "var(--text-faint)" }}
                      >
                        {p.liked_by_me ? "♥" : "♡"} {p.like_count}
                      </button>
                      <span style={styles.metaIcon}>💬 {p.comment_count}</span>
                      <span style={styles.metaIcon}>{p.component_count} parts</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}

const styles = {
  heroTitle: {
    margin: "6px 0 0",
    fontSize: "clamp(26px, 3.2vw, 36px)",
    fontWeight: 700,
    fontFamily: "var(--font-body)",
    lineHeight: 1.15,
  },
  search: {
    width: "100%",
    maxWidth: 480,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "10px 14px",
    color: "var(--text)",
    fontSize: 13.5,
    outline: "none",
    marginBottom: 26,
    display: "block",
  },
  empty: {
    border: "1px dashed var(--border-bright)",
    borderRadius: "var(--radius)",
    padding: "40px",
    color: "var(--text-dim)",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 14,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: "18px 20px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    textDecoration: "none",
    height: "100%",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  cardName: { fontSize: 15.5, fontWeight: 600, color: "var(--text)" },
  statusPill: {
    fontFamily: "var(--font-display)",
    fontSize: 9.5,
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  cardDesc: {
    fontSize: 12.5,
    color: "var(--text-dim)",
    lineHeight: 1.5,
    margin: 0,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  cardFooter: {
    marginTop: "auto",
    paddingTop: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid var(--border)",
  },
  owner: { fontSize: 11.5, color: "var(--text-faint)" },
  likeBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "var(--font-display)",
    padding: 0,
  },
  metaIcon: { fontSize: 11.5, color: "var(--text-faint)" },
};