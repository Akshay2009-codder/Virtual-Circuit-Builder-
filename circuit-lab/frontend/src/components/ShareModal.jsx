import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import client from "../api/client";

export default function ShareModal({ open, onClose, projectId }) {
  const [collaborators, setCollaborators] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!open || !projectId) return;
    setLoading(true);
    client
      .get(`/projects/${projectId}/collaborators`)
      .then((res) => setCollaborators(res.data.collaborators))
      .finally(() => setLoading(false));
  }, [open, projectId]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await client.post(`/projects/${projectId}/collaborators`, { email: email.trim() });
      setCollaborators((c) => [...c, res.data.collaborator]);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't add that person.");
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(collabId) {
    await client.delete(`/projects/${projectId}/collaborators/${collabId}`);
    setCollaborators((c) => c.filter((x) => x.id !== collabId));
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div style={styles.backdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            style={styles.card}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.cardGlow} />
            <div className="eyebrow" style={{ marginBottom: 6 }}>
              Team access
            </div>
            <h2 style={{ margin: "4px 0 6px", fontSize: 20 }}>Share this circuit</h2>
            <p style={{ color: "var(--text-dim)", fontSize: 12.5, margin: "0 0 18px" }}>
              Anyone you add can open, edit, and save this exact circuit from their own account -
              handy for group projects. It's shared access, not live simultaneous editing, so if
              you're both working at once, whoever saves last wins.
            </p>

            <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teammate@email.com"
                style={styles.input}
              />
              <button type="submit" disabled={adding} style={styles.addBtn}>
                {adding ? "Adding…" : "Add"}
              </button>
            </form>
            {error && <p style={{ color: "var(--danger)", fontSize: 12.5, margin: "-10px 0 14px" }}>{error}</p>}

            <div className="eyebrow" style={{ marginBottom: 8 }}>
              Has access
            </div>
            {loading && <p style={{ color: "var(--text-dim)", fontSize: 13 }}>Loading…</p>}
            {!loading && collaborators.length === 0 && (
              <p style={{ color: "var(--text-faint)", fontSize: 12.5 }}>Only you, for now.</p>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {collaborators.map((c) => (
                <div key={c.id} style={styles.collabRow}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-faint)" }}>{c.email}</div>
                  </div>
                  <button onClick={() => handleRemove(c.id)} style={styles.removeBtn}>
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
              <button onClick={onClose} style={styles.doneBtn}>
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(5, 7, 10, 0.7)",
    backdropFilter: "blur(3px)",
    display: "grid",
    placeItems: "center",
    zIndex: 100,
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: 440,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "28px 26px",
    boxShadow: "0 24px 70px rgba(0,0,0,0.5)",
    overflow: "hidden",
    margin: "0 20px",
  },
  cardGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: "linear-gradient(90deg, var(--primary), var(--accent))",
  },
  input: {
    flex: 1,
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "9px 12px",
    color: "var(--text)",
    fontSize: 13,
    outline: "none",
  },
  addBtn: {
    background: "var(--primary)",
    color: "#062011",
    border: "none",
    borderRadius: "var(--radius-sm)",
    padding: "9px 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  collabRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "8px 12px",
  },
  removeBtn: {
    background: "transparent",
    border: "1px solid var(--border-bright)",
    color: "var(--text-faint)",
    borderRadius: "var(--radius-sm)",
    padding: "5px 10px",
    fontSize: 11.5,
    cursor: "pointer",
  },
  doneBtn: {
    background: "transparent",
    border: "1px solid var(--border-bright)",
    color: "var(--text-dim)",
    borderRadius: "var(--radius-sm)",
    padding: "8px 18px",
    fontSize: 13,
    cursor: "pointer",
  },
};