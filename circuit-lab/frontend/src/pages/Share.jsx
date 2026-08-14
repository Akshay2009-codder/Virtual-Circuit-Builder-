import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "../components/AppShell";
import Card3DCanvas from "../components/builder3d/Card3DCanvas";
import Circuit3DViewModal from "../components/builder3d/Circuit3DViewModal";
import CommentsModal from "../components/CommentsModal";
import client from "../api/client";

const STATUS_LABEL = {
  complete: "Working",
  open: "Open circuit",
  short: "Short circuit",
  no_source: "No power",
};
const STATUS_COLOR = {
  complete: "#2fd66f",
  open: "#ffd32a",
  short: "#ff4757",
  no_source: "#6c7a85",
};

const gridVariants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const cardVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const DEMO_PROJECTS = [
  {
    id: "demo-esp32-neopixel",
    name: "ESP32 + NeoPixel RGB LED Ring",
    description:
      "An ESP32 microcontroller board connected in 3D to a 12-LED NeoPixel RGB ring. GPIO2 drives the DIN signal pin (green wire), VIN supplies 5V power (red wire), and GND completes the circuit (black wire).",
    owner_name: "Akshay_Dev",
    owner_username: "akshay_dev",
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
          x: -1.3,
          z: 0,
        },
        {
          id: "neo1",
          key: "neopixel_ring",
          name: "NeoPixel RGB Ring",
          category: "output",
          unit: "V",
          default_value: 5.0,
          modelType: "neopixel_ring",
          x: 1.3,
          z: 0,
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
    id: "demo-uno-ultrasonic",
    name: "Arduino Uno + Ultrasonic Radar",
    description:
      "Classic Arduino Uno board paired with an HC-SR04 ultrasonic distance sensor. Trigger pin connected to D9, Echo pin to D8, VCC to 5V rail, and GND to ground.",
    owner_name: "TechExplorer",
    owner_username: "techexplorer",
    last_run_status: "complete",
    liked_by_me: true,
    like_count: 189,
    comment_count: 14,
    component_count: 2,
    circuit_json: {
      nodes: [
        {
          id: "uno1",
          key: "arduino_uno",
          name: "Arduino Uno R3",
          category: "board",
          unit: "V",
          default_value: 5.0,
          modelType: "arduino_uno",
          x: -1.4,
          z: 0,
        },
        {
          id: "ultra1",
          key: "ultrasonic_sensor",
          name: "HC-SR04 Ultrasonic",
          category: "sensor",
          unit: "cm",
          default_value: 100,
          modelType: "ultrasonic",
          x: 1.4,
          z: 0,
        },
      ],
      edges: [
        { id: "ue1", sourceId: "uno1", sourceTerminal: "5v", targetId: "ultra1", targetTerminal: "vcc", color: "#ff3838" },
        { id: "ue2", sourceId: "uno1", sourceTerminal: "gnd1", targetId: "ultra1", targetTerminal: "gnd", color: "#1e272e" },
        { id: "ue3", sourceId: "uno1", sourceTerminal: "d9", targetId: "ultra1", targetTerminal: "trig", color: "#ffa801" },
        { id: "ue4", sourceId: "uno1", sourceTerminal: "d8", targetId: "ultra1", targetTerminal: "echo", color: "#1e90ff" },
      ],
    },
  },
  {
    id: "demo-yash11-1",
    name: "Dual-LED Emergency Torch",
    description:
      "A 9V battery drives two LEDs in series, each protected by its own current-limiting resistor, switched on/off with a toggle — a simple, real emergency flashlight circuit.",
    owner_name: "Yash_11",
    owner_username: "yash_11",
    last_run_status: "complete",
    liked_by_me: false,
    like_count: 132,
    comment_count: 18,
    component_count: 6,
    circuit_json: {
      nodes: [
        { id: "y1", key: "battery_9v", name: "9V Battery", category: "power", unit: "V", default_value: 9, modelType: "battery", x: -1.8, z: 0 },
        { id: "y2", key: "switch", name: "Toggle Switch", category: "control", unit: null, default_value: null, modelType: "switch", on: true, x: -0.9, z: 0 },
        { id: "y3", key: "resistor_1", name: "Resistor 1", category: "passive", unit: "Ω", default_value: 220, modelType: "resistor", x: 0, z: 0 },
        { id: "y4", key: "led_1", name: "LED 1", category: "output", unit: null, default_value: null, modelType: "led", x: 0.9, z: 0 },
        { id: "y5", key: "resistor_2", name: "Resistor 2", category: "passive", unit: "Ω", default_value: 220, modelType: "resistor", x: 1.8, z: 0 },
        { id: "y6", key: "led_2", name: "LED 2", category: "output", unit: null, default_value: null, modelType: "led", x: 2.7, z: 0 },
      ],
      edges: [
        { id: "ye1", sourceId: "y1", sourceTerminal: "a", targetId: "y2", targetTerminal: "a", color: "#ff3838" },
        { id: "ye2", sourceId: "y2", sourceTerminal: "b", targetId: "y3", targetTerminal: "a", color: "#ff3838" },
        { id: "ye3", sourceId: "y3", sourceTerminal: "b", targetId: "y4", targetTerminal: "a", color: "#2ed573" },
        { id: "ye4", sourceId: "y4", sourceTerminal: "b", targetId: "y5", targetTerminal: "a", color: "#2ed573" },
        { id: "ye5", sourceId: "y5", sourceTerminal: "b", targetId: "y6", targetTerminal: "a", color: "#2ed573" },
        { id: "ye6", sourceId: "y6", sourceTerminal: "b", targetId: "y1", targetTerminal: "b", color: "#1e272e" },
      ],
    },
  },
];

export default function Share() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [selected3DProject, setSelected3DProject] = useState(null);
  const [activeCommentsProject, setActiveCommentsProject] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  function triggerToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  }

  function openProjectInBuilder(p) {
    if (p?.circuit_json) {
      navigate("/builder", {
        state: {
          fromShared: true,
          projectName: p.name,
          ownerName: p.owner_name,
          circuit: p.circuit_json,
        },
      });
    } else {
      navigate(`/circuits/${p.id}`);
    }
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
      .catch(() => {
        const demo = DEMO_PROJECTS.filter((p) => matchesQuery(p, q));
        setProjects(demo);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(query), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function toggleLike(e, projectId) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (String(projectId).startsWith("demo-")) {
      setProjects((ps) =>
        ps.map((p) =>
          p.id === projectId
            ? { ...p, liked_by_me: !p.liked_by_me, like_count: p.like_count + (p.liked_by_me ? -1 : 1) }
            : p
        )
      );
      if (selected3DProject?.id === projectId) {
        setSelected3DProject((p) =>
          p ? { ...p, liked_by_me: !p.liked_by_me, like_count: p.like_count + (p.liked_by_me ? -1 : 1) } : null
        );
      }
      return;
    }
    try {
      const res = await client.post(`/community/projects/${projectId}/like`);
      setProjects((ps) =>
        ps.map((p) => (p.id === projectId ? { ...p, liked_by_me: res.data.liked, like_count: res.data.like_count } : p))
      );
      if (selected3DProject?.id === projectId) {
        setSelected3DProject((p) =>
          p ? { ...p, liked_by_me: res.data.liked, like_count: res.data.like_count } : null
        );
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  }

  function handleShare(e, p) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const url = `${window.location.origin}/circuits/${p.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      triggerToast(`Link for "${p.name}" copied to clipboard!`);
    } else {
      triggerToast(`Share link: ${url}`);
    }
  }

  function handleOpenComments(e, p) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveCommentsProject(p);
  }

  return (
    <AppShell>
      <div style={{ padding: "40px 6vw 60px", maxWidth: 1400, margin: "0 auto" }}>
        {/* Header Hero Section */}
        <div style={{ maxWidth: 720, marginBottom: 30 }}>
          <div className="eyebrow" style={{ letterSpacing: "0.1em" }}>⚡ 3D COMMUNITY SHOWCASE</div>
          <h1 style={styles.heroTitle}>
            Explore <span className="gradient-text">Interactive 3D Circuits</span>
          </h1>
          <p style={{ color: "var(--text-dim)", fontSize: 15, lineHeight: 1.6, margin: "10px 0 0" }}>
            Inspect, orbit, and experiment with real 3D circuits built by the CircuitLab community.
            Click any circuit card to view it in full interactive 3D right on this page!
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ position: "relative", maxWidth: 520, marginBottom: 32 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 3D circuits by name, author, or components…"
            style={styles.search}
          />
          <span style={styles.searchIcon}>🔍</span>
        </div>

        {loading && <p style={{ color: "var(--text-dim)", marginTop: 20 }}>Loading 3D community circuits…</p>}

        {!loading && projects.length === 0 && (
          <div style={styles.empty}>
            {query ? `No 3D circuits match "${query}".` : "No public circuits yet — be the first to share one!"}
          </div>
        )}

        {/* 3D Projects Cards Grid */}
        {!loading && projects.length > 0 && (
          <motion.div style={styles.grid} variants={gridVariants} initial="hidden" animate="show">
            {projects.map((p) => {
              const nodes = p.circuit_json?.nodes || [];
              const edges = p.circuit_json?.edges || [];
              const authorHandle = p.owner_username ? `@${p.owner_username}` : `by ${p.owner_name}`;

              return (
                <motion.div key={p.id} variants={cardVariants}>
                  <div style={styles.card} onClick={() => setSelected3DProject(p)}>
                    {/* UPPER SIDE: Interactive 3D Canvas Preview */}
                    <div style={styles.cardUpper}>
                      <Card3DCanvas
                        nodes={nodes}
                        edges={edges}
                        height={210}
                        onClick={() => setSelected3DProject(p)}
                      />
                    </div>

                    {/* LOWER SIDE: Description, Name, Actions, Author */}
                    <div style={styles.cardLower}>
                      {/* Name & Status Pill */}
                      <div style={styles.cardTop}>
                        <h3 style={styles.cardName}>{p.name}</h3>
                        {p.last_run_status && (
                          <span style={{ ...styles.statusPill, color: STATUS_COLOR[p.last_run_status] }}>
                            ● {STATUS_LABEL[p.last_run_status]}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {p.description && <p style={styles.cardDesc}>{p.description}</p>}

                      {/* View in 3D Modal & Edit in Builder Buttons */}
                      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected3DProject(p);
                          }}
                          style={styles.view3dBtn}
                        >
                          <span>View in 3D 👁️</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openProjectInBuilder(p);
                          }}
                          style={styles.openBuilderBtn}
                        >
                          <span>Edit in Builder ➔</span>
                        </button>
                      </div>

                      {/* Interactive Action Bar: Like, Comment, Share */}
                      <div style={styles.actionBar}>
                        {/* Like Button */}
                        <button
                          onClick={(e) => toggleLike(e, p.id)}
                          style={{
                            ...styles.actionBtn,
                            color: p.liked_by_me ? "#ff4757" : "var(--text-dim)",
                            background: p.liked_by_me ? "rgba(255, 71, 87, 0.12)" : "rgba(255, 255, 255, 0.04)",
                            borderColor: p.liked_by_me ? "rgba(255, 71, 87, 0.35)" : "var(--border)",
                          }}
                          title={p.liked_by_me ? "Unlike circuit" : "Like circuit"}
                        >
                          <span style={{ fontSize: 14 }}>{p.liked_by_me ? "❤️" : "🤍"}</span>
                          <span>{p.like_count}</span>
                        </button>

                        {/* Comment Button */}
                        <button
                          onClick={(e) => handleOpenComments(e, p)}
                          style={styles.actionBtn}
                          title="View and add comments"
                        >
                          <span style={{ fontSize: 13 }}>💬</span>
                          <span>{p.comment_count}</span>
                        </button>

                        {/* Share Button */}
                        <button onClick={(e) => handleShare(e, p)} style={styles.actionBtn} title="Share circuit link">
                          <span style={{ fontSize: 13 }}>🔗</span>
                          <span>Share</span>
                        </button>
                      </div>

                      {/* Bottom Author Tag & Username */}
                      <div style={styles.cardFooter}>
                        <Link
                          to={`/u/${p.owner_username || p.owner_name}`}
                          onClick={(e) => e.stopPropagation()}
                          style={styles.authorTag}
                        >
                          <span style={styles.avatarCircle}>{p.owner_name?.[0]?.toUpperCase() || "U"}</span>
                          <span style={styles.authorHandle}>{authorHandle}</span>
                        </Link>
                        <span style={styles.componentBadge}>{nodes.length} Parts</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* FULL 3D INTERACTIVE CIRCUIT VIEWER MODAL */}
      <Circuit3DViewModal
        project={selected3DProject}
        isOpen={!!selected3DProject}
        onClose={() => setSelected3DProject(null)}
        onOpenBuilder={(p) => {
          setSelected3DProject(null);
          openProjectInBuilder(p);
        }}
        onLikeToggle={(e, pid) => toggleLike(e, pid)}
        onShare={(e, p) => handleShare(e, p)}
      />

      {/* Comments Drawer / Modal */}
      {activeCommentsProject && (
        <CommentsModal
          project={activeCommentsProject}
          isOpen={!!activeCommentsProject}
          onClose={() => setActiveCommentsProject(null)}
          onCommentAdded={(projId) => {
            setProjects((ps) =>
              ps.map((item) => (item.id === projId ? { ...item, comment_count: item.comment_count + 1 } : item))
            );
          }}
        />
      )}

      {/* Toast Notification Popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={styles.toast}
          >
            ✅ {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}

const styles = {
  heroTitle: {
    margin: "6px 0 0",
    fontSize: "clamp(28px, 3.6vw, 42px)",
    fontWeight: 800,
    fontFamily: "var(--font-body)",
    lineHeight: 1.15,
  },
  search: {
    width: "100%",
    background: "var(--surface)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius-sm)",
    padding: "12px 16px 12px 42px",
    color: "var(--text)",
    fontSize: 14,
    outline: "none",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },
  searchIcon: {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    fontSize: 14,
    opacity: 0.6,
  },
  empty: {
    border: "1px dashed var(--border-bright)",
    borderRadius: "var(--radius)",
    padding: "50px",
    color: "var(--text-dim)",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: 24,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    background: "var(--surface)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius)",
    overflow: "hidden",
    boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
    transition: "transform 0.2s ease, border-color 0.2s ease",
    cursor: "pointer",
  },
  cardUpper: {
    width: "100%",
  },
  cardLower: {
    padding: "18px 20px 16px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: 12,
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  cardName: { margin: 0, fontSize: 17, fontWeight: 700, color: "var(--text)", lineHeight: 1.25 },
  statusPill: {
    fontFamily: "var(--font-display)",
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  cardDesc: {
    fontSize: 13,
    color: "var(--text-dim)",
    lineHeight: 1.5,
    margin: 0,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  view3dBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "9px 12px",
    background: "rgba(47, 214, 111, 0.12)",
    border: "1px solid rgba(47, 214, 111, 0.35)",
    borderRadius: "var(--radius-sm)",
    color: "#2fd66f",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
  },
  openBuilderBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    padding: "9px 12px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-dim)",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  actionBar: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    paddingTop: 4,
  },
  actionBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "7px 10px",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-dim)",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  cardFooter: {
    marginTop: "auto",
    paddingTop: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid var(--border)",
  },
  authorTag: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    textDecoration: "none",
  },
  avatarCircle: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    background: "var(--primary)",
    color: "#0a0e13",
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
    fontSize: 11,
  },
  authorHandle: { fontSize: 12.5, fontWeight: 600, color: "var(--text-dim)" },
  componentBadge: { fontSize: 11, color: "var(--text-faint)", background: "rgba(255,255,255,0.03)", padding: "3px 8px", borderRadius: 4 },
  toast: {
    position: "fixed",
    bottom: 24,
    right: 24,
    zIndex: 2000,
    background: "#161f28",
    border: "1px solid #2fd66f",
    borderRadius: "var(--radius-sm)",
    padding: "12px 20px",
    color: "#2fd66f",
    fontSize: 13.5,
    fontWeight: 700,
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
};