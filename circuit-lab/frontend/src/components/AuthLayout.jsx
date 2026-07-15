import { motion } from "framer-motion";
import CircuitBackground from "./CircuitBackground";

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div style={styles.page}>
      <CircuitBackground />

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
            Watch them come alive.
          </h1>
          <p style={styles.brandSub}>
            Drag components onto a breadboard, wire them up, and run a real
            simulation to see voltage, current, and where your circuit
            breaks — all in the browser.
          </p>
        </motion.div>
      </div>

      <motion.div
        style={styles.cardWrap}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        <div style={styles.card}>
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
  cardWrap: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 380,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "32px 30px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
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
