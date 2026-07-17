import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewCircuitModal({ open, onClose, onCreate, creating }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onCreate({ name: name.trim() || "Untitled Circuit", description: description.trim() });
  }

  function handleClose() {
    setName("");
    setDescription("");
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          style={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.form
            onSubmit={handleSubmit}
            style={styles.card}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.cardGlow} />
            <div className="eyebrow" style={{ marginBottom: 6 }}>
              New circuit
            </div>
            <h2 style={{ margin: "4px 0 20px", fontSize: 20 }}>What are you building?</h2>

            <label style={styles.label}>
              Name
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. ESP32 Temperature Monitor"
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              Description <span style={{ color: "var(--text-faint)", fontWeight: 400 }}>(optional)</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this circuit do?"
                rows={3}
                style={{ ...styles.input, resize: "vertical" }}
              />
            </label>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
              <button type="button" onClick={handleClose} style={styles.cancelBtn}>
                Cancel
              </button>
              <button type="submit" style={styles.createBtn} disabled={creating}>
                {creating ? "Creating…" : "Create & open builder"}
              </button>
            </div>
          </motion.form>
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
    maxWidth: 420,
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
  label: {
    display: "block",
    fontSize: 12.5,
    color: "var(--text-dim)",
    marginBottom: 16,
    fontWeight: 600,
  },
  input: {
    display: "block",
    width: "100%",
    marginTop: 6,
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "9px 12px",
    color: "var(--text)",
    fontSize: 13.5,
    fontFamily: "var(--font-body)",
    fontWeight: 400,
    outline: "none",
  },
  cancelBtn: {
    background: "transparent",
    border: "1px solid var(--border-bright)",
    color: "var(--text-dim)",
    borderRadius: "var(--radius-sm)",
    padding: "9px 16px",
    fontSize: 13,
    cursor: "pointer",
  },
  createBtn: {
    background: "var(--primary)",
    color: "#062011",
    border: "none",
    borderRadius: "var(--radius-sm)",
    padding: "9px 18px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
};