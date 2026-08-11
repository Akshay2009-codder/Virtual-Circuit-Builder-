import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppShell from "../components/AppShell";
import client from "../api/client";

const STATUS_LABEL = {
  complete: "Working",
  open: "Open circuit",
  short: "Short circuit",
  no_source: "No power",
};
const STATUS_COLOR = {
  complete: "var(--primary)",
  open: "var(--gold)",
  short: "var(--danger)",
  no_source: "var(--text-faint)",
};

const gridVariants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const cardVariants = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

// Demo circuit shown alongside real community submissions. Uses a
// "demo-" id so toggleLike updates it locally instead of hitting the
// API — there's no backend row for it. circuit_json below is a real,
// wired circuit (not just a name/description): a 9V battery through a
// switch drives two LEDs in series, each with its own current-limiting
// resistor — a genuine, buildable dual-LED emergency torch circuit.
const DEMO_PROJECTS = [
  {
    id: "demo-esp32-neopixel",
    name: "ESP32 + NeoPixel RGB LED Ring",
    description: "An ESP32 microcontroller board connected in 3D to a 12-LED NeoPixel RGB ring. GPIO2 drives the DIN signal pin (green wire), VIN supplies 5V power (red wire), and GND completes the circuit (black wire).",
    owner_name: "Akshay_Dev",
    last_run_status: "complete",
    liked_by_me: false,
    like_count: 245,
    comment_count: 31,
    component_count: 2,
    circuit_json: {
      nodes: [
        {
          id: "esp1",
          key: "esp32",
          name: "ESP32 Dev Board",
          category: "board",
          unit: "V",
          default_value: 3.3,
          modelType: "esp32",
          x: -1.4,
          z: 0,
          pins: [
            { terminal: "3v3", label: "3V3", role: "power", side: "left", order: 0, gpio: null, volts: 3.3 },
            { terminal: "gnd1", label: "GND", role: "ground", side: "left", order: 1, gpio: null, volts: 0 },
            { terminal: "gpio36", label: "GPIO36", role: "gpio", side: "left", order: 2, gpio: 36, volts: null },
            { terminal: "gpio39", label: "GPIO39", role: "gpio", side: "left", order: 3, gpio: 39, volts: null },
            { terminal: "gpio34", label: "GPIO34", role: "gpio", side: "left", order: 4, gpio: 34, volts: null },
            { terminal: "gpio35", label: "GPIO35", role: "gpio", side: "left", order: 5, gpio: 35, volts: null },
            { terminal: "gpio32", label: "GPIO32", role: "gpio", side: "left", order: 6, gpio: 32, volts: null },
            { terminal: "gpio33", label: "GPIO33", role: "gpio", side: "left", order: 7, gpio: 33, volts: null },
            { terminal: "gpio25", label: "GPIO25", role: "gpio", side: "left", order: 8, gpio: 25, volts: null },
            { terminal: "gpio26", label: "GPIO26", role: "gpio", side: "left", order: 9, gpio: 26, volts: null },
            { terminal: "gpio27", label: "GPIO27", role: "gpio", side: "left", order: 10, gpio: 27, volts: null },
            { terminal: "gpio14", label: "GPIO14", role: "gpio", side: "left", order: 11, gpio: 14, volts: null },
            { terminal: "gpio12", label: "GPIO12", role: "gpio", side: "left", order: 12, gpio: 12, volts: null },
            { terminal: "gpio13", label: "GPIO13", role: "gpio", side: "left", order: 13, gpio: 13, volts: null },
            { terminal: "gpio15", label: "GPIO15", role: "gpio", side: "left", order: 14, gpio: 15, volts: null },
            { terminal: "gpio2", label: "GPIO2", role: "gpio", side: "right", order: 0, gpio: 2, volts: null },
            { terminal: "gpio4", label: "GPIO4", role: "gpio", side: "right", order: 1, gpio: 4, volts: null },
            { terminal: "gpio16", label: "GPIO16", role: "gpio", side: "right", order: 2, gpio: 16, volts: null },
            { terminal: "gpio17", label: "GPIO17", role: "gpio", side: "right", order: 3, gpio: 17, volts: null },
            { terminal: "gpio5", label: "GPIO5", role: "gpio", side: "right", order: 4, gpio: 5, volts: null },
            { terminal: "gpio18", label: "GPIO18", role: "gpio", side: "right", order: 5, gpio: 18, volts: null },
            { terminal: "gpio19", label: "GPIO19", role: "gpio", side: "right", order: 6, gpio: 19, volts: null },
            { terminal: "gpio21", label: "GPIO21", role: "gpio", side: "right", order: 7, gpio: 21, volts: null },
            { terminal: "gpio22", label: "GPIO22", role: "gpio", side: "right", order: 8, gpio: 22, volts: null },
            { terminal: "gpio23", label: "GPIO23", role: "gpio", side: "right", order: 9, gpio: 23, volts: null },
            { terminal: "gpio1", label: "TX0", role: "gpio", side: "right", order: 10, gpio: 1, volts: null },
            { terminal: "gpio3", label: "RX0", role: "gpio", side: "right", order: 11, gpio: 3, volts: null },
            { terminal: "gpio0", label: "GPIO0", role: "gpio", side: "right", order: 12, gpio: 0, volts: null },
            { terminal: "vin", label: "VIN (5V)", role: "power", side: "right", order: 13, gpio: null, volts: 5.0 },
            { terminal: "gnd2", label: "GND", role: "ground", side: "right", order: 14, gpio: null, volts: 0 },
          ],
        },
        {
          id: "neo1",
          key: "neopixel_ring",
          name: "NeoPixel RGB Ring",
          category: "output",
          unit: "V",
          default_value: 5.0,
          modelType: "neopixel_ring",
          x: 1.5,
          z: 0,
          pins: [
            { terminal: "vcc", label: "5V / VCC", role: "power", xOffset: -0.28, zOffset: 0.55, volts: 5.0 },
            { terminal: "din", label: "DIN (Data In)", role: "gpio", xOffset: -0.09, zOffset: 0.58, gpio: null },
            { terminal: "gnd", label: "GND", role: "ground", xOffset: 0.09, zOffset: 0.58, volts: 0 },
            { terminal: "dout", label: "DOUT (Data Out)", role: "gpio", xOffset: 0.28, zOffset: 0.55, gpio: null },
          ],
        },
      ],
      edges: [
        { id: "e1", sourceId: "esp1", sourceTerminal: "vin", targetId: "neo1", targetTerminal: "vcc", color: "#ff3838" },
        { id: "e2", sourceId: "esp1", sourceTerminal: "gpio2", targetId: "neo1", targetTerminal: "din", color: "#2ed573" },
        { id: "e3", sourceId: "esp1", sourceTerminal: "gnd2", targetId: "neo1", targetTerminal: "gnd", color: "#1e272e" },
      ],
    },
  },
  {
    id: "demo-yash11-1",
    name: "Dual-LED Emergency Torch",
    description: "A 9V battery drives two LEDs in series, each protected by its own current-limiting resistor, switched on/off with a toggle — a simple, real emergency flashlight circuit.",
    owner_name: "Yash_11",
    last_run_status: "complete",
    liked_by_me: false,
    like_count: 132,
    comment_count: 18,
    component_count: 5,
    circuit_json: {
      nodes: [
        {
          id: "y1",
          key: "battery_9v",
          name: "9V Battery",
          category: "power",
          unit: "V",
          default_value: 9,
          component_id: 101,
          modelType: "battery",
          x: -1.8,
          z: 0,
        },
        {
          id: "y2",
          key: "switch",
          name: "Toggle Switch",
          category: "control",
          unit: null,
          default_value: null,
          component_id: 102,
          modelType: "switch",
          on: true,
          x: -0.9,
          z: 0,
        },
        {
          id: "y3",
          key: "resistor_1",
          name: "Resistor 1",
          category: "passive",
          unit: "Ω",
          default_value: 220,
          component_id: 103,
          modelType: "resistor",
          x: 0,
          z: 0,
        },
        {
          id: "y4",
          key: "led_1",
          name: "LED 1",
          category: "output",
          unit: null,
          default_value: null,
          component_id: 104,
          modelType: "led",
          x: 0.9,
          z: 0,
        },
        {
          id: "y5",
          key: "resistor_2",
          name: "Resistor 2",
          category: "passive",
          unit: "Ω",
          default_value: 220,
          component_id: 103,
          modelType: "resistor",
          x: 1.8,
          z: 0,
        },
        {
          id: "y6",
          key: "led_2",
          name: "LED 2",
          category: "output",
          unit: null,
          default_value: null,
          component_id: 104,
          modelType: "led",
          x: 2.7,
          z: 0,
        },
      ],
      edges: [
        { id: "ye1", sourceId: "y1", sourceTerminal: "a", targetId: "y2", targetTerminal: "a" },
        { id: "ye2", sourceId: "y2", sourceTerminal: "b", targetId: "y3", targetTerminal: "a" },
        { id: "ye3", sourceId: "y3", sourceTerminal: "b", targetId: "y4", targetTerminal: "a" },
        { id: "ye4", sourceId: "y4", sourceTerminal: "b", targetId: "y5", targetTerminal: "a" },
        { id: "ye5", sourceId: "y5", sourceTerminal: "b", targetId: "y6", targetTerminal: "a" },
        { id: "ye6", sourceId: "y6", sourceTerminal: "b", targetId: "y1", targetTerminal: "b" },
      ],
    },
  },
];

export default function Share() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // Demo circuits (id starts with "demo-") have no backend row, so
  // /circuits/:id would 404 against the API ("isn't public, or doesn't
  // exist"). For those we skip the detail page entirely and open the
  // circuit_json straight in the builder via router navigation state.
  // Real community projects still go through the normal detail route.
  function openProject(e, p) {
    if (String(p.id).startsWith("demo-")) {
      e.preventDefault();
      navigate("/builder", {
        state: {
          fromShared: true,
          projectName: p.name,
          ownerName: p.owner_name,
          circuit: p.circuit_json,
        },
      });
    }
    // otherwise let the <Link> navigate normally to /circuits/:id
  }

  function matchesQuery(p, q) {
    if (!q) return true;
    const needle = q.toLowerCase();
    return p.name.toLowerCase().includes(needle) || (p.description || "").toLowerCase().includes(needle);
  }

  function load(q = "") {
    setLoading(true);
    client
      .get("/community/projects", { params: q ? { q } : {} })
      .then((res) => {
        const demo = DEMO_PROJECTS.filter((p) => matchesQuery(p, q));
        setProjects([...demo, ...res.data.projects]);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(query), 300); // debounce search
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function toggleLike(e, projectId) {
    e.preventDefault();
    e.stopPropagation();
    if (String(projectId).startsWith("demo-")) {
      setProjects((ps) =>
        ps.map((p) =>
          p.id === projectId
            ? { ...p, liked_by_me: !p.liked_by_me, like_count: p.like_count + (p.liked_by_me ? -1 : 1) }
            : p
        )
      );
      return;
    }
    const res = await client.post(`/community/projects/${projectId}/like`);
    setProjects((ps) =>
      ps.map((p) => (p.id === projectId ? { ...p, liked_by_me: res.data.liked, like_count: res.data.like_count } : p))
    );
  }

  return (
    <AppShell>
      <div style={{ padding: "40px 6vw 60px" }}>
        <div style={{ maxWidth: 680, marginBottom: 26 }}>
          <div className="eyebrow">Community</div>
          <h1 style={styles.heroTitle}>
            Browse <span className="gradient-text">shared circuits</span>
          </h1>
          <p style={{ color: "var(--text-dim)", fontSize: 14.5, lineHeight: 1.6, margin: "10px 0 0" }}>
            Public circuits other CircuitLab builders have shared. Make one of your own public from the
            Builder toolbar.
          </p>
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search shared circuits by name or description…"
          style={styles.search}
        />

        {loading && <p style={{ color: "var(--text-dim)", marginTop: 20 }}>Loading…</p>}

        {!loading && projects.length === 0 && (
          <div style={styles.empty}>
            {query ? `No shared circuits match "${query}".` : "No public circuits yet — be the first to share one!"}
          </div>
        )}

        {!loading && projects.length > 0 && (
          <motion.div style={styles.grid} variants={gridVariants} initial="hidden" animate="show">
            {projects.map((p) => (
              <motion.div key={p.id} variants={cardVariants}>
                <Link to={`/circuits/${p.id}`} onClick={(e) => openProject(e, p)} style={styles.card}>
                  <div style={styles.cardTop}>
                    <span style={styles.cardName}>{p.name}</span>
                    {p.last_run_status && (
                      <span style={{ ...styles.statusPill, color: STATUS_COLOR[p.last_run_status] }}>
                        {STATUS_LABEL[p.last_run_status]}
                      </span>
                    )}
                  </div>
                  {p.description && <p style={styles.cardDesc}>{p.description}</p>}
                  <div style={styles.cardFooter}>
                    <span style={styles.owner}>by {p.owner_name}</span>
                    <div style={{ display: "flex", gap: 14 }}>
                      <button
                        onClick={(e) => toggleLike(e, p.id)}
                        style={{ ...styles.likeBtn, color: p.liked_by_me ? "var(--danger)" : "var(--text-faint)" }}
                      >
                        {p.liked_by_me ? "♥" : "♡"} {p.like_count}
                      </button>
                      <span style={styles.metaIcon}>💬 {p.comment_count}</span>
                      <span style={styles.metaIcon}>{p.component_count} parts</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}

const styles = {
  heroTitle: {
    margin: "6px 0 0",
    fontSize: "clamp(26px, 3.2vw, 36px)",
    fontWeight: 700,
    fontFamily: "var(--font-body)",
    lineHeight: 1.15,
  },
  search: {
    width: "100%",
    maxWidth: 480,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "10px 14px",
    color: "var(--text)",
    fontSize: 13.5,
    outline: "none",
    marginBottom: 26,
    display: "block",
  },
  empty: {
    border: "1px dashed var(--border-bright)",
    borderRadius: "var(--radius)",
    padding: "40px",
    color: "var(--text-dim)",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 14,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: "18px 20px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    textDecoration: "none",
    height: "100%",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  cardName: { fontSize: 15.5, fontWeight: 600, color: "var(--text)" },
  statusPill: {
    fontFamily: "var(--font-display)",
    fontSize: 9.5,
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  cardDesc: {
    fontSize: 12.5,
    color: "var(--text-dim)",
    lineHeight: 1.5,
    margin: 0,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  cardFooter: {
    marginTop: "auto",
    paddingTop: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid var(--border)",
  },
  owner: { fontSize: 11.5, color: "var(--text-faint)" },
  likeBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "var(--font-display)",
    padding: 0,
  },
  metaIcon: { fontSize: 11.5, color: "var(--text-faint)" },
};