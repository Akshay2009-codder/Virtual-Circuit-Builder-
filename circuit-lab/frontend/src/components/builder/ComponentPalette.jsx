import { useMemo, useState } from "react";
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

// A small IoT starter kit - the parts most real sensor/actuator projects
// begin with - pinned at the top so a new student isn't stuck scrolling
// ~70 parts to find them. Only shown when not actively searching/filtering.
const STARTER_KEYS = ["esp32", "pir_motion_sensor", "humidity_sensor", "soil_moisture_sensor", "led", "resistor"];

const CATEGORY_LABEL = {
  passive: "Passive",
  active: "Active",
  ic: "ICs",
  source: "Power",
  control: "Control",
  output: "Output",
  sensor: "Sensors",
  board: "Boards",
  display: "Displays",
};

export default function ComponentPalette({ components, loading }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  function onDragStart(e, component) {
    e.dataTransfer.setData("application/circuitlab-component", JSON.stringify(component));
    e.dataTransfer.effectAllowed = "move";
  }

  const categories = useMemo(() => {
    const counts = {};
    for (const c of components) counts[c.category] = (counts[c.category] || 0) + 1;
    return Object.keys(counts)
      .sort()
      .map((cat) => ({ key: cat, label: CATEGORY_LABEL[cat] || cat, count: counts[cat] }));
  }, [components]);

  const isSearching = query.trim().length > 0;

  const starterParts = useMemo(
    () => (isSearching ? [] : STARTER_KEYS.map((k) => components.find((c) => c.key === k)).filter(Boolean)),
    [components, isSearching]
  );

  const filtered = components.filter((c) => {
    const matchesQuery =
      !query ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCategory === "all" || c.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  function renderCard(c) {
    return (
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
    );
  }

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

      {!isSearching && (
        <div style={styles.categoryRow}>
          <button
            onClick={() => setActiveCategory("all")}
            style={{ ...styles.categoryPill, ...(activeCategory === "all" ? styles.categoryPillActive : {}) }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              style={{
                ...styles.categoryPill,
                ...(activeCategory === cat.key
                  ? { ...styles.categoryPillActive, borderColor: CATEGORY_COLOR[cat.key], color: CATEGORY_COLOR[cat.key] }
                  : {}),
              }}
            >
              {cat.label} <span style={styles.categoryCount}>{cat.count}</span>
            </button>
          ))}
        </div>
      )}

      {loading && <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 12 }}>Loading…</p>}

      {starterParts.length > 0 && (
        <>
          <div className="eyebrow" style={{ margin: "14px 0 8px", fontSize: 10 }}>
            IoT starter kit
          </div>
          <motion.div style={styles.list} variants={listVariants} initial="hidden" animate="show">
            {starterParts.map(renderCard)}
          </motion.div>
        </>
      )}

      {starterParts.length > 0 && (
        <div className="eyebrow" style={{ margin: "16px 0 8px", fontSize: 10 }}>
          {activeCategory === "all" ? "All parts" : CATEGORY_LABEL[activeCategory] || activeCategory}
        </div>
      )}

      <motion.div style={styles.list} variants={listVariants} initial="hidden" animate="show">
        {filtered.map(renderCard)}
        {!loading && filtered.length === 0 && (
          <p style={{ color: "var(--text-faint)", fontSize: 12.5 }}>No parts match "{query}"</p>
        )}
      </motion.div>
    </div>
  );
}

const styles = {
  panel: {
    width: 240,
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
  categoryRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  categoryPill: {
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: 20,
    padding: "4px 10px",
    fontSize: 11,
    color: "var(--text-dim)",
    cursor: "pointer",
    fontFamily: "var(--font-display)",
    whiteSpace: "nowrap",
  },
  categoryPillActive: {
    borderColor: "var(--primary)",
    color: "var(--primary)",
  },
  categoryCount: {
    opacity: 0.6,
    fontSize: 9.5,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginTop: 4,
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