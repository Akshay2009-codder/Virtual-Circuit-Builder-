import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import ComponentPalette from "../components/builder/ComponentPalette";
import Scene3D from "../components/builder3d/Scene3D";
import { screenToGround } from "../components/builder3d/raycast";
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
  }

  function onDrop(e) {
    e.preventDefault();
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

  async function handleRunCircuit() {
    setSimRunning(true);
    setSimResult(null);
    try {
      const pid = await handleSave(); // always save first so the simulation reads the current layout
      if (!pid) return;
      const res = await client.post(`/projects/${pid}/simulate`);
      setSimResult(res.data);
    } catch {
      setSimResult({ status: "error", message: "Couldn't run the simulation. Try again.", poweredIds: [] });
    } finally {
      setSimRunning(false);
    }
  }

  return (
    <AppShell>
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 65px)" }}>
        <div style={styles.toolbar}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              style={styles.nameInput}
              placeholder="Untitled Circuit"
            />
            <button style={styles.detailsToggle} onClick={() => setShowDetails((s) => !s)}>
              {showDetails ? "Hide details" : description ? "Edit details" : "+ Add details"}
            </button>
            <span style={styles.statText}>
              {nodes.length} components · {edges.length} connections
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <SaveStatus state={saveState} />
            <button onClick={handleSave} style={styles.saveBtn}>
              Save circuit
            </button>
            <button onClick={handleRunCircuit} style={styles.runBtn} disabled={simRunning}>
              {simRunning ? "Running…" : "▶ Run circuit"}
            </button>
          </div>
        </div>

        {showDetails && (
          <div style={styles.detailsBar}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this circuit do? e.g. 'ESP32-based temperature monitor that lights an LED above 30°C.'"
              style={styles.descInput}
              rows={2}
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
          <div style={{ ...styles.resultBar, ...RESULT_STYLE[simResult.status] }}>
            <span>{RESULT_ICON[simResult.status] || "ℹ"}</span>
            <span>{simResult.message}</span>
          </div>
        )}

        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
          <div ref={wrapperRef} style={{ flex: 1, position: "relative" }} onDragOver={onDragOver} onDrop={onDrop}>
            {!loading && (
              <Scene3D
                nodes={nodes}
                edges={edges}
                draggingId={draggingId}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
                onTerminalClick={handleTerminalClick}
                selectedTerminal={selectedTerminal}
                onRemove={handleRemove}
                cameraRef={cameraRef}
                poweredIds={simResult ? new Set(simResult.poweredIds) : null}
              />
            )}
          </div>

          <ComponentPalette components={components} loading={loading} />
        </div>
      </div>
    </AppShell>
  );
}

function SaveStatus({ state }) {
  if (state === "idle") return null;
  const label = { saving: "Saving…", saved: "Saved", error: "Couldn't save" }[state];
  const color = state === "error" ? "var(--danger)" : "var(--primary)";
  return (
    <span className="mono" style={{ fontSize: 12, color }}>
      {label}
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
};