import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import ComponentPalette from "../components/builder/ComponentPalette";
import Scene3D from "../components/builder3d/Scene3D";
import { screenToGround } from "../components/builder3d/raycast";
import ShareModal from "../components/ShareModal";
import client from "../api/client";

let idCounter = 1;
const nextId = () => `n${idCounter++}`;

export default function Builder() {
  const { id } = useParams(); // undefined => new project
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const cameraRef = useRef(null);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [components, setComponents] = useState([]);
  const [projectId, setProjectId] = useState(id ? Number(id) : null);
  const [projectName, setProjectName] = useState("Untitled Circuit");
  const [description, setDescription] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error

  const [draggingId, setDraggingId] = useState(null);
  const [selectedTerminal, setSelectedTerminal] = useState(null);
  const [simResult, setSimResult] = useState(null);
  const [simRunning, setSimRunning] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isDropTarget, setIsDropTarget] = useState(false);

  // Load the component catalog for the palette
  useEffect(() => {
    client.get("/components").then((res) => setComponents(res.data.components));
  }, []);

  // Load an existing project if editing one
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    client
      .get(`/projects/${id}`)
      .then((res) => {
        const p = res.data.project;
        setProjectName(p.name);
        setDescription(p.description || "");
        setIsPublic(!!p.is_public);
        if (p.description) setShowDetails(true);
        setNodes(p.circuit_json.nodes || []);
        setEdges(p.circuit_json.edges || []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // any edit invalidates the last simulation result
  useEffect(() => {
    setSimResult(null);
  }, [nodes, edges]);

  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!isDropTarget) setIsDropTarget(true);
  }

  function onDragLeave() {
    setIsDropTarget(false);
  }

  function onDrop(e) {
    e.preventDefault();
    setIsDropTarget(false);
    const raw = e.dataTransfer.getData("application/circuitlab-component");
    if (!raw || !cameraRef.current || !wrapperRef.current) return;
    const component = JSON.parse(raw);

    const rect = wrapperRef.current.getBoundingClientRect();
    const { x, z } = screenToGround(e.clientX, e.clientY, rect, cameraRef.current);

    setNodes((nds) =>
      nds.concat({
        id: nextId(),
        key: component.key,
        name: component.name,
        category: component.category,
        unit: component.unit,
        default_value: component.default_value,
        component_id: component.id,
        modelType: component.model_type,
        on: component.key === "switch" || component.key === "dip_switch" ? true : undefined,
        x: Math.round(x / 0.5) * 0.5,
        z: Math.round(z / 0.5) * 0.5,
      })
    );
  }

  function handleDragStart(nodeId) {
    setDraggingId(nodeId);
  }
  function handleDragMove(nodeId, x, z) {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId ? { ...n, x: Math.round(x / 0.25) * 0.25, z: Math.round(z / 0.25) * 0.25 } : n
      )
    );
  }
  function handleDragEnd() {
    setDraggingId(null);
  }

  function handleRemove(nodeId) {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.sourceId !== nodeId && e.targetId !== nodeId));
    setSelectedTerminal((sel) => (sel && sel.nodeId === nodeId ? null : sel));
  }

  function handleToggle(nodeId) {
    setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, on: !(n.on !== false) } : n)));
  }

  function handleTerminalClick(nodeId, terminal) {
    if (!selectedTerminal) {
      setSelectedTerminal({ nodeId, terminal });
      return;
    }
    if (selectedTerminal.nodeId === nodeId && selectedTerminal.terminal === terminal) {
      setSelectedTerminal(null); // clicked the same terminal again - deselect
      return;
    }
    if (selectedTerminal.nodeId === nodeId) {
      setSelectedTerminal({ nodeId, terminal }); // switch to the other terminal on the same part
      return;
    }
    setEdges((eds) =>
      eds.concat({
        id: `e${Date.now()}`,
        sourceId: selectedTerminal.nodeId,
        sourceTerminal: selectedTerminal.terminal,
        targetId: nodeId,
        targetTerminal: terminal,
      })
    );
    setSelectedTerminal(null);
  }

  async function handleSave() {
    setSaveState("saving");
    const circuit_json = { nodes, edges };
    try {
      let pid = projectId;
      if (pid) {
        await client.put(`/projects/${pid}`, { name: projectName, description, circuit_json });
      } else {
        const res = await client.post("/projects", { name: projectName, description, circuit_json });
        pid = res.data.project.id;
        setProjectId(pid);
        navigate(`/builder/${pid}`, { replace: true });
      }
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1500);
      return pid;
    } catch {
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 1500);
      return null;
    }
  }

  async function handleTogglePublic() {
    const pid = projectId || (await handleSave());
    if (!pid) return;
    setPublishing(true);
    try {
      const res = await client.put(`/projects/${pid}`, { is_public: !isPublic });
      setIsPublic(!!res.data.project.is_public);
    } finally {
      setPublishing(false);
    }
  }

  async function handleRunCircuit() {
    setSimRunning(true);
    setSimResult(null);
    try {
      const pid = await handleSave(); // always save first so the simulation reads the current layout
      if (!pid) return;
      const res = await client.post(`/projects/${pid}/simulate`);
      setSimResult(res.data);
    } catch (err) {
      setSimResult({
        status: "error",
        message: err.response?.data?.error || "Couldn't run the simulation. Try again.",
        poweredIds: [],
        suggestions: [],
      });
    } finally {
      setSimRunning(false);
    }
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <AppShell>
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 65px)" }}>
          <div style={styles.toolbar} className="cl-toolbar">
            <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
              <div className="cl-name-wrap">
                <input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  style={styles.nameInput}
                  placeholder="Untitled Circuit"
                  className="cl-name-input"
                />
                <span className="cl-name-underline" />
              </div>
              <button
                style={styles.detailsToggle}
                onClick={() => setShowDetails((s) => !s)}
                className="cl-btn cl-btn-ghost"
              >
                {showDetails ? "Hide details" : description ? "Edit details" : "+ Add details"}
              </button>
              <span style={styles.statText} className="cl-stat">
                <span className="cl-stat-dot" />
                {nodes.length} components · {edges.length} connections
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <SaveStatus state={saveState} />
              <button onClick={handleSave} style={styles.saveBtn} className="cl-btn cl-btn-save">
                Save circuit
              </button>
              <button
                onClick={handleRunCircuit}
                style={styles.runBtn}
                disabled={simRunning}
                className={`cl-btn cl-btn-run ${simRunning ? "cl-btn-run-active" : "cl-btn-run-pulse"}`}
              >
                <span className={`cl-run-icon ${simRunning ? "cl-spin" : ""}`}>{simRunning ? "◐" : "▶"}</span>
                {simRunning ? "Running…" : "Run circuit"}
              </button>
              <button
                onClick={() => (projectId ? setShareOpen(true) : handleSave().then(() => setShareOpen(true)))}
                style={styles.shareBtn}
                title={projectId ? "Share with teammates" : "Save first, then share"}
                className="cl-btn cl-btn-ghost"
              >
                👥 Share
              </button>
              <button
                onClick={handleTogglePublic}
                disabled={publishing}
                style={{
                  ...styles.publishBtn,
                  borderColor: isPublic ? "var(--primary)" : "var(--border-bright)",
                  color: isPublic ? "var(--primary)" : "var(--text-dim)",
                }}
                title={isPublic ? "Visible in the community gallery - click to make private" : "Publish to the community gallery"}
                className={`cl-btn cl-btn-ghost ${isPublic ? "cl-btn-public" : ""}`}
              >
                {isPublic ? "🌐 Public" : "🔒 Private"}
              </button>
            </div>
          </div>

          {showDetails && (
            <div style={styles.detailsBar} className="cl-details-bar">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this circuit do? e.g. 'ESP32-based temperature monitor that lights an LED above 30°C.'"
                style={styles.descInput}
                rows={2}
                className="cl-textarea"
              />
            </div>
          )}

          <div style={styles.hintBar}>
            <span style={styles.hint}>
              Drag a part onto the board · drag a placed part to move it · click two glowing terminal dots
              to wire them · drag empty space to orbit, scroll to zoom
            </span>
          </div>

          {simResult && (
            <div
              key={simResult.status + (simResult.message || "")}
              style={{ ...styles.resultBar, ...RESULT_STYLE[simResult.status] }}
              className={`cl-result-bar ${simResult.status === "short" ? "cl-result-alert" : ""}`}
            >
              <span className={simResult.status === "complete" ? "cl-icon-pop" : ""}>
                {RESULT_ICON[simResult.status] || "ℹ"}
              </span>
              <span>{simResult.message}</span>
            </div>
          )}

          {simResult?.suggestions?.length > 0 && (
            <div style={styles.suggestionsBar}>
              {simResult.suggestions.map((s, i) => (
                <div
                  key={i}
                  style={{ ...styles.suggestionRow, animationDelay: `${i * 70}ms` }}
                  className="cl-suggestion-row"
                >
                  <span style={{ color: "var(--gold)" }}>💡</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
            <div
              ref={wrapperRef}
              style={{ flex: 1, position: "relative" }}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={isDropTarget ? "cl-drop-target" : ""}
            >
              {!loading && (
                <Scene3D
                  nodes={nodes}
                  edges={edges}
                  draggingId={draggingId}
                  onDragStart={handleDragStart}
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                  onTerminalClick={handleTerminalClick}
                  onToggle={handleToggle}
                  selectedTerminal={selectedTerminal}
                  onRemove={handleRemove}
                  cameraRef={cameraRef}
                  poweredIds={simResult ? new Set(simResult.poweredIds) : null}
                  readings={simResult?.readings || null}
                />
              )}

              {loading && (
                <div className="cl-loading-overlay">
                  <span className="cl-loading-spinner" />
                  <span className="cl-loading-text">Loading circuit…</span>
                </div>
              )}

              {simResult?.readings && Object.keys(simResult.readings).length > 0 && (
                <ReadingsPanel readings={simResult.readings} nodes={nodes} />
              )}
            </div>

            <ComponentPalette components={components} loading={loading} />
          </div>
        </div>
      </AppShell>
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} projectId={projectId} />
    </>
  );
}

function SaveStatus({ state }) {
  if (state === "idle") return null;
  const label = { saving: "Saving…", saved: "Saved", error: "Couldn't save" }[state];
  const color = state === "error" ? "var(--danger)" : "var(--primary)";
  const icon = { saving: "○", saved: "✓", error: "✕" }[state];
  return (
    <span className="mono cl-save-status" style={{ fontSize: 12, color }}>
      <span className={state === "saving" ? "cl-spin-slow" : "cl-icon-pop"}>{icon}</span>
      {label}
    </span>
  );
}

function ReadingsPanel({ readings, nodes }) {
  const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const rows = Object.entries(readings)
    .filter(([, r]) => r.state === "on")
    .map(([id, r]) => ({ id, name: nodeById[id]?.name || id, ...r }))
    .sort((a, b) => b.current_mA - a.current_mA);

  if (rows.length === 0) return null;

  const maxCurrent = Math.max(...rows.map((r) => r.current_mA), 1);

  return (
    <div style={styles.readingsPanel} className="cl-readings-panel">
      <div className="eyebrow" style={{ marginBottom: 8 }}>
        Live readings
      </div>
      <div style={styles.readingsHeader}>
        <span>Part</span>
        <span>V</span>
        <span>mA</span>
        <span>mW</span>
      </div>
      {rows.map((r, i) => (
        <div
          key={r.id}
          style={{ ...styles.readingsRow, animationDelay: `${i * 45}ms` }}
          className="cl-readings-row"
        >
          <span style={styles.readingsName}>{r.name}</span>
          <span className="mono">{r.voltage.toFixed(2)}</span>
          <span className="mono" style={{ color: r.current_mA > 1000 ? "var(--danger)" : "var(--text)" }}>
            {r.current_mA.toFixed(1)}
          </span>
          <span className="mono">{r.power_mW.toFixed(1)}</span>
          <span
            className="cl-readings-bar"
            style={{
              width: `${Math.max(6, (r.current_mA / maxCurrent) * 100)}%`,
              background: r.current_mA > 1000 ? "var(--danger)" : "var(--primary)",
            }}
          />
        </div>
      ))}
    </div>
  );
}

const RESULT_ICON = {
  complete: "✓",
  open: "⚠",
  short: "⚡",
  no_source: "ℹ",
  error: "✕",
};

const RESULT_STYLE = {
  complete: { background: "rgba(47,214,111,0.12)", color: "var(--primary)", borderColor: "var(--primary)" },
  open: { background: "rgba(255,201,77,0.12)", color: "var(--gold)", borderColor: "var(--gold)" },
  short: { background: "rgba(255,71,87,0.12)", color: "var(--danger)", borderColor: "var(--danger)" },
  no_source: { background: "var(--surface-2)", color: "var(--text-dim)", borderColor: "var(--border-bright)" },
  error: { background: "rgba(255,71,87,0.12)", color: "var(--danger)", borderColor: "var(--danger)" },
};

const styles = {
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
    borderBottom: "1px solid var(--border)",
    background: "var(--surface)",
    gap: 16,
  },
  nameInput: {
    background: "transparent",
    border: "none",
    color: "var(--text)",
    fontSize: 16,
    fontWeight: 600,
    outline: "none",
    fontFamily: "var(--font-body)",
    minWidth: 160,
  },
  detailsToggle: {
    background: "transparent",
    border: "1px solid var(--border-bright)",
    color: "var(--text-dim)",
    borderRadius: "var(--radius-sm)",
    padding: "5px 12px",
    fontSize: 12,
    cursor: "pointer",
    flexShrink: 0,
  },
  statText: {
    color: "var(--text-faint)",
    fontSize: 12,
    fontFamily: "var(--font-display)",
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
  saveBtn: {
    background: "var(--primary)",
    color: "#062011",
    border: "none",
    borderRadius: "var(--radius-sm)",
    padding: "8px 18px",
    fontSize: 13.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  runBtn: {
    background: "transparent",
    color: "var(--accent)",
    border: "1.5px solid var(--accent)",
    borderRadius: "var(--radius-sm)",
    padding: "7px 16px",
    fontSize: 13.5,
    fontWeight: 600,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  shareBtn: {
    background: "transparent",
    color: "var(--text-dim)",
    border: "1.5px solid var(--border-bright)",
    borderRadius: "var(--radius-sm)",
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  publishBtn: {
    background: "transparent",
    border: "1.5px solid",
    borderRadius: "var(--radius-sm)",
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  resultBar: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 20px",
    borderBottom: "1px solid",
    fontSize: 12.5,
    fontWeight: 500,
  },
  suggestionsBar: {
    padding: "8px 20px",
    borderBottom: "1px solid var(--border)",
    background: "var(--surface)",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  suggestionRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    fontSize: 12,
    color: "var(--text-dim)",
  },
  detailsBar: {
    padding: "10px 20px",
    borderBottom: "1px solid var(--border)",
    background: "var(--surface)",
  },
  descInput: {
    width: "100%",
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "8px 12px",
    color: "var(--text)",
    fontSize: 13,
    fontFamily: "var(--font-body)",
    outline: "none",
    resize: "vertical",
  },
  hintBar: {
    padding: "7px 20px",
    borderBottom: "1px solid var(--border)",
    background: "var(--surface)",
  },
  hint: {
    color: "var(--text-faint)",
    fontSize: 11.5,
  },
  readingsPanel: {
    position: "absolute",
    bottom: 16,
    left: 16,
    width: 230,
    background: "rgba(16,22,29,0.92)",
    backdropFilter: "blur(6px)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "12px 14px",
    zIndex: 5,
  },
  readingsHeader: {
    display: "grid",
    gridTemplateColumns: "1.4fr 0.7fr 0.8fr 0.8fr",
    gap: 6,
    fontSize: 9.5,
    color: "var(--text-faint)",
    fontFamily: "var(--font-display)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    paddingBottom: 6,
    borderBottom: "1px solid var(--border)",
  },
  readingsRow: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "1.4fr 0.7fr 0.8fr 0.8fr",
    gap: 6,
    fontSize: 11.5,
    padding: "5px 0",
  },
  readingsName: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: "var(--text-dim)",
  },
};

/* ---------------------------------------------------------------------
   Animation + micro-interaction layer. Kept separate from the inline
   style objects above (which React needs for static layout) since
   hover states, keyframes, and pseudo-elements aren't expressible
   inline. Everything here is additive polish — no layout changes.
------------------------------------------------------------------------ */
const GLOBAL_CSS = `
@keyframes cl-fade-slide-down {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes cl-fade-slide-up {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes cl-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes cl-pop {
  0%   { transform: scale(0.4); opacity: 0; }
  60%  { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); }
}
@keyframes cl-spin {
  to { transform: rotate(360deg); }
}
@keyframes cl-run-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 190, 90, 0); }
  50%      { box-shadow: 0 0 0 5px rgba(255, 190, 90, 0.08); }
}
@keyframes cl-shake {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-3px); }
  40%      { transform: translateX(3px); }
  60%      { transform: translateX(-2px); }
  80%      { transform: translateX(2px); }
}
@keyframes cl-dot-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.4; transform: scale(0.8); }
}
@keyframes cl-bar-grow {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}

.cl-toolbar { position: relative; }

/* project name field: animated underline on focus */
.cl-name-wrap { position: relative; }
.cl-name-input { transition: color 0.15s ease; }
.cl-name-underline {
  position: absolute;
  left: 0; right: 0; bottom: -3px;
  height: 2px;
  background: var(--primary);
  border-radius: 2px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}
.cl-name-input:focus ~ .cl-name-underline { transform: scaleX(1); }

.cl-stat-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--primary);
  animation: cl-dot-pulse 2.4s ease-in-out infinite;
  flex-shrink: 0;
}

/* buttons: consistent, subtle lift + glow */
.cl-btn {
  transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease,
    background 0.2s ease, border-color 0.2s ease, opacity 0.15s ease;
  will-change: transform;
}
.cl-btn:hover:not(:disabled) { transform: translateY(-1px); }
.cl-btn:active:not(:disabled) { transform: translateY(0) scale(0.97); }
.cl-btn:disabled { opacity: 0.6; cursor: default; transform: none; }

.cl-btn-save:hover:not(:disabled) {
  box-shadow: 0 4px 14px rgba(47, 214, 111, 0.35);
}

.cl-btn-ghost:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary) !important;
}

.cl-btn-run:hover:not(:disabled) {
  box-shadow: 0 4px 16px rgba(255, 190, 90, 0.25);
  background: rgba(255, 190, 90, 0.08);
}
.cl-btn-run-pulse { animation: cl-run-pulse 2.6s ease-in-out infinite; }
.cl-btn-run-active { border-color: var(--accent); opacity: 0.9; }
.cl-run-icon { display: inline-block; font-size: 11px; }
.cl-spin { animation: cl-spin 0.9s linear infinite; display: inline-block; }
.cl-spin-slow { animation: cl-spin 1.1s linear infinite; display: inline-block; }

.cl-btn-public {
  box-shadow: 0 0 0 3px rgba(47, 214, 111, 0.1);
}

.cl-save-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  animation: cl-fade-in 0.2s ease;
}
.cl-icon-pop { display: inline-block; animation: cl-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }

.cl-details-bar { animation: cl-fade-slide-down 0.2s ease; }
.cl-textarea { transition: border-color 0.15s ease, box-shadow 0.15s ease; }
.cl-textarea:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(47, 214, 111, 0.08); }

.cl-result-bar {
  animation: cl-fade-slide-down 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.cl-result-alert { animation: cl-fade-slide-down 0.25s cubic-bezier(0.4, 0, 0.2, 1), cl-shake 0.4s ease 0.25s; }

.cl-suggestion-row {
  animation: cl-fade-slide-up 0.25s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.cl-drop-target { box-shadow: inset 0 0 0 2px rgba(47, 214, 111, 0.35); transition: box-shadow 0.15s ease; }

.cl-readings-panel {
  animation: cl-fade-slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.cl-readings-row {
  animation: cl-fade-slide-up 0.25s cubic-bezier(0.4, 0, 0.2, 1) both;
  overflow: hidden;
  transition: background 0.15s ease;
  border-radius: 4px;
}
.cl-readings-row:hover { background: rgba(255, 255, 255, 0.03); }
.cl-readings-bar {
  position: absolute;
  left: 0; bottom: 0;
  height: 2px;
  border-radius: 2px;
  transform-origin: left;
  animation: cl-bar-grow 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
  opacity: 0.6;
}

.cl-loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text-faint);
  font-size: 12px;
  animation: cl-fade-in 0.2s ease;
}
.cl-loading-spinner {
  width: 22px; height: 22px;
  border-radius: 50%;
  border: 2px solid var(--border-bright);
  border-top-color: var(--primary);
  animation: cl-spin 0.7s linear infinite;
}
.cl-loading-text { font-family: var(--font-display); letter-spacing: 0.03em; }

@media (prefers-reduced-motion: reduce) {
  .cl-toolbar *, .cl-result-bar, .cl-suggestion-row, .cl-readings-panel,
  .cl-readings-row, .cl-details-bar, .cl-btn, .cl-stat-dot, .cl-spin,
  .cl-spin-slow, .cl-icon-pop, .cl-loading-spinner {
    animation: none !important;
    transition: none !important;
  }
}
`;