import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import ComponentPalette from "../components/builder/ComponentPalette";
import Scene3D from "../components/builder3d/Scene3D";
import { screenToGround } from "../components/builder3d/raycast";
import ShareModal from "../components/ShareModal";
import BoardCodeEditor from "../components/builder/BoardCodeEditor";
import MeasurementsPanel from "../components/builder/MeasurementsPanel";
import client from "../api/client";

let idCounter = 1;
const nextId = () => `n${idCounter++}`;

const LIVE_TICK_MS = 150;

export default function Builder() {
  const { id } = useParams(); // undefined => new project
  const navigate = useNavigate();
  const location = useLocation();
  const sharedState = location.state?.fromShared ? location.state : null;
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

  // Which board (ESP32 etc) has its code editor open, if any
  const [codeEditorNodeId, setCodeEditorNodeId] = useState(null);
  // Latest per-pin voltages from the last live-code tick, keyed "nodeId::terminal"
  const pinVoltagesRef = useRef({});
  const liveTickTimerRef = useRef(null);
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  nodesRef.current = nodes;
  edgesRef.current = edges;

  // Load the component catalog for the palette
  useEffect(() => {
    client.get("/components").then((res) => setComponents(res.data.components));
  }, []);

  // Load an existing project if editing one, OR a demo/shared circuit
  // passed via router state from Share.jsx (which has no real project id
  // to fetch - see DEMO_PROJECTS in Share.jsx). Without this, navigating
  // here from a shared demo card opened an empty Builder.
  useEffect(() => {
    if (sharedState) {
      setProjectName(sharedState.projectName || "Shared Circuit");
      setDescription(sharedState.ownerName ? `Shared by ${sharedState.ownerName}` : "");
      if (sharedState.ownerName) setShowDetails(true);
      setNodes(sharedState.circuit?.nodes || []);
      setEdges(sharedState.circuit?.edges || []);
      setProjectId(null); // treat as a new, unsaved project - "Save circuit" will create your own copy
      setLoading(false);
      return;
    }
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
      .catch(() => {
        setProjectName("Couldn't load this circuit");
        setDescription("This circuit doesn't exist, or you don't have access to it.");
        setShowDetails(true);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // any edit invalidates the last simulation result
  useEffect(() => {
    setSimResult(null);
  }, [nodes, edges]);

  useEffect(() => {
    return () => {
      if (liveTickTimerRef.current) clearInterval(liveTickTimerRef.current);
    };
  }, []);

  // Undo/redo history - snapshots of {nodes, edges} taken before each
  // mutating action. Capped so it doesn't grow forever on a long session.
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const HISTORY_LIMIT = 50;

  function pushHistory() {
    setPast((p) => [...p.slice(-HISTORY_LIMIT + 1), { nodes, edges }]);
    setFuture([]);
  }

  function handleUndo() {
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    setFuture((f) => [{ nodes, edges }, ...f].slice(0, HISTORY_LIMIT));
    setPast((p) => p.slice(0, -1));
    setNodes(prev.nodes);
    setEdges(prev.edges);
    setSelectedTerminal(null);
  }

  function handleRedo() {
    if (future.length === 0) return;
    const next = future[0];
    setPast((p) => [...p, { nodes, edges }].slice(-HISTORY_LIMIT));
    setFuture((f) => f.slice(1));
    setNodes(next.nodes);
    setEdges(next.edges);
    setSelectedTerminal(null);
  }

  useEffect(() => {
    function onKeyDown(e) {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return; // don't hijack text field undo
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (e.key.toLowerCase() === "y" || (e.key.toLowerCase() === "z" && e.shiftKey)) {
        e.preventDefault();
        handleRedo();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [past, future, nodes, edges]);

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

    pushHistory();
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
        pins: component.spec?.pins || undefined,
        on: component.key === "switch" || component.key === "dip_switch" ? true : undefined,
        x: Math.round(x / 0.5) * 0.5,
        z: Math.round(z / 0.5) * 0.5,
      })
    );
  }

  function handleDragStart(nodeId) {
    pushHistory();
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
    pushHistory();
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.sourceId !== nodeId && e.targetId !== nodeId));
    setSelectedTerminal((sel) => (sel && sel.nodeId === nodeId ? null : sel));
    if (codeEditorNodeId === nodeId) setCodeEditorNodeId(null);
  }

  function handleToggle(nodeId) {
    pushHistory();
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
    pushHistory();
    setEdges((eds) =>
      eds.concat({
        id: nextId(),
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
      pinVoltagesRef.current = res.data.pinVoltages || {};
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

  function handleSaveCode(nodeId, code) {
    setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, code } : n)));
  }

  function getLivePinVoltage(nodeId, terminal) {
    return pinVoltagesRef.current[`${nodeId}::${terminal}`] || 0;
  }

  // Called ~every 150ms while a board's code is running (see
  // BoardCodeEditor). Solves the circuit with that board's current
  // pin_states patched in, WITHOUT touching the saved project - this hits
  // /simulate/live, not /simulate, so it never bumps run_count or saves.
  async function handleLivePinsChange(nodeId, pinStates) {
    if (!projectId) return; // save the project first before running code
    const patchedNodes = nodesRef.current.map((n) => (n.id === nodeId ? { ...n, pin_states: pinStates } : n));
    try {
      const res = await client.post(`/projects/${projectId}/simulate/live`, {
        nodes: patchedNodes,
        edges: edgesRef.current,
      });
      setSimResult(res.data);
      pinVoltagesRef.current = res.data.pinVoltages || {};
    } catch {
      // transient network hiccup during a live tick - ignore, next tick will retry
    }
  }

  const codeEditorNode = codeEditorNodeId ? nodes.find((n) => n.id === codeEditorNodeId) : null;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <AppShell>
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 65px)", position: "relative" }}>
          {/* Ambient background glow - a very low-opacity radial wash behind
              the whole shell so floating panels have something to sit
              "above" instead of a flat single-color page. */}
          <div className="cl-ambient-bg" />

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
              <PowerIndicator status={simResult?.status} running={simRunning} />
              <button
                onClick={handleUndo}
                disabled={past.length === 0}
                style={{ ...styles.shareBtn, opacity: past.length === 0 ? 0.4 : 1 }}
                title="Undo (Ctrl+Z)"
              >
                ↶ Undo
              </button>
              <button
                onClick={handleRedo}
                disabled={future.length === 0}
                style={{ ...styles.shareBtn, opacity: future.length === 0 ? 0.4 : 1 }}
                title="Redo (Ctrl+Y)"
              >
                ↷ Redo
              </button>
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

          <div style={{ flex: 1, display: "flex", minHeight: 0, gap: 14, padding: "0 16px 16px" }}>
            <div
              ref={wrapperRef}
              style={{ flex: 1, position: "relative" }}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`cl-bench ${isDropTarget ? "cl-drop-target" : ""}`}
            >
              <div className="cl-bench-grid" />
              <span className="cl-corner cl-corner-tl" />
              <span className="cl-corner cl-corner-tr" />
              <span className="cl-corner cl-corner-bl" />
              <span className="cl-corner cl-corner-br" />
              <div className="cl-bench-scanline" />

              {/* Hint bar - now a small floating pill anchored to the bench
                  itself instead of a full-width flat strip pinned above it.
                  Reads as a HUD element over the viewport, not another row
                  stacked in the page's document flow. */}
              <div className="cl-hint-pill">
                <span className="cl-hint-dot" />
                Drag a part onto the board · drag to move · click two terminals to wire · double-click for name ·{" "}
                {"</>"} on a board for code · drag empty space to orbit
              </div>

              {/* Result toast - floats over the top-center of the viewport
                  instead of docking as a full-width bar between the toolbar
                  and the bench. Feels like a HUD readout from the
                  simulation, not another flat divider in the page. */}
              {simResult && (
                <div
                  key={simResult.status + (simResult.message || "")}
                  style={{ ...styles.resultToast, ...RESULT_STYLE[simResult.status] }}
                  className={`cl-result-toast ${simResult.status === "short" ? "cl-result-alert" : ""}`}
                >
                  <span className={simResult.status === "complete" ? "cl-icon-pop" : ""}>
                    {RESULT_ICON[simResult.status] || "ℹ"}
                  </span>
                  <span>{simResult.message}</span>
                </div>
              )}

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
                  onOpenCode={(nodeId) => setCodeEditorNodeId(nodeId)}
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
            </div>

            {/* Measurements panel: only shown once you've run the circuit (or
                while it's running) - was previously always mounted, which
                showed an empty/stale panel before any simulation had happened. */}
            {(simResult || simRunning) && (
              <MeasurementsPanel simResult={simResult} nodes={nodes} simRunning={simRunning} />
            )}

            <ComponentPalette components={components} loading={loading} />
          </div>
        </div>
      </AppShell>

      {codeEditorNode && (
        <BoardCodeEditor
          node={codeEditorNode}
          onClose={() => setCodeEditorNodeId(null)}
          onSaveCode={handleSaveCode}
          onLivePinsChange={handleLivePinsChange}
          getLivePinVoltage={getLivePinVoltage}
        />
      )}

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

function PowerIndicator({ status, running }) {
  // off = no sim yet, otherwise reflect the health of the last run — like the
  // power LED on a real bench supply.
  const map = {
    complete: { color: "#2fd66f", label: "Powered", cls: "cl-led-on" },
    open: { color: "#ffc94d", label: "Open loop", cls: "cl-led-amber" },
    short: { color: "#ff4757", label: "Short circuit", cls: "cl-led-short" },
    no_source: { color: "#7a8a99", label: "No source", cls: "cl-led-dim" },
    error: { color: "#ff4757", label: "Fault", cls: "cl-led-amber" },
  };
  const cfg = running ? { color: "#ffc94d", label: "Testing…", cls: "cl-led-testing" } : map[status];
  const dim = !running && !status;

  return (
    <span className="cl-power-indicator" title={cfg?.label || "No test run yet"}>
      <span
        className={`cl-led ${dim ? "cl-led-dim" : cfg.cls}`}
        style={{ "--led-color": dim ? "#3a4650" : cfg.color }}
      />
      <span className="cl-power-label">{dim ? "Idle" : cfg.label}</span>
    </span>
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
  complete: { color: "var(--primary)", borderColor: "var(--primary)" },
  open: { color: "var(--gold)", borderColor: "var(--gold)" },
  short: { color: "var(--danger)", borderColor: "var(--danger)" },
  no_source: { color: "var(--text-dim)", borderColor: "var(--border-bright)" },
  error: { color: "var(--danger)", borderColor: "var(--danger)" },
};

const styles = {
  toolbar: {
    position: "relative",
    zIndex: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "14px 16px 0",
    padding: "12px 20px",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border-bright)",
    background: "color-mix(in srgb, var(--surface) 88%, transparent)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    boxShadow: "0 10px 30px -8px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.02) inset",
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
    background: "linear-gradient(180deg, color-mix(in srgb, var(--primary) 100%, white 8%), var(--primary))",
    color: "#062011",
    border: "none",
    borderRadius: "var(--radius-sm)",
    padding: "8px 18px",
    fontSize: 13.5,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 3px 10px -2px rgba(47,214,111,0.45), 0 1px 0 rgba(255,255,255,0.25) inset",
  },
  runBtn: {
    background: "color-mix(in srgb, var(--accent) 8%, transparent)",
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
    boxShadow: "0 2px 8px -2px rgba(255,111,94,0.3)",
  },
  shareBtn: {
    background: "var(--surface-2)",
    color: "var(--text-dim)",
    border: "1.5px solid var(--border-bright)",
    borderRadius: "var(--radius-sm)",
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  publishBtn: {
    background: "var(--surface-2)",
    border: "1.5px solid",
    borderRadius: "var(--radius-sm)",
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  resultToast: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 18px",
    borderRadius: 999,
    border: "1px solid",
    background: "color-mix(in srgb, var(--surface) 85%, transparent)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    fontSize: 12.5,
    fontWeight: 500,
    boxShadow: "0 12px 28px -8px rgba(0,0,0,0.55)",
  },
  detailsBar: {
    position: "relative",
    zIndex: 5,
    margin: "10px 16px 0",
    padding: "10px 20px",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
    background: "color-mix(in srgb, var(--surface) 88%, transparent)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    boxShadow: "0 8px 20px -8px rgba(0,0,0,0.4)",
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
};

/* ---------------------------------------------------------------------
   Animation + depth layer. Kept separate from the inline style objects
   above (which React needs for static layout) since hover states,
   keyframes, gradients, and pseudo-elements aren't expressible inline.
------------------------------------------------------------------------ */
const GLOBAL_CSS = `
@keyframes cl-fade-slide-down {
  from { opacity: 0; transform: translate(-50%, -10px); }
  to   { opacity: 1; transform: translate(-50%, 0); }
}
@keyframes cl-fade-slide-down-block {
  from { opacity: 0; transform: translateY(-6px); }
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
  0%, 100% { box-shadow: 0 2px 8px -2px rgba(255,111,94,0.3), 0 0 0 0 rgba(255, 190, 90, 0); }
  50%      { box-shadow: 0 2px 8px -2px rgba(255,111,94,0.3), 0 0 0 5px rgba(255, 190, 90, 0.08); }
}
@keyframes cl-shake {
  0%, 100% { transform: translate(-50%, 0); }
  20%      { transform: translate(calc(-50% - 3px), 0); }
  40%      { transform: translate(calc(-50% + 3px), 0); }
  60%      { transform: translate(calc(-50% - 2px), 0); }
  80%      { transform: translate(calc(-50% + 2px), 0); }
}
@keyframes cl-dot-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.4; transform: scale(0.8); }
}
@keyframes cl-ambient-drift {
  0%, 100% { transform: translate(0, 0); }
  50%      { transform: translate(-2%, 1.5%); }
}

/* Very low-opacity radial wash behind the whole shell - gives the
   floating panels something to sit "above" instead of one flat color
   filling the entire page edge to edge. */
.cl-ambient-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 60% 45% at 18% 0%, rgba(47, 214, 111, 0.07), transparent 60%),
    radial-gradient(ellipse 50% 40% at 100% 100%, rgba(255, 111, 94, 0.05), transparent 60%);
  animation: cl-ambient-drift 22s ease-in-out infinite;
}

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

.cl-btn {
  transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease,
    background 0.2s ease, border-color 0.2s ease, opacity 0.15s ease;
  will-change: transform;
}
.cl-btn:hover:not(:disabled) { transform: translateY(-1px); }
.cl-btn:active:not(:disabled) { transform: translateY(0) scale(0.97); }
.cl-btn:disabled { opacity: 0.6; cursor: default; transform: none; }

.cl-btn-save:hover:not(:disabled) {
  box-shadow: 0 6px 18px -2px rgba(47, 214, 111, 0.5), 0 1px 0 rgba(255,255,255,0.25) inset;
}

.cl-btn-ghost:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary) !important;
}

.cl-btn-run:hover:not(:disabled) {
  box-shadow: 0 6px 20px -2px rgba(255, 190, 90, 0.35);
  background: rgba(255, 190, 90, 0.1);
}
.cl-btn-run-pulse { animation: cl-run-pulse 2.6s ease-in-out infinite; }
.cl-btn-run-active { border-color: var(--accent); opacity: 0.9; }
.cl-run-icon { display: inline-block; font-size: 11px; }
.cl-spin { animation: cl-spin 0.9s linear infinite; display: inline-block; }
.cl-spin-slow { animation: cl-spin 1.1s linear infinite; display: inline-block; }

.cl-btn-public {
  box-shadow: 0 0 0 3px rgba(47, 214, 111, 0.12);
}

.cl-save-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  animation: cl-fade-in 0.2s ease;
}
.cl-icon-pop { display: inline-block; animation: cl-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }

.cl-details-bar { animation: cl-fade-slide-down-block 0.2s ease; }
.cl-textarea { transition: border-color 0.15s ease, box-shadow 0.15s ease; }
.cl-textarea:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(47, 214, 111, 0.08); }

/* Floating hint pill - anchored to the bottom-left of the viewport as a
   HUD readout, not a full-width strip stacked in the page flow. */
.cl-hint-pill {
  position: absolute;
  left: 14px;
  bottom: 14px;
  z-index: 4;
  max-width: calc(100% - 28px);
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid var(--border-bright);
  background: color-mix(in srgb, var(--surface) 78%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--text-faint);
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 7px;
  box-shadow: 0 10px 24px -10px rgba(0,0,0,0.55);
}
.cl-hint-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--text-faint);
  flex-shrink: 0;
}

/* Floating result toast - anchored top-center of the viewport. */
.cl-result-toast {
  position: absolute;
  top: 14px;
  left: 50%;
  z-index: 6;
  transform: translate(-50%, 0);
  animation: cl-fade-slide-down 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.cl-result-alert { animation: cl-fade-slide-down 0.3s cubic-bezier(0.4, 0, 0.2, 1), cl-shake 0.4s ease 0.3s; }

.cl-drop-target { box-shadow: inset 0 0 0 2px rgba(47, 214, 111, 0.35); transition: box-shadow 0.15s ease; }

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

@keyframes cl-led-blink {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.25; }
}
.cl-power-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px 4px 8px;
  border-radius: 999px;
  background: var(--surface-2);
  border: 1px solid var(--border);
}
.cl-led {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--led-color, #3a4650);
  box-shadow: 0 0 0 rgba(0,0,0,0);
  transition: background 0.25s ease, box-shadow 0.25s ease;
}
.cl-led-on { box-shadow: 0 0 6px 2px var(--led-color), 0 0 1px var(--led-color); }
.cl-led-amber { box-shadow: 0 0 5px 2px var(--led-color); animation: cl-led-blink 1.6s ease-in-out infinite; }
.cl-led-short { box-shadow: 0 0 6px 2px var(--led-color); animation: cl-led-blink 0.35s ease-in-out infinite; }
.cl-led-testing { box-shadow: 0 0 4px 1px var(--led-color); animation: cl-led-blink 0.6s ease-in-out infinite; }
.cl-led-dim { box-shadow: none; }
.cl-power-label {
  font-size: 10.5px;
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-faint);
  white-space: nowrap;
}

/* Bench viewport - now a proper elevated panel (rounded, shadowed,
   floating on its own margin) instead of a flat edge-to-edge rectangle
   glued directly to the toolbar and side panels. */
.cl-bench {
  position: relative;
  z-index: 1;
  overflow: hidden;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: 0 20px 50px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.02);
}
.cl-bench-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background-image:
    linear-gradient(rgba(47, 214, 111, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(47, 214, 111, 0.05) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse at center, black 55%, transparent 92%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 55%, transparent 92%);
}
.cl-bench-scanline {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  box-shadow: inset 0 0 90px rgba(0, 0, 0, 0.35);
}
.cl-corner {
  position: absolute;
  width: 22px; height: 22px;
  border-color: var(--border-bright);
  opacity: 0.6;
  pointer-events: none;
  z-index: 3;
  transition: border-color 0.2s ease, opacity 0.2s ease;
}
.cl-corner-tl { top: 10px; left: 10px; border-top: 2px solid; border-left: 2px solid; border-radius: 3px 0 0 0; }
.cl-corner-tr { top: 10px; right: 10px; border-top: 2px solid; border-right: 2px solid; border-radius: 0 3px 0 0; }
.cl-corner-bl { bottom: 10px; left: 10px; border-bottom: 2px solid; border-left: 2px solid; border-radius: 0 0 0 3px; }
.cl-corner-br { bottom: 10px; right: 10px; border-bottom: 2px solid; border-right: 2px solid; border-radius: 0 0 3px 0; }
.cl-drop-target .cl-corner { border-color: var(--primary); opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .cl-toolbar *, .cl-result-toast, .cl-details-bar, .cl-btn, .cl-stat-dot, .cl-spin,
  .cl-spin-slow, .cl-icon-pop, .cl-loading-spinner, .cl-led-amber,
  .cl-led-short, .cl-led-testing, .cl-ambient-bg {
    animation: none !important;
    transition: none !important;
  }
}
`;