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
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error

  const [draggingId, setDraggingId] = useState(null);
  const [selectedTerminal, setSelectedTerminal] = useState(null);

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
        setNodes(p.circuit_json.nodes || []);
        setEdges(p.circuit_json.edges || []);
      })
      .finally(() => setLoading(false));
  }, [id]);

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
      if (projectId) {
        await client.put(`/projects/${projectId}`, { name: projectName, circuit_json });
      } else {
        const res = await client.post("/projects", { name: projectName, circuit_json });
        setProjectId(res.data.project.id);
        navigate(`/builder/${res.data.project.id}`, { replace: true });
      }
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1500);
    } catch {
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 1500);
    }
  }

  return (
    <AppShell>
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 65px)" }}>
        <div style={styles.toolbar}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              style={styles.nameInput}
            />
            <span style={styles.statText}>
              {nodes.length} components · {edges.length} connections
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <SaveStatus state={saveState} />
            <button onClick={handleSave} style={styles.saveBtn}>
              Save circuit
            </button>
          </div>
        </div>

        <div style={styles.hintBar}>
          <span style={styles.hint}>
            Drag a part onto the board · drag a placed part to move it · click two glowing terminal dots
            to wire them · drag empty space to orbit, scroll to zoom
          </span>
        </div>

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

const styles = {
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
    borderBottom: "1px solid var(--border)",
    background: "var(--surface)",
  },
  nameInput: {
    background: "transparent",
    border: "none",
    color: "var(--text)",
    fontSize: 16,
    fontWeight: 600,
    outline: "none",
    fontFamily: "var(--font-body)",
    minWidth: 200,
  },
  statText: {
    color: "var(--text-faint)",
    fontSize: 12,
    fontFamily: "var(--font-display)",
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