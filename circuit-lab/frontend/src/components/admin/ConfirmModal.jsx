import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  message = "This action is destructive and cannot be undone.",
  confirmText = "Confirm Delete",
  cancelText = "Cancel",
  type = "danger", // "danger" | "warning" | "primary"
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const color = type === "danger" ? "var(--danger)" : type === "warning" ? "var(--gold)" : "var(--primary)";
  const bgBadge = type === "danger" ? "rgba(255, 71, 87, 0.15)" : type === "warning" ? "rgba(255, 201, 77, 0.15)" : "rgba(47, 214, 111, 0.15)";

  return (
    <AnimatePresence>
      <div style={styles.backdrop} onClick={onCancel}>
        <motion.div
          style={styles.modal}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ ...styles.iconBox, background: bgBadge, color: color, borderColor: color }}>
              {type === "danger" ? "⚠️" : type === "warning" ? "⚡" : "ℹ️"}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={styles.title}>{title}</h3>
              <p style={styles.message}>{message}</p>
            </div>
          </div>

          <div style={styles.actions}>
            <button
              onClick={onCancel}
              disabled={loading}
              style={styles.cancelBtn}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              style={{
                ...styles.confirmBtn,
                background: color,
                color: type === "warning" || type === "primary" ? "#061014" : "#ffffff",
              }}
            >
              {loading ? "Processing…" : confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 2000,
    background: "rgba(6, 10, 15, 0.82)",
    backdropFilter: "blur(10px)",
    display: "grid",
    placeItems: "center",
    padding: 20,
  },
  modal: {
    width: "100%",
    maxWidth: 460,
    background: "rgba(16, 22, 29, 0.96)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.75)",
    padding: 24,
    backdropFilter: "blur(16px)",
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    display: "grid",
    placeItems: "center",
    fontSize: 20,
    border: "1px solid",
    flexShrink: 0,
  },
  title: {
    margin: "0 0 6px",
    fontSize: 17,
    fontWeight: 700,
    color: "var(--text)",
  },
  message: {
    margin: 0,
    fontSize: 13.5,
    color: "var(--text-dim)",
    lineHeight: 1.5,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 22,
  },
  cancelBtn: {
    padding: "8px 16px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-dim)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  confirmBtn: {
    padding: "8px 18px",
    border: "none",
    borderRadius: "var(--radius-sm)",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
  },
};
