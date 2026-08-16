import { motion } from "framer-motion";
import CircuitBackground from "./CircuitBackground";

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div style={styles.page}>
      <CircuitBackground />

      {/* Floating color ambient glow */}
      <motion.div
        style={{ ...styles.blob, width: 380, height: 380, top: "-5%", left: "5%", background: "#2fd66f" }}
        animate={{ x: [0, 25, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{ ...styles.blob, width: 340, height: 340, bottom: "-5%", left: "30%", background: "#45d8c4" }}
        animate={{ x: [0, -20, 0], y: [0, -15, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <div style={styles.brandPanel}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            ⚡ CIRCUITLAB PRO 3D
          </div>
          <h1 style={styles.brandTitle}>
            Design circuits.
            <br />
            <span className="gradient-text">Simulate in real-time 3D.</span>
          </h1>
          <p style={styles.brandSub}>
            Build, test, and wire microcontrollers, sensors, and analog components on an interactive 3D workbench with instant circuit solver feedback.
          </p>
          <div style={styles.badgeRow}>
            <span style={styles.badge}>⚡ Real-time Solvers</span>
            <span style={styles.badge}>🌐 3D Interactive Workbench</span>
            <span style={styles.badge}>🧩 ESP32 & Arduino Ready</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        style={styles.cardWrap}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
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
    opacity: 0.12,
    zIndex: 0,
    pointerEvents: "none",
  },
  brandPanel: {
    position: "relative",
    zIndex: 1,
    maxWidth: 480,
  },
  brandTitle: {
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    fontSize: "clamp(30px, 3.6vw, 44px)",
    lineHeight: 1.15,
    margin: "0 0 16px",
    color: "var(--text)",
  },
  brandSub: {
    color: "var(--text-dim)",
    fontSize: 15,
    lineHeight: 1.6,
    maxWidth: 440,
  },
  badgeRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 24,
  },
  badge: {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    fontWeight: 600,
    padding: "6px 12px",
    borderRadius: 20,
    border: "1px solid var(--border-bright)",
    background: "rgba(255, 255, 255, 0.03)",
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
    maxWidth: 400,
    background: "rgba(16, 22, 29, 0.85)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius)",
    padding: "36px 32px",
    boxShadow: "0 24px 64px rgba(0,0,0,0.55)",
    backdropFilter: "blur(16px)",
    overflow: "hidden",
  },
  cardGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: "linear-gradient(90deg, #2fd66f, #45d8c4)",
  },
  cardTitle: {
    margin: "4px 0 6px",
    fontSize: 22,
    fontWeight: 800,
    color: "var(--text)",
  },
  cardSub: {
    color: "var(--text-dim)",
    fontSize: 13.5,
    margin: "0 0 22px",
  },
};