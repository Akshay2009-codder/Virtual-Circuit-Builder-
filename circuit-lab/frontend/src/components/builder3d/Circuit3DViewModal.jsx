import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import PlacedPart3D from "./PlacedPart3D";
import Wire3D from "./Wire3D";
import { getTerminalWorldPos } from "../../constants/defaultComponentPins";
import CommentsModal from "../CommentsModal";

function Full3DScene({ nodes = [], edges = [], autoRotate }) {
  function getPos(nodeId, terminal) {
    const n = nodes.find((x) => x.id === nodeId);
    if (!n) return [0, 0.132, 0];
    return getTerminalWorldPos(n, terminal, false);
  }

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[6, 9, 4]} intensity={2.8} castShadow />
      <directionalLight position={[-6, 4, -4]} intensity={0.5} color="#5f8ab8" />
      <pointLight position={[0, 1.2, 0]} intensity={0.4} distance={6} color="#1f9a51" />

      {/* Workbench Base Surface */}
      <mesh position={[0, -0.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[16, 0.38, 12]} />
        <meshStandardMaterial color="#161c24" roughness={0.4} metalness={0.25} />
      </mesh>

      <mesh position={[0, 0.005, 0]} receiveShadow castShadow>
        <boxGeometry args={[12.4, 0.03, 12.4]} />
        <meshStandardMaterial color="#0e1713" roughness={0.55} metalness={0.15} />
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
      {nodes.map((n) => (
        <PlacedPart3D
          key={n.id}
          node={n}
          isDragging={false}
          onDragStart={() => {}}
          onRemove={() => {}}
          onTerminalClick={() => {}}
          onToggle={() => {}}
          onOpenCode={() => {}}
          isTerminalSelected={() => false}
          powered={true}
        />
      ))}

      {/* 3D Wires */}
      {edges.map((e) => (
        <Wire3D
          key={e.id}
          startPos={getPos(e.sourceId, e.sourceTerminal)}
          endPos={getPos(e.targetId, e.targetTerminal)}
          color={e.color || "#ff3838"}
          isSelected={false}
          onClick={() => {}}
        />
      ))}

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
  const [autoRotate, setAutoRotate] = useState(true);
  const [commentsOpen, setCommentsOpen] = useState(false);

  if (!isOpen || !project) return null;

  const nodes = project.circuit_json?.nodes || [];
  const edges = project.circuit_json?.edges || [];
  const authorHandle = project.owner_username ? `@${project.owner_username}` : `by ${project.owner_name}`;

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
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h2 style={styles.title}>{project.name}</h2>
                <span style={styles.liveBadge}>● 3D INTERACTIVE VIEWER</span>
              </div>
              <p style={styles.authorSubtitle}>
                Created {authorHandle} · {nodes.length} Components · {edges.length} Wire Connections
              </p>
            </div>

            <div style={styles.headerRight}>
              <button
                style={{ ...styles.autoRotateBtn, background: autoRotate ? "rgba(47, 214, 111, 0.15)" : "transparent" }}
                onClick={() => setAutoRotate((r) => !r)}
                title="Toggle 3D auto rotation"
              >
                🔄 {autoRotate ? "Auto-Rotate ON" : "Auto-Rotate OFF"}
              </button>

              <button
                onClick={() => onOpenBuilder(project)}
                style={styles.openBuilderBtn}
                title="Open and edit in 3D Builder"
              >
                <span>Edit in 3D Builder</span>
                <span style={{ fontSize: 14 }}>➔</span>
              </button>

              <button style={styles.closeBtn} onClick={onClose}>
                ×
              </button>
            </div>
          </div>

          {/* 3D Interactive Canvas Area */}
          <div style={styles.canvasContainer}>
            <Canvas shadows camera={{ position: [0, 3.8, 5.2], fov: 45 }} style={{ width: "100%", height: "100%" }}>
              <Full3DScene nodes={nodes} edges={edges} autoRotate={autoRotate} />
            </Canvas>

            <div style={styles.instructionsOverlay}>
              <span>🖱️ Drag to rotate 360°</span>
              <span>🔍 Scroll to zoom in/out</span>
              <span>✋ Right-click to pan</span>
            </div>
          </div>

          {/* Footer Bar */}
          <div style={styles.footer}>
            <div style={{ maxWidth: 600 }}>
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
    background: "rgba(5, 8, 12, 0.85)",
    backdropFilter: "blur(8px)",
    display: "grid",
    placeItems: "center",
    padding: 24,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 1100,
    height: "85vh",
    background: "#0c1219",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    padding: "16px 24px",
    background: "#101720",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitleArea: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  title: { margin: 0, fontSize: 19, fontWeight: 700, color: "var(--text)" },
  liveBadge: {
    fontSize: 11,
    fontWeight: 700,
    color: "#2fd66f",
    fontFamily: "var(--font-display)",
    letterSpacing: "0.05em",
  },
  authorSubtitle: { margin: 0, fontSize: 12.5, color: "var(--text-dim)" },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
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
    gap: 8,
    background: "#2fd66f",
    color: "#0a0e13",
    border: "none",
    borderRadius: "var(--radius-sm)",
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    fontSize: 26,
    color: "var(--text-dim)",
    cursor: "pointer",
    lineHeight: 1,
    padding: "0 4px",
  },
  canvasContainer: {
    flex: 1,
    position: "relative",
    background: "radial-gradient(circle at center, #141c27 0%, #090e14 100%)",
  },
  instructionsOverlay: {
    position: "absolute",
    bottom: 14,
    left: 18,
    display: "flex",
    gap: 14,
    background: "rgba(10, 14, 19, 0.75)",
    border: "1px solid var(--border)",
    borderRadius: 20,
    padding: "5px 14px",
    fontSize: 11,
    color: "var(--text-dim)",
    pointerEvents: "none",
    backdropFilter: "blur(6px)",
  },
  footer: {
    padding: "16px 24px",
    background: "#101720",
    borderTop: "1px solid var(--border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
  },
  description: {
    margin: 0,
    fontSize: 13,
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
    padding: "8px 14px",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-dim)",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  },
};
