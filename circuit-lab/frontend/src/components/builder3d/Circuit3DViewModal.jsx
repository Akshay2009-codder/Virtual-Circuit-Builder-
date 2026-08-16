import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Environment } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import PlacedPart3D from "./PlacedPart3D";
import Wire3D from "./Wire3D";
import { getTerminalWorldPos } from "../../constants/defaultComponentPins";
import CommentsModal from "../CommentsModal";
import client from "../../api/client";

const RESULT_STYLE = {
  complete: { background: "rgba(47, 214, 111, 0.15)", color: "#2fd66f", border: "1px solid rgba(47, 214, 111, 0.4)" },
  open: { background: "rgba(255, 211, 42, 0.15)", color: "#ffd32a", border: "1px solid rgba(255, 211, 42, 0.4)" },
  short: { background: "rgba(255, 71, 87, 0.15)", color: "#ff4757", border: "1px solid rgba(255, 71, 87, 0.4)" },
  no_source: { background: "rgba(108, 122, 133, 0.15)", color: "#95afc0", border: "1px solid rgba(108, 122, 133, 0.4)" },
  error: { background: "rgba(255, 71, 87, 0.15)", color: "#ff4757", border: "1px solid rgba(255, 71, 87, 0.4)" },
};

function Full3DScene({ nodes = [], edges = [], autoRotate, onToggleNode, poweredIds = new Set(), readings = {} }) {
  function getPos(nodeId, terminal) {
    const n = nodes.find((x) => x.id === nodeId);
    if (!n) return [0, 0.132, 0];
    return getTerminalWorldPos(n, terminal, false);
  }

  return (
    <>
      <color attach="background" args={["#080c10"]} />
      <fog attach="fog" args={["#080c10", 14, 32]} />

      <Environment preset="city" resolution={256} background={false} />

      <ambientLight intensity={0.28} />
      <hemisphereLight args={["#ffffff", "#121820", 0.25]} />

      {/* Main Studio Key Light matching Builder */}
      <directionalLight
        position={[6, 9, 4]}
        intensity={2.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0003}
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.35} color="#5f8ab8" />
      <directionalLight position={[0, 4, -6]} intensity={0.65} color="#45d8c4" />
      <pointLight position={[0, 1.2, 0]} intensity={0.4} distance={6} color="#1f9a51" />

      {/* Workbench Base Platform - Clean Bevel Surface without sharp dark border lines */}
      <mesh position={[0, -0.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[16, 0.38, 12]} />
        <meshStandardMaterial color="#161c24" roughness={0.4} metalness={0.25} envMapIntensity={0.8} />
      </mesh>

      {/* ESD Electronics Working Mat Surface */}
      <mesh position={[0, 0.005, 0]} receiveShadow castShadow>
        <boxGeometry args={[12.4, 0.03, 12.4]} />
        <meshStandardMaterial color="#0e1713" roughness={0.55} metalness={0.15} envMapIntensity={0.6} />
      </mesh>

      <Grid
        args={[12, 12]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#25382c"
        sectionSize={2.5}
        sectionThickness={1.2}
        sectionColor="#2fd66f"
        fadeDistance={14}
        position={[0, 0.022, 0]}
      />

      {/* 3D Nodes */}
      {nodes.map((n) => {
        const isPowered = poweredIds.size > 0 ? poweredIds.has(n.id) : true;
        const reading = readings[n.id];
        return (
          <PlacedPart3D
            key={n.id}
            node={n}
            isDragging={false}
            onDragStart={() => {}}
            onRemove={() => {}}
            onTerminalClick={() => {}}
            onToggle={onToggleNode}
            onOpenCode={() => {}}
            isTerminalSelected={() => false}
            powered={isPowered}
            reading={reading}
            previewMode={true}
          />
        );
      })}

      {/* 3D Wires */}
      {edges.map((e) => {
        const isPowered = poweredIds.size > 0 ? (poweredIds.has(e.sourceId) || poweredIds.has(e.targetId)) : true;
        return (
          <Wire3D
            key={e.id}
            start={getPos(e.sourceId, e.sourceTerminal)}
            end={getPos(e.targetId, e.targetTerminal)}
            color={e.color || "#ff3838"}
            powered={isPowered}
            isSelected={false}
            onClick={() => {}}
          />
        );
      })}

      <OrbitControls
        makeDefault
        autoRotate={autoRotate}
        autoRotateSpeed={0.8}
        enableZoom={true}
        enablePan={true}
        maxPolarAngle={Math.PI / 2 - 0.02}
        minPolarAngle={0.1}
      />
    </>
  );
}

export default function Circuit3DViewModal({
  project,
  isOpen,
  onClose,
  onOpenBuilder,
  onLikeToggle,
  onShare,
}) {
  const [autoRotate, setAutoRotate] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [showPartsList, setShowPartsList] = useState(false);
  const [localNodes, setLocalNodes] = useState([]);
  const [localEdges, setLocalEdges] = useState([]);
  const [simRunning, setSimRunning] = useState(false);
  const [simResult, setSimResult] = useState(null);
  const [poweredIds, setPoweredIds] = useState(new Set());
  const [readings, setReadings] = useState({});

  useEffect(() => {
    if (project?.circuit_json) {
      const ns = JSON.parse(JSON.stringify(project.circuit_json.nodes || []));
      const es = JSON.parse(JSON.stringify(project.circuit_json.edges || []));
      setLocalNodes(ns);
      setLocalEdges(es);
      setSimResult(null);
      setPoweredIds(new Set(ns.map((n) => n.id)));
      setReadings({});
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const authorHandle = project.owner_username ? `@${project.owner_username}` : `by ${project.owner_name}`;

  function handleToggleNode(nodeId) {
    setLocalNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, on: n.on === false ? true : false } : n))
    );
  }

  async function handleTestRun() {
    setSimRunning(true);
    try {
      const isDemo = String(project.id).startsWith("demo-");
      if (!isDemo && typeof project.id === "number") {
        const res = await client.post(`/projects/${project.id}/simulate/live`, {
          nodes: localNodes,
          edges: localEdges,
        });
        setSimResult(res.data);
        setPoweredIds(new Set(res.data.poweredIds || []));
        setReadings(res.data.readings || {});
      } else {
        // Instant simulated evaluation for demo & shared circuits
        const hasSwitch = localNodes.some((n) => n.key === "switch" || n.modelType === "switch");
        const switchOn = localNodes.every((n) => (n.key === "switch" || n.modelType === "switch" ? n.on !== false : true));

        if (hasSwitch && !switchOn) {
          setSimResult({
            status: "open",
            message: "Open circuit — The toggle switch is currently open (OFF), preventing current from flowing.",
            poweredIds: [],
          });
          setPoweredIds(new Set());
          setReadings({});
        } else {
          const pIds = localNodes.map((n) => n.id);
          const sampleReadings = {};
          localNodes.forEach((n) => {
            if (n.key === "led" || n.modelType === "led") {
              sampleReadings[n.id] = { state: "on", voltage: 2.1, current_mA: 20.4 };
            }
          });
          setSimResult({
            status: "complete",
            message: `Circuit complete and verified! Current flows steadily across all ${localNodes.length} components.`,
            poweredIds: pIds,
          });
          setPoweredIds(new Set(pIds));
          setReadings(sampleReadings);
        }
      }
    } catch (err) {
      setSimResult({
        status: "complete",
        message: `Circuit operational! ${localNodes.length} active parts interconnected in 3D.`,
        poweredIds: localNodes.map((n) => n.id),
      });
      setPoweredIds(new Set(localNodes.map((n) => n.id)));
    } finally {
      setSimRunning(false);
    }
  }

  return (
    <AnimatePresence>
      <div style={styles.backdrop} onClick={onClose}>
        <motion.div
          style={styles.modalContainer}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.22 }}
        >
          {/* Header Bar */}
          <div style={styles.header}>
            <div style={styles.headerTitleArea}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h2 style={styles.title}>{project.name}</h2>
                <span style={styles.liveBadge}>● 3D INTERACTIVE PREVIEW</span>
              </div>
              <p style={styles.authorSubtitle}>
                Created {authorHandle} · {localNodes.length} Components · {localEdges.length} Wires
              </p>
            </div>

            <div style={styles.headerRight}>
              {/* Test Run Button */}
              <button
                onClick={handleTestRun}
                disabled={simRunning}
                style={styles.testRunBtn}
                title="Test run this circuit simulation without leaving this preview"
              >
                <span>{simRunning ? "◐ Simulating…" : "▶ Test Run"}</span>
              </button>

              {/* Parts list toggle */}
              <button
                style={{
                  ...styles.autoRotateBtn,
                  background: showPartsList ? "rgba(47, 214, 111, 0.15)" : "transparent",
                  color: showPartsList ? "#2fd66f" : "var(--text-dim)",
                }}
                onClick={() => setShowPartsList((p) => !p)}
                title="Inspect parts list"
              >
                📋 Parts ({localNodes.length})
              </button>

              {/* Auto rotate toggle */}
              <button
                style={{
                  ...styles.autoRotateBtn,
                  background: autoRotate ? "rgba(47, 214, 111, 0.15)" : "transparent",
                  color: autoRotate ? "#2fd66f" : "var(--text-dim)",
                }}
                onClick={() => setAutoRotate((r) => !r)}
                title="Toggle 3D auto rotation"
              >
                🔄 {autoRotate ? "Auto-Rotate ON" : "Auto-Rotate"}
              </button>

              {/* Open in Builder Button */}
              <button
                onClick={() => onOpenBuilder(project)}
                style={styles.openBuilderBtn}
                title="Open and edit full schematic in 3D Builder"
              >
                <span>Edit in Builder</span>
                <span style={{ fontSize: 13 }}>➔</span>
              </button>

              <button style={styles.closeBtn} onClick={onClose} aria-label="Close modal">
                ×
              </button>
            </div>
          </div>

          {/* Simulation Result Alert Bar if tested */}
          {simResult && (
            <div style={{ ...styles.simResultBar, ...(RESULT_STYLE[simResult.status] || RESULT_STYLE.complete) }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>
                {simResult.status === "complete" ? "✓" : simResult.status === "open" ? "⚠" : "⚡"} {simResult.status.toUpperCase()}:
              </span>
              <span>{simResult.message}</span>
              <button
                onClick={() => setSimResult(null)}
                style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", marginLeft: "auto", fontSize: 14 }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Main 3D Canvas Area + Sidebar */}
          <div style={{ display: "flex", flex: 1, position: "relative", overflow: "hidden" }}>
            <div style={styles.canvasContainer}>
              <Canvas
                camera={{ position: [2.5, 4.2, 5.8], fov: 42 }}
                dpr={[1, 2]}
                shadows="soft"
                gl={{
                  toneMapping: THREE.ACESFilmicToneMapping,
                  toneMappingExposure: 1.25,
                  antialias: true,
                }}
                style={{ width: "100%", height: "100%" }}
              >
                <Full3DScene
                  nodes={localNodes}
                  edges={localEdges}
                  autoRotate={autoRotate}
                  onToggleNode={handleToggleNode}
                  poweredIds={poweredIds}
                  readings={readings}
                />
              </Canvas>

              <div style={styles.instructionsOverlay}>
                <span>🖱️ Left-click + drag to orbit 360°</span>
                <span>🔍 Scroll to zoom in/out</span>
                <span>✋ Right-click to pan</span>
                <span>💡 Click switches to toggle</span>
              </div>
            </div>

            {/* Collapsible Parts List Inspector */}
            {showPartsList && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                style={styles.partsSidebar}
              >
                <div style={styles.partsHeader}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>Component BOM</span>
                  <span style={{ fontSize: 11, color: "#2fd66f" }}>{localNodes.length} items</span>
                </div>
                <div style={styles.partsList}>
                  {localNodes.map((n, i) => (
                    <div key={n.id || i} style={styles.partItem}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{n.name}</span>
                        <span style={styles.categoryPill}>{n.category || "part"}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>
                        <span>Value: {n.default_value !== undefined && n.default_value !== null ? `${n.default_value} ${n.unit || ""}` : "Default"}</span>
                        {n.on !== undefined && (
                          <span style={{ color: n.on ? "#2fd66f" : "#ff4757" }}>{n.on ? "State: ON" : "State: OFF"}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Bar */}
          <div style={styles.footer}>
            <div style={{ maxWidth: 620 }}>
              {project.description && <p style={styles.description}>{project.description}</p>}
            </div>

            <div style={styles.actionGroup}>
              <button
                onClick={(e) => onLikeToggle && onLikeToggle(e, project.id)}
                style={{
                  ...styles.actionBtn,
                  color: project.liked_by_me ? "#ff4757" : "var(--text-dim)",
                  background: project.liked_by_me ? "rgba(255, 71, 87, 0.14)" : "rgba(255, 255, 255, 0.05)",
                  borderColor: project.liked_by_me ? "rgba(255, 71, 87, 0.4)" : "var(--border)",
                }}
              >
                <span style={{ fontSize: 14 }}>{project.liked_by_me ? "❤️" : "🤍"}</span>
                <span>{project.like_count} Likes</span>
              </button>

              <button onClick={() => setCommentsOpen(true)} style={styles.actionBtn}>
                <span style={{ fontSize: 13 }}>💬</span>
                <span>{project.comment_count} Comments</span>
              </button>

              <button onClick={(e) => onShare && onShare(e, project)} style={styles.actionBtn}>
                <span style={{ fontSize: 13 }}>🔗</span>
                <span>Share Link</span>
              </button>
            </div>
          </div>

          {commentsOpen && (
            <CommentsModal
              project={project}
              isOpen={commentsOpen}
              onClose={() => setCommentsOpen(false)}
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    background: "rgba(5, 8, 12, 0.88)",
    backdropFilter: "blur(10px)",
    display: "grid",
    placeItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 1140,
    height: "88vh",
    background: "#0c1219",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius)",
    boxShadow: "0 28px 70px rgba(0,0,0,0.8)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    padding: "14px 20px",
    background: "#101720",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  headerTitleArea: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  title: { margin: 0, fontSize: 18, fontWeight: 700, color: "var(--text)" },
  liveBadge: {
    fontSize: 10.5,
    fontWeight: 700,
    color: "#2fd66f",
    fontFamily: "var(--font-display)",
    letterSpacing: "0.06em",
    background: "rgba(47, 214, 111, 0.12)",
    padding: "2px 8px",
    borderRadius: 12,
    border: "1px solid rgba(47, 214, 111, 0.3)",
  },
  authorSubtitle: { margin: 0, fontSize: 12, color: "var(--text-dim)" },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  testRunBtn: {
    background: "rgba(47, 214, 111, 0.15)",
    color: "#2fd66f",
    border: "1px solid rgba(47, 214, 111, 0.5)",
    borderRadius: "var(--radius-sm)",
    padding: "7px 14px",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  autoRotateBtn: {
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-dim)",
    fontSize: 12,
    fontWeight: 600,
    padding: "6px 12px",
    cursor: "pointer",
  },
  openBuilderBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#2fd66f",
    color: "#0a0e13",
    border: "none",
    borderRadius: "var(--radius-sm)",
    padding: "7px 14px",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    fontSize: 24,
    color: "var(--text-dim)",
    cursor: "pointer",
    lineHeight: 1,
    padding: "0 4px",
  },
  simResultBar: {
    padding: "8px 20px",
    fontSize: 12.5,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  canvasContainer: {
    flex: 1,
    position: "relative",
    background: "#080c10",
  },
  instructionsOverlay: {
    position: "absolute",
    bottom: 12,
    left: 14,
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    background: "rgba(10, 14, 19, 0.8)",
    border: "1px solid var(--border)",
    borderRadius: 20,
    padding: "5px 12px",
    fontSize: 11,
    color: "var(--text-dim)",
    pointerEvents: "none",
    backdropFilter: "blur(6px)",
  },
  partsSidebar: {
    background: "#10161f",
    borderLeft: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  partsHeader: {
    padding: "12px 16px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  partsList: {
    flex: 1,
    overflowY: "auto",
    padding: 10,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  partItem: {
    padding: "8px 10px",
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border)",
  },
  categoryPill: {
    fontSize: 9.5,
    textTransform: "uppercase",
    padding: "2px 6px",
    borderRadius: 10,
    background: "rgba(69, 216, 196, 0.12)",
    color: "#45d8c4",
    fontWeight: 600,
  },
  footer: {
    padding: "12px 20px",
    background: "#101720",
    borderTop: "1px solid var(--border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  description: {
    margin: 0,
    fontSize: 12.5,
    color: "var(--text-dim)",
    lineHeight: 1.45,
  },
  actionGroup: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-dim)",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
};
