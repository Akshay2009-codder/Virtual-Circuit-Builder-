import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";

const STATUS_LABEL = {
  in_progress: "In progress",
  completed: "Completed",
  error: "Error",
};

const STATUS_COLOR = {
  in_progress: "var(--copper)",
  completed: "var(--teal)",
  error: "var(--danger)",
};

const MotionLink = motion(Link);

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get("/projects")
      .then((res) => setProjects(res.data.projects))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <div style={{ padding: "40px 6vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
          <div>
            <div className="eyebrow">Dashboard</div>
            <h1 style={{ margin: "6px 0 0", fontSize: 26, fontFamily: "var(--font-body)" }}>
              Welcome, {user?.name}
            </h1>
          </div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link to="/builder" style={styles.newBtn}>
              + New circuit
            </Link>
          </motion.div>
        </div>

        {loading && <p style={{ color: "var(--text-dim)" }}>Loading your circuits…</p>}

        {!loading && projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={styles.empty}
          >
            No circuits yet. Click <strong style={{ color: "var(--copper)" }}>New circuit</strong> to
            start building, or check out <strong style={{ color: "var(--copper)" }}>Components</strong>{" "}
            first to see the parts in 3D.
          </motion.div>
        )}

        {!loading && projects.length > 0 && (
          <motion.div style={styles.grid} variants={gridVariants} initial="hidden" animate="show">
            {projects.map((p) => (
              <MotionLink
                key={p.id}
                to={`/builder/${p.id}`}
                style={styles.card}
                variants={cardVariants}
                whileHover={{ y: -4, borderColor: "var(--copper)", boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <span style={{ ...styles.statusDot, background: STATUS_COLOR[p.status] }} />
                <span style={styles.cardName}>{p.name}</span>
                <span style={{ color: STATUS_COLOR[p.status], fontSize: 12 }} className="mono">
                  {STATUS_LABEL[p.status]}
                </span>
                <span style={styles.cardMeta}>
                  {(p.circuit_json?.nodes || []).length} components
                </span>
              </MotionLink>
            ))}
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}

const styles = {
  newBtn: {
    display: "inline-block",
    background: "var(--copper)",
    color: "#1a1002",
    fontWeight: 600,
    fontSize: 13.5,
    padding: "9px 18px",
    borderRadius: "var(--radius-sm)",
    textDecoration: "none",
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
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 14,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: "16px 18px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    textDecoration: "none",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
  },
  cardName: {
    fontSize: 15,
    fontWeight: 600,
    color: "var(--text)",
  },
  cardMeta: {
    color: "var(--text-faint)",
    fontSize: 12,
  },
};