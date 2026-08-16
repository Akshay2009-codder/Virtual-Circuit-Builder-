import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "../components/AppShell";
import PartViewer from "../components/3d/PartViewer";
import PartIcon from "../components/PartIcon";
import { CATEGORY_COLOR } from "../constants/categoryColors";
import client from "../api/client";

const CATEGORIES = [
  { id: "all", label: "All Components", icon: "⚡" },
  { id: "board", label: "Microcontrollers & Boards", icon: "📡" },
  { id: "passive", label: "Passives (R, C, L)", icon: "🔄" },
  { id: "sensor", label: "Sensors & Radar", icon: "🎯" },
  { id: "output", label: "Opto, LEDs & Displays", icon: "💡" },
  { id: "power", label: "Power & Batteries", icon: "🔋" },
  { id: "control", label: "Switches & Controls", icon: "🎛️" },
];

export default function Components() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    client
      .get("/components")
      .then((res) => {
        const comps = res.data.components || [];
        setItems(comps);
        if (comps.length) setSelectedKey(comps[0].key);
      })
      .catch(() => setError("Couldn't load component catalog. Is backend running?"))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((c) => {
      if (activeCategory !== "all" && c.category !== activeCategory) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.key.toLowerCase().includes(q) ||
          (c.description || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, activeCategory, query]);

  const selected = items.find((c) => c.key === selectedKey) || filteredItems[0];

  function launchWithComponent(comp) {
    if (!comp) return;
    navigate("/builder", {
      state: {
        fromComponentCatalog: true,
        initialComponent: {
          key: comp.key,
          name: comp.name,
          category: comp.category,
          unit: comp.unit,
          default_value: comp.default_value,
          modelType: comp.model_type || comp.key,
        },
      },
    });
  }

  return (
    <AppShell>
      <div style={styles.page}>
        {/* HEADER SECTION */}
        <section style={styles.headerSection}>
          <div>
            <div className="eyebrow">🧩 HARDWARE REPOSITORY</div>
            <h1 style={styles.headerTitle}>
              Interactive <span className="gradient-text">Component Catalog</span>
            </h1>
            <p style={styles.headerSub}>
              Browse real electronic parts with live 3D models, electrical ratings, and pinout diagrams.
            </p>
          </div>

          {/* Search Input */}
          <div style={styles.searchContainer}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search components by name, key, or category…"
              style={styles.searchInput}
            />
            {query && (
              <button onClick={() => setQuery("")} style={styles.clearBtn}>
                ✕
              </button>
            )}
          </div>
        </section>

        {/* CATEGORY FILTER TABS */}
        <div style={styles.categoryBar}>
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  ...styles.catBtn,
                  background: active ? "rgba(47, 214, 111, 0.15)" : "rgba(255, 255, 255, 0.03)",
                  color: active ? "#2fd66f" : "var(--text-dim)",
                  borderColor: active ? "rgba(47, 214, 111, 0.4)" : "var(--border)",
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {error && <p style={{ color: "var(--danger)", padding: 20 }}>⚠️ {error}</p>}
        {loading && <p style={{ color: "var(--text-dim)", padding: 20 }}>Loading component catalog…</p>}

        {/* SPLIT SCREEN WORKBENCH */}
        {!loading && !error && (
          <div style={styles.layout}>
            {/* LEFT: COMPONENT GRID */}
            <div style={styles.gridContainer}>
              {filteredItems.length === 0 ? (
                <div style={styles.emptyCard}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                  <h4 style={{ margin: "0 0 4px", color: "var(--text)" }}>No matching parts</h4>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--text-dim)" }}>
                    Try searching for different keywords or select "All Components".
                  </p>
                </div>
              ) : (
                <div style={styles.grid}>
                  {filteredItems.map((c) => {
                    const isSelected = c.key === selected?.key;
                    const catColor = CATEGORY_COLOR[c.category] || "var(--primary)";

                    return (
                      <button
                        key={c.key}
                        onClick={() => setSelectedKey(c.key)}
                        style={{
                          ...styles.card,
                          borderColor: isSelected ? catColor : "var(--border)",
                          background: isSelected ? "rgba(22, 30, 40, 0.95)" : "rgba(16, 22, 29, 0.75)",
                          boxShadow: isSelected ? `0 0 16px ${catColor}33` : "0 4px 12px rgba(0,0,0,0.3)",
                        }}
                      >
                        <div style={styles.iconWrapper}>
                          <PartIcon category={c.category} size={42} />
                        </div>
                        <span style={styles.cardName}>{c.name}</span>
                        <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: "auto" }}>
                          <span style={{ ...styles.categoryChip, color: catColor, borderColor: `${catColor}44` }}>
                            {c.category}
                          </span>
                          {c.unit && (
                            <span style={styles.cardValue}>
                              {c.default_value} {c.unit}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT: LIVE 3D VIEWER & DETAILED SPECS */}
            <div style={styles.detailPanel}>
              {selected && (
                <>
                  {/* 3D Model Viewer Canvas */}
                  <div style={styles.viewer}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selected.key}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ width: "100%", height: "100%" }}
                      >
                        <PartViewer modelType={selected.model_type} partKey={selected.key} name={selected.name} />
                      </motion.div>
                    </AnimatePresence>

                    {/* Orbit instruction badge */}
                    <div style={styles.orbitBadge}>
                      <span>🖱️ Drag to Orbit 3D</span>
                    </div>

                    <span
                      style={{
                        ...styles.viewerChip,
                        color: CATEGORY_COLOR[selected.category] || "var(--primary)",
                        borderColor: `${CATEGORY_COLOR[selected.category] || "var(--primary)"}44`,
                      }}
                    >
                      ● {selected.category.toUpperCase()}
                    </span>
                  </div>

                  {/* Specification Card */}
                  <div style={styles.specCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div>
                        <div style={styles.breadcrumb}>
                          CATALOG <span style={{ margin: "0 4px" }}>/</span> {selected.category}
                        </div>
                        <h2 style={styles.specTitle}>{selected.name}</h2>
                      </div>
                      <button onClick={() => launchWithComponent(selected)} style={styles.addToBuilderBtn}>
                        <span>Add to Builder ➔</span>
                      </button>
                    </div>

                    <p style={styles.specDesc}>{selected.description}</p>

                    {selected.unit && (
                      <div style={styles.ratingRow}>
                        <div>
                          <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase" }}>Default Rating</div>
                          <span style={styles.ratingValue}>
                            {selected.default_value} {selected.unit}
                          </span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase" }}>Terminal Count</div>
                          <span style={styles.ratingValue}>{selected.terminal_count || 2} Pins</span>
                        </div>
                      </div>
                    )}

                    {/* Spec Key-Value Table */}
                    <div style={styles.specTable}>
                      <div className="eyebrow" style={{ marginBottom: 8 }}>ELECTRICAL SPECIFICATIONS</div>
                      <div style={styles.tableBox}>
                        <div style={styles.specRow}>
                          <span style={styles.specLabel}>Part Key Identifier</span>
                          <span style={styles.specVal}>{selected.key}</span>
                        </div>
                        <div style={{ ...styles.specRow, background: "rgba(255, 255, 255, 0.02)" }}>
                          <span style={styles.specLabel}>Simulation Model</span>
                          <span style={styles.specVal}>{selected.model_type || "Generic"}</span>
                        </div>
                        {Object.entries(selected.spec || {}).map(([k, v], i) => (
                          <div
                            key={k}
                            style={{
                              ...styles.specRow,
                              background: i % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.02)",
                            }}
                          >
                            <span style={styles.specLabel}>{k.replace(/_/g, " ")}</span>
                            <span style={styles.specVal}>{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

const styles = {
  page: {
    padding: "32px 5vw 80px",
    maxWidth: 1400,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  headerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 20,
    flexWrap: "wrap",
  },
  headerTitle: {
    margin: "6px 0 4px",
    fontSize: "clamp(24px, 3.2vw, 36px)",
    fontWeight: 800,
    color: "var(--text)",
  },
  headerSub: {
    margin: 0,
    fontSize: 14,
    color: "var(--text-dim)",
  },
  searchContainer: {
    position: "relative",
    width: 320,
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 13,
    opacity: 0.5,
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "10px 32px 10px 36px",
    background: "rgba(16, 22, 29, 0.85)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    fontSize: 13,
    outline: "none",
  },
  clearBtn: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "var(--text-dim)",
    cursor: "pointer",
    fontSize: 12,
  },
  categoryBar: {
    display: "flex",
    gap: 8,
    overflowX: "auto",
    paddingBottom: 4,
  },
  catBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 14px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border)",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.15s ease",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 480px",
    gap: 28,
    alignItems: "start",
  },
  gridContainer: {
    minHeight: 400,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: 14,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 8,
    padding: "18px 14px 14px",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    cursor: "pointer",
    transition: "transform 0.15s ease, border-color 0.15s ease, background 0.15s ease",
  },
  iconWrapper: {
    width: 52,
    height: 52,
    display: "grid",
    placeItems: "center",
  },
  cardName: {
    fontSize: 13.5,
    fontWeight: 700,
    color: "var(--text)",
    lineHeight: 1.25,
  },
  categoryChip: {
    fontFamily: "var(--font-mono)",
    fontSize: 9.5,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    padding: "2px 6px",
    borderRadius: 6,
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid",
  },
  cardValue: {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    color: "var(--text-dim)",
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
    height: 340,
    borderRadius: "var(--radius)",
    overflow: "hidden",
    border: "1px solid var(--border-bright)",
    background: "#080c10",
    boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
  },
  viewerChip: {
    position: "absolute",
    top: 14,
    left: 14,
    fontFamily: "var(--font-mono)",
    fontSize: 10.5,
    fontWeight: 800,
    letterSpacing: "0.06em",
    padding: "4px 10px",
    borderRadius: 20,
    background: "rgba(10, 14, 19, 0.9)",
    border: "1px solid",
    backdropFilter: "blur(6px)",
  },
  orbitBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    padding: "3px 8px",
    background: "rgba(0,0,0,0.6)",
    borderRadius: 6,
    fontSize: 11,
    color: "var(--text-dim)",
  },
  specCard: {
    background: "rgba(16, 22, 29, 0.8)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "22px 24px",
    backdropFilter: "blur(12px)",
  },
  breadcrumb: {
    fontFamily: "var(--font-mono)",
    fontSize: 10.5,
    color: "var(--text-faint)",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  specTitle: {
    margin: "4px 0 8px",
    fontSize: 20,
    fontWeight: 800,
    color: "var(--text)",
  },
  specDesc: {
    color: "var(--text-dim)",
    fontSize: 13.5,
    lineHeight: 1.6,
    margin: "0 0 16px",
  },
  addToBuilderBtn: {
    padding: "8px 14px",
    background: "rgba(47, 214, 111, 0.15)",
    border: "1px solid rgba(47, 214, 111, 0.4)",
    borderRadius: "var(--radius-sm)",
    color: "#2fd66f",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  ratingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 14px",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    marginBottom: 16,
  },
  ratingValue: {
    fontFamily: "var(--font-mono)",
    fontSize: 16,
    fontWeight: 700,
    color: "var(--text)",
  },
  specTable: {
    display: "flex",
    flexDirection: "column",
  },
  tableBox: {
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    overflow: "hidden",
  },
  specRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "9px 12px",
    fontSize: 12.5,
  },
  specLabel: {
    color: "var(--text-dim)",
    textTransform: "capitalize",
  },
  specVal: {
    fontFamily: "var(--font-mono)",
    fontWeight: 600,
    color: "var(--text)",
  },
  emptyCard: {
    padding: "40px 20px",
    textAlign: "center",
    background: "rgba(16, 22, 29, 0.6)",
    border: "1px dashed var(--border)",
    borderRadius: "var(--radius)",
  },
};