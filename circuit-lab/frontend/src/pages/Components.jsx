import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "../components/AppShell";
import PartViewer from "../components/3d/PartViewer";
import client from "../api/client";

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function Components() {
  const [items, setItems] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    client
      .get("/components")
      .then((res) => {
        setItems(res.data.components);
        if (res.data.components.length) setSelectedKey(res.data.components[0].key);
      })
      .catch(() => setError("Couldn't load the component catalog. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  const selected = items.find((c) => c.key === selectedKey);

  return (
    <AppShell>
      <div style={{ padding: "36px 6vw" }}>
        <div className="eyebrow">Catalog</div>
        <h1 style={{ margin: "6px 0 28px", fontSize: 26, fontFamily: "var(--font-body)" }}>
          Components
        </h1>

        {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
        {loading && <p style={{ color: "var(--text-dim)" }}>Loading catalog…</p>}

        {!loading && !error && (
          <div style={styles.layout}>
            <motion.div style={styles.grid} variants={gridVariants} initial="hidden" animate="show">
              {items.map((c) => (
                <motion.button
                  key={c.key}
                  onClick={() => setSelectedKey(c.key)}
                  variants={cardVariants}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    ...styles.card,
                    borderColor: c.key === selectedKey ? "var(--copper)" : "var(--border)",
                    background: c.key === selectedKey ? "var(--surface-2)" : "var(--surface)",
                  }}
                >
                  <span style={styles.cardCategory}>{c.category}</span>
                  <span style={styles.cardName}>{c.name}</span>
                  {c.unit && (
                    <span style={styles.cardValue}>
                      {c.default_value} {c.unit}
                    </span>
                  )}
                </motion.button>
              ))}
            </motion.div>

            <div style={styles.detailPanel}>
              <div style={styles.viewer}>
                <AnimatePresence mode="wait">
                  {selected && (
                    <motion.div
                      key={selected.key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <PartViewer modelType={selected.model_type} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {selected && (
                <div style={styles.specCard}>
                  <div className="eyebrow">{selected.category}</div>
                  <h2 style={{ margin: "6px 0 10px", fontSize: 20 }}>{selected.name}</h2>
                  <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.6, margin: "0 0 16px" }}>
                    {selected.description}
                  </p>

                  <div style={styles.specGrid}>
                    {selected.unit && (
                      <Spec label="Default value" value={`${selected.default_value} ${selected.unit}`} />
                    )}
                    <Spec label="Terminals" value={selected.terminal_count} />
                    {Object.entries(selected.spec || {}).map(([k, v]) => (
                      <Spec key={k} label={k.replace(/_/g, " ")} value={v} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Spec({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ color: "var(--text-faint)", fontSize: 12.5, textTransform: "capitalize" }}>{label}</span>
      <span className="mono" style={{ color: "var(--teal)", fontSize: 12.5 }}>{value}</span>
    </div>
  );
}

const styles = {
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 420px",
    gap: 28,
    alignItems: "start",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: 12,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
    padding: "14px 14px",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    textAlign: "left",
    transition: "border-color 0.15s ease, background 0.15s ease",
  },
  cardCategory: {
    fontFamily: "var(--font-display)",
    fontSize: 10.5,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--text-faint)",
  },
  cardName: {
    fontSize: 15,
    fontWeight: 600,
    color: "var(--text)",
  },
  cardValue: {
    fontFamily: "var(--font-display)",
    fontSize: 12,
    color: "var(--copper)",
  },
  detailPanel: {
    position: "sticky",
    top: 90,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  viewer: {
    height: 300,
    borderRadius: "var(--radius)",
    overflow: "hidden",
    border: "1px solid var(--border)",
  },
  specCard: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "20px 22px",
  },
  specGrid: {
    display: "flex",
    flexDirection: "column",
  },
};