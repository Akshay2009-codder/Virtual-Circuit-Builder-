import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AppShell from "../components/AppShell";
import client from "../api/client";

const gridVariants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const cardVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

function initials(name) {
  return (name || "?")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function PeopleSearch() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      client
        .get("/users/search", { params: { q: query.trim() } })
        .then((res) => setUsers(res.data.users))
        .finally(() => {
          setLoading(false);
          setSearched(true);
        });
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <AppShell>
      <div style={{ padding: "40px 6vw 60px" }}>
        <div style={{ maxWidth: 680, marginBottom: 26 }}>
          <div className="eyebrow">Community</div>
          <h1 style={styles.heroTitle}>
            Find <span className="gradient-text">builders</span>
          </h1>
          <p style={{ color: "var(--text-dim)", fontSize: 14.5, lineHeight: 1.6, margin: "10px 0 0" }}>
            Search by username to see someone's profile, bio, and public circuits.
          </p>
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username…"
          style={styles.search}
          autoFocus
        />

        {loading && <p style={{ color: "var(--text-dim)", marginTop: 20 }}>Searching…</p>}

        {!loading && searched && users.length === 0 && (
          <div style={styles.empty}>No one found for "{query}".</div>
        )}

        {!loading && users.length > 0 && (
          <motion.div style={styles.grid} variants={gridVariants} initial="hidden" animate="show">
            {users.map((u) => (
              <motion.div key={u.id} variants={cardVariants}>
                <Link to={`/u/${u.username}`} style={styles.card}>
                  <div style={styles.avatar}>{initials(u.name)}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={styles.name}>{u.name}</div>
                    <div style={styles.username}>@{u.username}</div>
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
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 12,
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 16px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    textDecoration: "none",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "linear-gradient(135deg, var(--primary), var(--accent))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-display)",
    fontSize: 14,
    fontWeight: 700,
    color: "#0a0a0a",
    flexShrink: 0,
  },
  name: { fontSize: 14, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  username: { fontSize: 12, color: "var(--text-faint)" },
};