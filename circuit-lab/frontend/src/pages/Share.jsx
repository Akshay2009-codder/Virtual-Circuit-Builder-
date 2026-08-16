import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "../components/AppShell";
import Card3DCanvas from "../components/builder3d/Card3DCanvas";
import Circuit3DViewModal from "../components/builder3d/Circuit3DViewModal";
import CommentsModal from "../components/CommentsModal";
import client from "../api/client";

const STATUS_LABEL = {
  complete: "Operational",
  open: "Open Loop",
  short: "Short Circuit",
  no_source: "No Power",
};

const STATUS_COLOR = {
  complete: "#2fd66f",
  open: "#ffd32a",
  short: "#ff4757",
  no_source: "#6c7a85",
};

const CATEGORIES = [
  { id: "all", label: "All Circuits", icon: "⚡" },
  { id: "esp32", label: "ESP32 & IoT", icon: "📡" },
  { id: "arduino", label: "Arduino Uno", icon: "🤖" },
  { id: "led", label: "Opto & LEDs", icon: "💡" },
  { id: "sensor", label: "Sensors & Radar", icon: "🎯" },
  { id: "analog", label: "Analog & Power", icon: "🔋" },
];

const DEMO_PROJECTS = [
  {
    id: "demo-esp32-neopixel",
    name: "ESP32 + NeoPixel RGB LED Ring",
    description:
      "An ESP32 microcontroller board driving a 12-LED NeoPixel RGB ring in 3D. GPIO2 carries DIN data, VIN provides 5V bus power, and common GND completes the loop.",
    owner_name: "Akshay_Dev",
    owner_username: "akshay_dev",
    category: "esp32",
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
    name: "Arduino Uno + HC-SR04 Ultrasonic Radar",
    description:
      "Classic Arduino Uno R3 interfaced with an HC-SR04 sonar sensor for 3D distance scanning. Trigger wired to D9, Echo to D8, 5V rail power, and ground.",
    owner_name: "TechExplorer",
    owner_username: "techexplorer",
    category: "arduino",
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
    name: "Dual-LED Regulated Emergency Torch",
    description:
      "A 9V battery supplies dual LEDs in series, protected by dedicated 220Ω current limiters and controlled via an SPST toggle switch.",
    owner_name: "Yash_11",
    owner_username: "yash_11",
    category: "analog",
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
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular"); // popular | recent | parts

  const [selected3DProject, setSelected3DProject] = useState(null);
  const [activeCommentsProject, setActiveCommentsProject] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  function triggerToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
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
    return (
      p.name.toLowerCase().includes(needle) ||
      (p.description || "").toLowerCase().includes(needle) ||
      (p.owner_name || "").toLowerCase().includes(needle) ||
      (p.owner_username || "").toLowerCase().includes(needle)
    );
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
      triggerToast(`Circuit link copied to clipboard!`);
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

  // Filter & Sort
  const filteredProjects = projects
    .filter((p) => {
      if (activeCategory === "all") return true;
      if (activeCategory === "esp32") {
        return (
          p.name.toLowerCase().includes("esp32") ||
          (p.circuit_json?.nodes || []).some((n) => n.key === "esp32" || n.modelType === "esp32")
        );
      }
      if (activeCategory === "arduino") {
        return (
          p.name.toLowerCase().includes("arduino") ||
          (p.circuit_json?.nodes || []).some((n) => n.key === "arduino_uno" || n.modelType === "arduino_uno")
        );
      }
      if (activeCategory === "led") {
        return (
          p.name.toLowerCase().includes("led") ||
          (p.circuit_json?.nodes || []).some((n) => n.category === "output" || (n.key || "").includes("led"))
        );
      }
      if (activeCategory === "sensor") {
        return (
          p.name.toLowerCase().includes("sensor") ||
          (p.circuit_json?.nodes || []).some((n) => n.category === "sensor")
        );
      }
      if (activeCategory === "analog") {
        return (
          p.name.toLowerCase().includes("battery") ||
          p.name.toLowerCase().includes("torch") ||
          (p.circuit_json?.nodes || []).some((n) => n.category === "power" || n.category === "passive")
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "popular") return (b.like_count || 0) - (a.like_count || 0);
      if (sortBy === "recent") return (b.id > a.id ? 1 : -1);
      if (sortBy === "parts") return (b.circuit_json?.nodes?.length || 0) - (a.circuit_json?.nodes?.length || 0);
      return 0;
    });

  return (
    <AppShell>
      <div style={styles.page}>
        {/* HERO SECTION */}
        <section style={styles.heroSection}>
          <div style={styles.heroGlow} />
          
          <div style={styles.heroContent}>
            <div style={styles.badgePill}>
              <span style={styles.badgeDot} />
              <span>COMMUNITY 3D SHOWCASE</span>
            </div>

            <h1 style={styles.heroTitle}>
              Explore Interactive <span className="gradient-text">3D Circuits</span>
            </h1>

            <p style={styles.heroSub}>
              Inspect, test-run, and clone real hardware schematics in interactive 3D.
            </p>
          </div>
        </section>

        {/* SEARCH, CATEGORIES & SORT BAR */}
        <section style={styles.controlsSection}>
          <div style={styles.searchRow}>
            {/* Search Input */}
            <div style={styles.searchContainer}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search circuits by name, creator, or components…"
                style={styles.searchInput}
              />
              {query && (
                <button onClick={() => setQuery("")} style={styles.clearBtn}>
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div style={styles.sortContainer}>
              <span style={styles.sortLabel}>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={styles.sortSelect}
              >
                <option value="popular">Most Liked ❤️</option>
                <option value="recent">Recently Added ⏱️</option>
                <option value="parts">Component Count 🧩</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={styles.categoryRow}>
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    ...styles.catBtn,
                    background: active ? "rgba(47, 214, 111, 0.16)" : "rgba(255, 255, 255, 0.03)",
                    color: active ? "#2fd66f" : "var(--text-dim)",
                    borderColor: active ? "rgba(47, 214, 111, 0.45)" : "var(--border)",
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* LOADING STATE */}
        {loading && (
          <div style={styles.loadingGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} style={styles.skeletonCard}>
                <div style={styles.skeletonUpper} />
                <div style={styles.skeletonLower}>
                  <div style={styles.skeletonLine} />
                  <div style={{ ...styles.skeletonLine, width: "60%" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredProjects.length === 0 && (
          <div style={styles.emptyCard}>
            <div style={{ fontSize: 38, marginBottom: 12 }}>🔍</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, color: "var(--text)" }}>No circuits found</h3>
            <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "var(--text-dim)", maxWidth: 400 }}>
              {query
                ? `No community circuits match "${query}". Try searching with different keywords.`
                : "No circuits match the selected category filter."}
            </p>
            <button
              onClick={() => {
                setQuery("");
                setActiveCategory("all");
              }}
              style={styles.resetBtn}
            >
              Clear Search & Filters
            </button>
          </div>
        )}

        {/* CARDS GRID */}
        {!loading && filteredProjects.length > 0 && (
          <div style={styles.grid}>
            {filteredProjects.map((p) => {
              const nodes = p.circuit_json?.nodes || [];
              const edges = p.circuit_json?.edges || [];
              const authorHandle = p.owner_username ? `@${p.owner_username}` : `by ${p.owner_name}`;

              return (
                <div
                  key={p.id}
                  style={styles.card}
                  onClick={() => setSelected3DProject(p)}
                >
                  {/* UPPER SIDE: 3D Canvas Preview */}
                  <div style={styles.cardUpper}>
                    <Card3DCanvas
                      nodes={nodes}
                      edges={edges}
                      height={220}
                      onClick={() => setSelected3DProject(p)}
                    />
                  </div>

                  {/* LOWER SIDE: Info, Tags, Actions */}
                  <div style={styles.cardLower}>
                    {/* Header: Title + Operational Status Badge */}
                    <div style={styles.cardTitleRow}>
                      <h3 style={styles.cardTitle}>{p.name}</h3>
                      {p.last_run_status && (
                        <span
                          style={{
                            ...styles.statusBadge,
                            color: STATUS_COLOR[p.last_run_status] || "var(--text-dim)",
                            borderColor: `${STATUS_COLOR[p.last_run_status]}44`,
                            background: `${STATUS_COLOR[p.last_run_status]}18`,
                          }}
                        >
                          ● {STATUS_LABEL[p.last_run_status] || "Simulated"}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {p.description && <p style={styles.cardDescription}>{p.description}</p>}

                    {/* Component Chips */}
                    <div style={styles.chipsRow}>
                      {nodes.slice(0, 3).map((n, idx) => (
                        <span key={idx} style={styles.partChip}>
                          {n.name}
                        </span>
                      ))}
                      {nodes.length > 3 && (
                        <span style={styles.morePartsChip}>+{nodes.length - 3} more</span>
                      )}
                    </div>

                    {/* Primary Action Buttons */}
                    <div style={styles.cardButtonRow}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected3DProject(p);
                        }}
                        style={styles.inspectBtn}
                      >
                        <span>Inspect in 3D 👁️</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openProjectInBuilder(p);
                        }}
                        style={styles.cloneBtn}
                      >
                        <span>Clone & Edit ➔</span>
                      </button>
                    </div>

                    {/* Social & Author Footer */}
                    <div style={styles.cardFooter}>
                      {/* Author */}
                      <Link
                        to={`/u/${p.owner_username || p.owner_name}`}
                        onClick={(e) => e.stopPropagation()}
                        style={styles.authorLink}
                      >
                        <div style={styles.avatar}>
                          {p.owner_name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span style={styles.authorName}>{authorHandle}</span>
                      </Link>

                      {/* Action Pills: Likes, Comments, Share */}
                      <div style={styles.socialBar}>
                        <button
                          onClick={(e) => toggleLike(e, p.id)}
                          style={{
                            ...styles.socialBtn,
                            color: p.liked_by_me ? "#ff4757" : "var(--text-dim)",
                            background: p.liked_by_me ? "rgba(255, 71, 87, 0.12)" : "rgba(255, 255, 255, 0.04)",
                            borderColor: p.liked_by_me ? "rgba(255, 71, 87, 0.35)" : "var(--border)",
                          }}
                          title={p.liked_by_me ? "Unlike circuit" : "Like circuit"}
                        >
                          <span>{p.liked_by_me ? "❤️" : "🤍"}</span>
                          <span>{p.like_count || 0}</span>
                        </button>

                        <button
                          onClick={(e) => handleOpenComments(e, p)}
                          style={styles.socialBtn}
                          title="View comments"
                        >
                          <span>💬</span>
                          <span>{p.comment_count || 0}</span>
                        </button>

                        <button
                          onClick={(e) => handleShare(e, p)}
                          style={styles.socialBtn}
                          title="Copy share link"
                        >
                          <span>🔗</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
  page: {
    padding: "36px 5vw 80px",
    maxWidth: 1400,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 32,
  },
  heroSection: {
    position: "relative",
    padding: "28px 32px 24px",
    background: "linear-gradient(135deg, rgba(16, 23, 32, 0.9) 0%, rgba(10, 14, 19, 0.95) 100%)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius)",
    overflow: "hidden",
    boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
  },
  heroGlow: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 320,
    height: 320,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(47, 214, 111, 0.14) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: 820,
  },
  badgePill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "4px 12px",
    background: "rgba(47, 214, 111, 0.1)",
    border: "1px solid rgba(47, 214, 111, 0.35)",
    borderRadius: 20,
    fontSize: 10.5,
    fontWeight: 800,
    letterSpacing: "0.08em",
    color: "#2fd66f",
    fontFamily: "var(--font-display)",
    marginBottom: 10,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#2fd66f",
    boxShadow: "0 0 8px #2fd66f",
  },
  heroTitle: {
    margin: "0 0 8px",
    fontSize: "clamp(26px, 3.4vw, 38px)",
    fontWeight: 800,
    letterSpacing: "-0.01em",
    lineHeight: 1.15,
    color: "var(--text)",
  },
  heroSub: {
    margin: 0,
    fontSize: 14,
    color: "var(--text-dim)",
    lineHeight: 1.5,
  },
  controlsSection: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  searchRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  searchContainer: {
    position: "relative",
    flex: 1,
    minWidth: 280,
  },
  searchIcon: {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 14,
    pointerEvents: "none",
    opacity: 0.6,
  },
  searchInput: {
    width: "100%",
    padding: "12px 38px 12px 42px",
    background: "rgba(16, 22, 29, 0.85)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    fontSize: 13.5,
    outline: "none",
    boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
  },
  clearBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "var(--text-dim)",
    cursor: "pointer",
    fontSize: 13,
  },
  sortContainer: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  sortLabel: {
    fontSize: 12.5,
    fontWeight: 600,
    color: "var(--text-dim)",
  },
  sortSelect: {
    padding: "10px 14px",
    background: "rgba(16, 22, 29, 0.85)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    fontSize: 13,
    outline: "none",
    cursor: "pointer",
  },
  categoryRow: {
    display: "flex",
    gap: 8,
    overflowX: "auto",
    paddingBottom: 4,
  },
  catBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 16px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border)",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.15s ease",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
    gap: 26,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    background: "rgba(16, 22, 29, 0.82)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius)",
    overflow: "hidden",
    boxShadow: "0 12px 36px rgba(0,0,0,0.45)",
    transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
  },
  cardUpper: {
    width: "100%",
    background: "#080c10",
  },
  cardLower: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: 12,
  },
  cardTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  cardTitle: {
    margin: 0,
    fontSize: 16.5,
    fontWeight: 700,
    color: "var(--text)",
    lineHeight: 1.3,
  },
  statusBadge: {
    fontSize: 10.5,
    fontWeight: 700,
    fontFamily: "var(--font-display)",
    padding: "2px 8px",
    borderRadius: 10,
    border: "1px solid",
    whiteSpace: "nowrap",
    letterSpacing: "0.04em",
  },
  cardDescription: {
    margin: 0,
    fontSize: 13,
    color: "var(--text-dim)",
    lineHeight: 1.5,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  chipsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 2,
  },
  partChip: {
    fontSize: 10.5,
    padding: "2px 8px",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid var(--border)",
    borderRadius: 4,
    color: "var(--text-dim)",
  },
  morePartsChip: {
    fontSize: 10.5,
    padding: "2px 6px",
    color: "var(--primary)",
    fontWeight: 600,
  },
  cardButtonRow: {
    display: "flex",
    gap: 8,
    marginTop: 4,
  },
  inspectBtn: {
    flex: 1,
    padding: "9px 12px",
    background: "rgba(47, 214, 111, 0.14)",
    border: "1px solid rgba(47, 214, 111, 0.4)",
    borderRadius: "var(--radius-sm)",
    color: "#2fd66f",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cloneBtn: {
    flex: 1,
    padding: "9px 12px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardFooter: {
    marginTop: "auto",
    paddingTop: 14,
    borderTop: "1px solid var(--border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  authorLink: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    textDecoration: "none",
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2fd66f 0%, #1f9a51 100%)",
    color: "#0a0e13",
    fontWeight: 800,
    fontSize: 12,
    display: "grid",
    placeItems: "center",
  },
  authorName: {
    fontSize: 12.5,
    fontWeight: 600,
    color: "var(--text-dim)",
  },
  socialBar: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  socialBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "5px 9px",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    fontSize: 12,
    color: "var(--text-dim)",
    cursor: "pointer",
  },
  loadingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
    gap: 26,
  },
  skeletonCard: {
    background: "rgba(16, 22, 29, 0.6)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    height: 380,
    overflow: "hidden",
  },
  skeletonUpper: {
    height: 220,
    background: "rgba(255, 255, 255, 0.02)",
  },
  skeletonLower: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  skeletonLine: {
    height: 16,
    borderRadius: 4,
    background: "rgba(255, 255, 255, 0.04)",
  },
  emptyCard: {
    padding: "60px 20px",
    textAlign: "center",
    background: "rgba(16, 22, 29, 0.6)",
    border: "1px dashed var(--border-bright)",
    borderRadius: "var(--radius)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  resetBtn: {
    padding: "8px 18px",
    background: "var(--primary)",
    color: "#0a0e13",
    border: "none",
    borderRadius: "var(--radius-sm)",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  toast: {
    position: "fixed",
    bottom: 24,
    right: 24,
    zIndex: 3000,
    background: "rgba(16, 22, 29, 0.95)",
    border: "1px solid #2fd66f",
    color: "#2fd66f",
    padding: "12px 20px",
    borderRadius: "var(--radius-sm)",
    fontSize: 13.5,
    fontWeight: 700,
    boxShadow: "0 8px 28px rgba(0,0,0,0.6)",
    backdropFilter: "blur(8px)",
  },
};