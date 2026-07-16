import { useState } from "react";
import { motion } from "framer-motion";
import PartIcon from "../PartIcon";
import { CATEGORY_COLOR } from "../../constants/categoryColors";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.22, ease: "easeOut" } },
};

export default function ComponentPalette({ components, loading }) {
  const [query, setQuery] = useState("");

  function onDragStart(e, component) {
    e.dataTransfer.setData("application/circuitlab-component", JSON.stringify(component));
    e.dataTransfer.effectAllowed = "move";
  }

  const filtered = components.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={styles.panel}>
      <div className="eyebrow" style={{ marginBottom: 4 }}>
        Palette
      </div>
      <p style={{ color: "var(--text-faint)", fontSize: 12, margin: "0 0 12px" }}>
        Drag a part onto the board
      </p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search parts…"
        style={styles.search}
      />

      {loading && <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 12 }}>Loading…</p>}

      <motion.div style={styles.list} variants={listVariants} initial="hidden" animate="show">
        {filtered.map((c) => (
          // Native HTML5 drag (draggable + onDragStart) lives on this plain
          // wrapper so it doesn't clash with framer-motion's own drag gestures.
          // The hover/press animation lives on the motion.div inside it.
          <div key={c.key} draggable onDragStart={(e) => onDragStart(e, c)}>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.03, borderColor: CATEGORY_COLOR[c.category], x: -2 }}
              whileTap={{ scale: 0.96, cursor: "grabbing" }}
              transition={{ duration: 0.15 }}
              style={styles.item}
            >
              <PartIcon category={c.category} size={30} />
              <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
                <span style={styles.itemName}>{c.name}</span>
                <span style={{ ...styles.itemCategory, color: CATEGORY_COLOR[c.category] }}>{c.category}</span>
              </div>
            </motion.div>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <p style={{ color: "var(--text-faint)", fontSize: 12.5 }}>No parts match "{query}"</p>
        )}
      </motion.div>
    </div>
  );
}

const styles = {
  panel: {
    width: 230,
    flexShrink: 0,
    borderLeft: "1px solid var(--border)",
    padding: "20px 16px",
    height: "100%",
    overflowY: "auto",
  },
  search: {
    width: "100%",
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "7px 10px",
    color: "var(--text)",
    fontSize: 12.5,
    outline: "none",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginTop: 12,
  },
  item: {
    padding: "8px 10px",
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    cursor: "grab",
    display: "flex",
    alignItems: "center",
    gap: 10,
    userSelect: "none",
  },
  itemCategory: {
    fontFamily: "var(--font-display)",
    fontSize: 9,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  itemName: {
    fontSize: 12.5,
    fontWeight: 600,
    color: "var(--text)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};