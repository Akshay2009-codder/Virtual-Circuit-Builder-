import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import client from "../api/client";

export default function CommentsModal({ project, isOpen, onClose, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && project?.id) {
      if (String(project.id).startsWith("demo-")) {
        // Sample demo comments
        setComments([
          {
            id: 1,
            author_name: "ElectronicsPro",
            body: "Great 3D layout! The Dupont wire connectors look super clean.",
            created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
            is_mine: false,
          },
          {
            id: 2,
            author_name: "MakerKid",
            body: "How do you control the NeoPixel ring brightness?",
            created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
            is_mine: false,
          },
        ]);
        return;
      }
      setLoading(true);
      setError(null);
      client
        .get(`/community/projects/${project.id}/comments`)
        .then((res) => {
          setComments(res.data.comments || []);
        })
        .catch(() => setError("Failed to load comments."))
        .finally(() => setLoading(false));
    }
  }, [isOpen, project]);

  async function handleAddComment(e) {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (String(project.id).startsWith("demo-")) {
      const added = {
        id: Date.now(),
        author_name: "You",
        body: newComment.trim(),
        created_at: new Date().toISOString(),
        is_mine: true,
      };
      setComments((c) => [...c, added]);
      setNewComment("");
      if (onCommentAdded) onCommentAdded(project.id);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await client.post(`/community/projects/${project.id}/comments`, {
        body: newComment.trim(),
      });
      setComments((c) => [...c, res.data.comment]);
      setNewComment("");
      if (onCommentAdded) onCommentAdded(project.id);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteComment(commentId) {
    if (String(project.id).startsWith("demo-")) {
      setComments((c) => c.filter((x) => x.id !== commentId));
      return;
    }
    try {
      await client.delete(`/community/comments/${commentId}`);
      setComments((c) => c.filter((x) => x.id !== commentId));
    } catch (err) {
      setError("Failed to delete comment.");
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={styles.backdrop} onClick={onClose}>
          <motion.div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <div style={styles.header}>
              <div>
                <h3 style={styles.title}>Comments ({comments.length})</h3>
                <span style={styles.subtitle}>{project?.name}</span>
              </div>
              <button style={styles.closeBtn} onClick={onClose}>
                ×
              </button>
            </div>

            <div style={styles.body}>
              {loading && <p style={styles.info}>Loading comments…</p>}
              {error && <p style={styles.errorText}>{error}</p>}

              {!loading && comments.length === 0 && (
                <div style={styles.empty}>
                  No comments yet. Be the first to share your thoughts on this 3D circuit!
                </div>
              )}

              {!loading && comments.length > 0 && (
                <div style={styles.commentsList}>
                  {comments.map((c) => (
                    <div key={c.id} style={styles.commentCard}>
                      <div style={styles.commentMeta}>
                        <span style={styles.commentAuthor}>{c.author_name}</span>
                        <span style={styles.commentTime}>
                          {new Date(c.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p style={styles.commentText}>{c.body}</p>
                      {c.is_mine && (
                        <button style={styles.deleteBtn} onClick={() => handleDeleteComment(c.id)}>
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleAddComment} style={styles.footer}>
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment on this circuit…"
                style={styles.input}
                maxLength={500}
                disabled={submitting}
              />
              <button type="submit" style={styles.sendBtn} disabled={submitting || !newComment.trim()}>
                {submitting ? "Posting…" : "Post"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    background: "rgba(6, 10, 14, 0.75)",
    backdropFilter: "blur(6px)",
    display: "grid",
    placeItems: "center",
    padding: 20,
  },
  modal: {
    width: "100%",
    maxWidth: 520,
    maxHeight: "85vh",
    background: "var(--surface)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    padding: "16px 20px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { margin: 0, fontSize: 16, fontWeight: 700, color: "var(--text)" },
  subtitle: { fontSize: 12, color: "var(--text-dim)" },
  closeBtn: {
    background: "transparent",
    border: "none",
    fontSize: 22,
    color: "var(--text-dim)",
    cursor: "pointer",
    lineHeight: 1,
  },
  body: {
    padding: 20,
    overflowY: "auto",
    flex: 1,
  },
  info: { color: "var(--text-dim)", fontSize: 13, textAlign: "center", margin: 20 },
  errorText: { color: "var(--danger)", fontSize: 13, margin: "0 0 10px" },
  empty: {
    padding: "30px 10px",
    textAlign: "center",
    color: "var(--text-faint)",
    fontSize: 13,
  },
  commentsList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  commentCard: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "10px 14px",
    position: "relative",
  },
  commentMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  commentAuthor: { fontSize: 13, fontWeight: 600, color: "var(--primary)" },
  commentTime: { fontSize: 11, color: "var(--text-faint)" },
  commentText: { margin: 0, fontSize: 13, color: "var(--text)", lineHeight: 1.45 },
  deleteBtn: {
    marginTop: 6,
    background: "transparent",
    border: "none",
    color: "var(--danger)",
    fontSize: 11,
    cursor: "pointer",
    padding: 0,
  },
  footer: {
    padding: "12px 16px",
    borderTop: "1px solid var(--border)",
    display: "flex",
    gap: 10,
    background: "rgba(10, 14, 19, 0.5)",
  },
  input: {
    flex: 1,
    background: "var(--surface-bright, #161f28)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "8px 12px",
    color: "var(--text)",
    fontSize: 13,
    outline: "none",
  },
  sendBtn: {
    background: "var(--primary)",
    color: "#0a0e13",
    border: "none",
    borderRadius: "var(--radius-sm)",
    padding: "8px 16px",
    fontWeight: 700,
    fontSize: 12.5,
    cursor: "pointer",
  },
};
