import { motion } from "framer-motion";
import CircuitBackground from "./CircuitBackground";

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div style={styles.page}>
      <CircuitBackground />

      {/* soft floating color blobs - green + coral, drifting slowly for depth */}
      <motion.div
        style={{ ...styles.blob, width: 340, height: 340, top: "-8%", left: "2%", background: "var(--primary)" }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{ ...styles.blob, width: 300, height: 300, bottom: "-10%", left: "28%", background: "var(--accent)" }}
        animate={{ x: [0, -25, 0], y: [0, -15, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <div style={styles.brandPanel}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            ● CIRCUITLAB
          </div>
          <h1 style={styles.brandTitle}>
            Build circuits.
            <br />
            <span className="gradient-text">Watch them come alive.</span>
          </h1>
          <p style={styles.brandSub}>
            Drag components onto a breadboard, wire them up, and run a real
            simulation to see voltage, current, and where your circuit
            breaks — all in the browser.
          </p>
          <div style={styles.badgeRow}>
            <span style={styles.badge}>28 components</span>
            <span style={styles.badge}>Live 3D catalog</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        style={styles.cardWrap}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        <div style={styles.card}>
          <div style={styles.cardGlow} />
          <div className="eyebrow" style={{ marginBottom: 6 }}>
            {eyebrow}
          </div>
          <h2 style={styles.cardTitle}>{title}</h2>
          {subtitle && <p style={styles.cardSub}>{subtitle}</p>}
          {children}
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "1.1fr 1fr",
    alignItems: "center",
    padding: "0 6vw",
    gap: 40,
    overflow: "hidden",
  },
  blob: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(90px)",
    opacity: 0.16,
    zIndex: 0,
    pointerEvents: "none",
  },
  brandPanel: {
    position: "relative",
    zIndex: 1,
    maxWidth: 460,
  },
  brandTitle: {
    fontFamily: "var(--font-body)",
    fontWeight: 700,
    fontSize: "clamp(28px, 3.4vw, 42px)",
    lineHeight: 1.15,
    margin: "0 0 18px",
    color: "var(--text)",
  },
  brandSub: {
    color: "var(--text-dim)",
    fontSize: 15,
    lineHeight: 1.6,
    maxWidth: 420,
  },
  badgeRow: {
    display: "flex",
    gap: 8,
    marginTop: 20,
  },
  badge: {
    fontFamily: "var(--font-display)",
    fontSize: 11,
    letterSpacing: "0.04em",
    padding: "5px 12px",
    borderRadius: 20,
    border: "1px solid var(--border-bright)",
    color: "var(--text-dim)",
  },
  cardWrap: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: 380,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "32px 30px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
    overflow: "hidden",
  },
  cardGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: "linear-gradient(90deg, var(--primary), var(--accent))",
  },
  cardTitle: {
    margin: "4px 0 6px",
    fontSize: 22,
  },
  cardSub: {
    color: "var(--text-dim)",
    fontSize: 13.5,
    margin: "0 0 22px",
  },
};