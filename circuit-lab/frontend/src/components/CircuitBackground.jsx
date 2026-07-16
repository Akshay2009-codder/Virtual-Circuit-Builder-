import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import AppShell from "../components/AppShell";
import ComponentPalette from "../components/builder/ComponentPalette";
import PartNode from "../components/builder/PartNode";
import client from "../api/client";

const nodeTypes = { part: PartNode };
let idCounter = 1;
const nextId = () => `n${idCounter++}`;

function BuilderCanvas() {
  const { id } = useParams(); // undefined => new project
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [components, setComponents] = useState([]);
  const [projectId, setProjectId] = useState(id ? Number(id) : null);
  const [projectName, setProjectName] = useState("Untitled Circuit");
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error

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

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, animated: true, style: { stroke: "var(--accent)", strokeWidth: 2 } }, eds)
      ),
    [setEdges]
  );

  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function onDrop(e) {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/circuitlab-component");
    if (!raw) return;
    const component = JSON.parse(raw);

    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });

    const newNode = {
      id: nextId(),
      type: "part",
      position,
      data: {
        key: component.key,
        name: component.name,
        category: component.category,
        unit: component.unit,
        default_value: component.default_value,
        component_id: component.id,
      },
    };
    setNodes((nds) => nds.concat(newNode));
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
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 65px)" }}>
      <div style={styles.toolbar}>
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          style={styles.nameInput}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <SaveStatus state={saveState} />
          <button onClick={handleSave} style={styles.saveBtn}>
            Save circuit
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <div ref={wrapperRef} style={{ flex: 1 }} onDragOver={onDragOver} onDrop={onDrop}>
          {!loading && (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              connectionMode={ConnectionMode.Loose}
              connectionRadius={40}
              fitView
              proOptions={{ hideAttribution: true }}
            >
              <Background color="var(--border)" gap={20} />
              <Controls showInteractive={false} />
              <MiniMap
                pannable
                zoomable
                nodeColor="var(--border-bright)"
                maskColor="rgba(10,14,19,0.7)"
                style={{ background: "var(--surface)" }}
              />
            </ReactFlow>
          )}
        </div>

        <ComponentPalette components={components} loading={loading} />
      </div>
    </div>
  );
}

function SaveStatus({ state }) {
  if (state === "idle") return null;
  const label = { saving: "Saving…", saved: "Saved", error: "Couldn't save" }[state];
  const color = state === "error" ? "var(--danger)" : "var(--accent)";
  return (
    <span className="mono" style={{ fontSize: 12, color }}>
      {label}
    </span>
  );
}

export default function Builder() {
  return (
    <AppShell>
      <ReactFlowProvider>
        <BuilderCanvas />
      </ReactFlowProvider>
    </AppShell>
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
  saveBtn: {
    background: "var(--primary)",
    color: "#1a1002",
    border: "none",
    borderRadius: "var(--radius-sm)",
    padding: "8px 18px",
    fontSize: 13.5,
    fontWeight: 600,
    cursor: "pointer",
  },
};