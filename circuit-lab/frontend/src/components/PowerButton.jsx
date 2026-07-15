import { motion } from "framer-motion";

// status: "idle" | "loading" | "error"
export default function PowerButton({ status = "idle", children, ...props }) {
  const ledColor =
    status === "error" ? "var(--danger)" : status === "loading" ? "var(--teal)" : "var(--border-bright)";

  return (
    <button {...props} disabled={status === "loading"} style={styles.button}>
      <motion.span
        aria-hidden="true"
        style={{ ...styles.led, background: ledColor }}
        animate={
          status === "loading"
            ? { opacity: [0.3, 1, 0.3], boxShadow: ["0 0 0px var(--teal)", "0 0 8px var(--teal)", "0 0 0px var(--teal)"] }
            : status === "error"
            ? { opacity: [1, 0.4, 1] }
            : { opacity: 1, boxShadow: "none" }
        }
        transition={{ duration: status === "loading" ? 1.1 : 0.4, repeat: status === "loading" ? Infinity : 0 }}
      />
      <span>{status === "loading" ? "Connecting…" : children}</span>
    </button>
  );
}

const styles = {
  button: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    background: "var(--copper)",
    color: "#1a1002",
    fontWeight: 600,
    fontSize: 14.5,
    border: "none",
    borderRadius: "var(--radius-sm)",
    padding: "11px 16px",
    cursor: "pointer",
    marginTop: 6,
    transition: "filter 0.15s ease, transform 0.05s ease",
  },
  led: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    flexShrink: 0,
  },
};
