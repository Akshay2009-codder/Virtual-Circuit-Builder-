import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import Scene3D from "../components/builder3d/Scene3D";
import client from "../api/client";

const noop = () => {};

export default function CircuitView() {
  const { id } = useParams();
  const cameraRef = useRef(null);

  const [project, setProject] = useState(null);
  const [stats, setStats] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      client.get(`/projects/${id}`),
      client.get(`/community/projects/${id}`),
      client.get(`/community/projects/${id}/comments`),
    ])
      .then(([projRes, statsRes, commentsRes]) => {
        setProject(projRes.data.project);
        setStats(statsRes.data.project);
        setComments(commentsRes.data.comments);
      })
      .catch(() => setError("This circuit isn't public, or doesn't exist."))
      .finally(() => setLoading(false));
  }, [id]);

  async function toggleLike() {
    const res = await client.post(`/community/projects/${id}/like`);
    setStats((s) => ({ ...s, liked_by_me: res.data.liked, like_count: res.data.like_count }));
  }

  async function submitComment(e) {
    e.preventDefault();
    const body = commentText.trim();
    if (!body) return;
    setPosting(true);
    try {
      const res = await client.post(`/community/projects/${id}/comments`, { body });
      setComments((c) => [...c, res.data.comment]);
      setCommentText("");
      setStats((s) => ({ ...s, comment_count: (s?.comment_count || 0) + 1 }));
    } finally {
      setPosting(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div style={{ padding: "60px", color: "var(--text-dim)" }}>Loading circuit…</div>
      </AppShell>
    );
  }

  if (error || !project) {
    return (
      <AppShell>
        <div style={{ padding: "60px", textAlign: "center" }}>
          <p style={{ color: "var(--text-dim)", marginBottom: 16 }}>{error}</p>
          <Link to="/share" style={{ color: "var(--primary)" }}>
            ← Back to shared circuits
          </Link>
        </div>
      </AppShell>
    );
  }

  const nodes = project.circuit_json?.nodes || [];
  const edges = project.circuit_json?.edges || [];

  return (
    <AppShell>
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 65px)" }}>
        <div style={styles.toolbar}>
          <div>
            <Link to="/share" style={styles.backLink}>
              ← Shared circuits
            </Link>
            <h1 style={styles.title}>{project.name}</h1>
          </div>
          <button onClick={toggleLike} style={{ ...styles.likeBtn, color: stats?.liked_by_me ? "var(--danger)" : "var(--text-dim)" }}>
            {stats?.liked_by_me ? "♥" : "♡"} {stats?.like_count ?? 0}
          </button>
        </div>

        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Scene3D
              nodes={nodes}
              edges={edges}
              draggingId={null}
              onDragStart={noop}
              onDragMove={noop}
              onDragEnd={noop}
              onTerminalClick={noop}
              onToggle={noop}
              onRemove={noop}
              selectedTerminal={null}
              cameraRef={cameraRef}
              poweredIds={null}
              readings={null}
            />
            <div style={styles.viewBadge}>👁 Read-only — viewing a shared circuit</div>
          </div>

          <div style={styles.sidebar}>
            {project.description && <p style={styles.description}>{project.description}</p>}

            <div className="eyebrow" style={{ margin: "16px 0 10px" }}>
              Comments ({comments.length})
            </div>

            <div style={styles.commentList}>
              {comments.length === 0 && (
                <p style={{ color: "var(--text-faint)", fontSize: 12.5 }}>No comments yet — be the first.</p>
              )}
              {comments.map((c) => (
                <div key={c.id} style={styles.comment}>
                  <span style={styles.commentAuthor}>{c.author_name}</span>
                  <p style={styles.commentBody}>{c.body}</p>
                </div>
              ))}
            </div>

            <form onSubmit={submitComment} style={{ marginTop: 12 }}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment…"
                rows={2}
                style={styles.commentInput}
              />
              <button type="submit" disabled={posting || !commentText.trim()} style={styles.postBtn}>
                {posting ? "Posting…" : "Post comment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

const styles = {
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
    borderBottom: "1px solid var(--border)",
    background: "var(--surface)",
  },
  backLink: { color: "var(--text-faint)", fontSize: 11.5, textDecoration: "none" },
  title: { margin: "4px 0 0", fontSize: 18, fontWeight: 600 },
  likeBtn: {
    background: "transparent",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius-sm)",
    padding: "8px 16px",
    fontSize: 13,
    fontFamily: "var(--font-display)",
    cursor: "pointer",
  },
  viewBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    background: "rgba(16,22,29,0.85)",
    border: "1px solid var(--border-bright)",
    borderRadius: 20,
    padding: "5px 12px",
    fontSize: 11,
    color: "var(--text-dim)",
    backdropFilter: "blur(4px)",
  },
  sidebar: {
    width: 300,
    flexShrink: 0,
    borderLeft: "1px solid var(--border)",
    padding: "20px 18px",
    overflowY: "auto",
  },
  description: { fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6, margin: 0 },
  commentList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    maxHeight: 320,
    overflowY: "auto",
  },
  comment: {
    background: "var(--surface-2)",
    borderRadius: "var(--radius-sm)",
    padding: "8px 10px",
  },
  commentAuthor: { fontSize: 11, fontWeight: 600, color: "var(--primary)" },
  commentBody: { fontSize: 12.5, color: "var(--text)", margin: "3px 0 0", lineHeight: 1.5 },
  commentInput: {
    width: "100%",
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "8px 10px",
    color: "var(--text)",
    fontSize: 12.5,
    outline: "none",
    resize: "vertical",
  },
  postBtn: {
    marginTop: 8,
    background: "var(--primary)",
    color: "#062011",
    border: "none",
    borderRadius: "var(--radius-sm)",
    padding: "7px 16px",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  },
};