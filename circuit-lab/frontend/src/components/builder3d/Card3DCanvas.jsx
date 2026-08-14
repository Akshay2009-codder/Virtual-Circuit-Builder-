import React, { Component } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import PlacedPart3D from "./PlacedPart3D";
import Wire3D from "./Wire3D";
import { getTerminalWorldPos } from "../../constants/defaultComponentPins";

class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.warn("Card3DCanvas render warning:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
            background: "#0e151d",
            color: "var(--text-dim)",
            fontSize: 12,
            fontFamily: "var(--font-display)",
          }}
        >
          ⚡ 3D Preview (Click to view in Builder)
        </div>
      );
    }
    return this.props.children;
  }
}

function MiniScene({ nodes = [], edges = [] }) {
  function getPos(nodeId, terminal) {
    const n = nodes.find((x) => x.id === nodeId);
    if (!n) return [0, 0.132, 0];
    return getTerminalWorldPos(n, terminal, false);
  }

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[6, 9, 4]} intensity={2.4} castShadow />
      <directionalLight position={[-6, 4, -4]} intensity={0.5} color="#5f8ab8" />
      <pointLight position={[0, 1.2, 0]} intensity={0.4} distance={6} color="#1f9a51" />

      {/* Workbench Base Surface */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[14, 0.2, 10]} />
        <meshStandardMaterial color="#161c24" roughness={0.4} metalness={0.2} />
      </mesh>

      <Grid
        args={[10, 10]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#1d2e24"
        sectionSize={2}
        sectionThickness={1.2}
        sectionColor="#2fd66f"
        fadeDistance={10}
        position={[0, 0.01, 0]}
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
          onOpenCode={null}
          isTerminalSelected={() => false}
          powered={true}
          previewMode={true}
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
        autoRotate
        autoRotateSpeed={0.8}
        enableZoom={false}
        maxPolarAngle={Math.PI / 2 - 0.08}
        minPolarAngle={Math.PI / 6}
      />
    </>
  );
}

export default function Card3DCanvas({ nodes = [], edges = [], height = 210, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: "100%",
        height: height,
        position: "relative",
        borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
        overflow: "hidden",
        background: "linear-gradient(180deg, #0b1117 0%, #121922 100%)",
        borderBottom: "1px solid var(--border-bright)",
        cursor: "pointer",
      }}
    >
      <CanvasErrorBoundary>
        <Canvas
          shadows
          camera={{ position: [0, 3.2, 4.2], fov: 45 }}
          style={{ width: "100%", height: "100%", cursor: "grab" }}
        >
          <MiniScene nodes={nodes} edges={edges} />
        </Canvas>
      </CanvasErrorBoundary>

      <div
        style={{
          position: "absolute",
          top: 10,
          right: 12,
          background: "rgba(10, 14, 19, 0.8)",
          border: "1px solid rgba(47, 214, 111, 0.4)",
          borderRadius: 20,
          padding: "4px 11px",
          fontSize: 10,
          fontWeight: 700,
          fontFamily: "var(--font-display)",
          color: "#2fd66f",
          letterSpacing: "0.05em",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          gap: 5,
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#2fd66f",
            boxShadow: "0 0 6px #2fd66f",
          }}
        />
        3D LIVE VIEW ➔
      </div>
    </div>
  );
}
