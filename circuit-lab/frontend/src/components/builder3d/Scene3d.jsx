import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import PlacedPart3D from "./PlacedPart3D";
import Wire3D from "./Wire3D";

function CameraCapture({ cameraRef }) {
  const { camera } = useThree();
  useEffect(() => {
    cameraRef.current = camera;
  }, [camera, cameraRef]);
  return null;
}

export default function Scene3D({
  nodes,
  edges,
  draggingId,
  onDragStart,
  onDragMove,
  onDragEnd,
  onTerminalClick,
  selectedTerminal,
  onRemove,
  cameraRef,
}) {
  function terminalWorldPos(nodeId, terminal) {
    const n = nodes.find((x) => x.id === nodeId);
    if (!n) return [0, 0.12, 0];
    const dx = terminal === "a" ? -0.55 : 0.55;
    return [n.x + dx, 0.12, n.z];
  }

  function handleGroundMove(e) {
    if (!draggingId) return;
    onDragMove(draggingId, e.point.x, e.point.z);
  }
  function handleGroundUp() {
    if (draggingId) onDragEnd();
  }

  return (
    <Canvas camera={{ position: [4, 4.5, 6], fov: 42 }} dpr={[1, 2]}>
      <color attach="background" args={["#0a0e13"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 3]} intensity={1} />
      <directionalLight position={[-4, 3, -3]} intensity={0.3} color="#ff6f5e" />

      <CameraCapture cameraRef={cameraRef} />

      <Grid
        args={[40, 40]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#232e3a"
        sectionSize={2.5}
        sectionThickness={1}
        sectionColor="#1f9a51"
        fadeDistance={22}
        fadeStrength={1.2}
        infiniteGrid
      />

      {/* invisible floor - captures drag movement for placed parts */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerMove={handleGroundMove}
        onPointerUp={handleGroundUp}
        onPointerLeave={handleGroundUp}
      >
        <planeGeometry args={[60, 60]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {nodes.map((n) => (
        <PlacedPart3D
          key={n.id}
          node={n}
          isDragging={draggingId === n.id}
          onDragStart={onDragStart}
          onRemove={onRemove}
          onTerminalClick={onTerminalClick}
          isTerminalSelected={(id, t) =>
            selectedTerminal && selectedTerminal.nodeId === id && selectedTerminal.terminal === t
          }
        />
      ))}

      {edges.map((e) => (
        <Wire3D
          key={e.id}
          start={terminalWorldPos(e.sourceId, e.sourceTerminal)}
          end={terminalWorldPos(e.targetId, e.targetTerminal)}
        />
      ))}

      <OrbitControls
        makeDefault
        enabled={!draggingId}
        minDistance={2.5}
        maxDistance={18}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  );
}