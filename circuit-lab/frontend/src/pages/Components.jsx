import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "../components/AppShell";
import PartViewer from "../components/3d/PartViewer";
import PartIcon from "../components/PartIcon";
import { CATEGORY_COLOR } from "../constants/categoryColors";
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
                  whileHover={{ y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    ...styles.card,
                    borderColor: c.key === selectedKey ? CATEGORY_COLOR[c.category] : "var(--border)",
                    background: c.key === selectedKey ? "var(--surface-2)" : "var(--surface)",
                  }}
                >
                  <PartIcon category={c.category} size={44} />
                  <span style={styles.cardName}>{c.name}</span>
                  <span style={{ ...styles.categoryChip, color: CATEGORY_COLOR[c.category] }}>
                    {c.category}
                  </span>
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
                {selected && (
                  <span style={{ ...styles.viewerChip, color: CATEGORY_COLOR[selected.category] }}>
                    {selected.category}
                  </span>
                )}
              </div>

              {selected && (
                <div style={styles.specCard}>
                  <div style={styles.breadcrumb}>
                    Catalog <span style={{ margin: "0 5px" }}>/</span>
                    <span style={{ color: CATEGORY_COLOR[selected.category], textTransform: "capitalize" }}>
                      {selected.category}
                    </span>
                  </div>
                  <h2 style={{ margin: "6px 0 10px", fontSize: 21 }}>{selected.name}</h2>
                  <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.65, margin: "0 0 18px" }}>
                    {selected.description}
                  </p>

                  {selected.unit && (
                    <div style={styles.priceRow}>
                      <span className="mono" style={{ fontSize: 22, color: "var(--primary)", fontWeight: 600 }}>
                        {selected.default_value} {selected.unit}
                      </span>
                      <span style={{ color: "var(--text-faint)", fontSize: 12 }}>typical / default value</span>
                    </div>
                  )}

                  <div className="eyebrow" style={{ margin: "18px 0 8px" }}>
                    Specifications
                  </div>
                  <div style={styles.specTable}>
                    <Spec label="Terminals" value={selected.terminal_count} idx={0} />
                    {Object.entries(selected.spec || {}).map(([k, v], i) => (
                      <Spec key={k} label={k.replace(/_/g, " ")} value={v} idx={i + 1} />
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

function Spec({ label, value, idx }) {
  return (
    <div style={{ ...styles.specRow, background: idx % 2 === 0 ? "var(--surface-2)" : "transparent" }}>
      <span style={{ color: "var(--text-faint)", fontSize: 12.5, textTransform: "capitalize" }}>{label}</span>
      <span className="mono" style={{ color: "var(--text)", fontSize: 12.5 }}>{value}</span>
    </div>
  );
}

const styles = {
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 460px",
    gap: 28,
    alignItems: "start",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(128px, 1fr))",
    gap: 12,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 6,
    padding: "18px 12px 16px",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    cursor: "pointer",
    transition: "border-color 0.15s ease, background 0.15s ease",
  },
  cardName: {
    fontSize: 13.5,
    fontWeight: 600,
    color: "var(--text)",
    lineHeight: 1.3,
  },
  categoryChip: {
    fontFamily: "var(--font-display)",
    fontSize: 9.5,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    padding: "2px 8px",
    borderRadius: 20,
    background: "var(--surface-2)",
  },
  cardValue: {
    fontFamily: "var(--font-display)",
    fontSize: 11.5,
    color: "var(--text-dim)",
    marginTop: 2,
  },
  detailPanel: {
    position: "sticky",
    top: 90,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  viewer: {
    position: "relative",
    height: 400,
    borderRadius: "var(--radius)",
    overflow: "hidden",
    border: "1px solid var(--border)",
  },
  viewerChip: {
    position: "absolute",
    top: 14,
    left: 14,
    fontFamily: "var(--font-display)",
    fontSize: 10.5,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "4px 10px",
    borderRadius: 20,
    background: "rgba(10,14,19,0.7)",
    backdropFilter: "blur(4px)",
  },
  specCard: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "22px 24px",
  },
  breadcrumb: {
    fontFamily: "var(--font-display)",
    fontSize: 11,
    color: "var(--text-faint)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: 10,
    padding: "12px 0",
    borderTop: "1px solid var(--border)",
  },
  specTable: {
    display: "flex",
    flexDirection: "column",
    borderRadius: "var(--radius-sm)",
    overflow: "hidden",
  },
  specRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "9px 10px",
  },
};