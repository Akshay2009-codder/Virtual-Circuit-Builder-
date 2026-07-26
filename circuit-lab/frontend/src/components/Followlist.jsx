import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import AppShell from "../components/AppShell";
import client from "../api/client";

function initials(name) {
  return (name || "?")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Renders at both /u/:username/followers and /u/:username/following -
// which list to show is inferred from the URL path itself.
export default function FollowList() {
  const { username } = useParams();
  const location = useLocation();
  const mode = location.pathname.endsWith("/following") ? "following" : "followers";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    client
      .get(`/users/${username}/${mode}`)
      .then((res) => setUsers(res.data.users))
      .finally(() => setLoading(false));
  }, [username, mode]);

  return (
    <AppShell>
      <div style={{ padding: "40px 6vw 60px", maxWidth: 560 }}>
        <Link to={`/u/${username}`} style={{ color: "var(--accent)", fontSize: 13, textDecoration: "none" }}>
          ← Back to profile
        </Link>
        <h1 style={{ margin: "14px 0 22px", fontSize: 22, fontFamily: "var(--font-body)" }}>
          {mode === "followers" ? `@${username}'s followers` : `@${username} is following`}
        </h1>

        {loading && <p style={{ color: "var(--text-dim)" }}>Loading…</p>}

        {!loading && users.length === 0 && (
          <div style={styles.empty}>
            {mode === "followers" ? "No followers yet." : "Not following anyone yet."}
          </div>
        )}

        {!loading &&
          users.map((u) => (
            <Link key={u.id} to={`/u/${u.username}`} style={styles.row}>
              <div style={styles.avatar}>{initials(u.name)}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{u.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-faint)" }}>@{u.username}</div>
              </div>
            </Link>
          ))}
      </div>
    </AppShell>
  );
}

const styles = {
  empty: {
    border: "1px dashed var(--border-bright)",
    borderRadius: "var(--radius)",
    padding: "32px",
    color: "var(--text-dim)",
    textAlign: "center",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 0",
    borderBottom: "1px solid var(--border)",
    textDecoration: "none",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "linear-gradient(135deg, var(--primary), var(--accent))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-display)",
    fontSize: 13,
    fontWeight: 700,
    color: "#0a0a0a",
    flexShrink: 0,
  },
};