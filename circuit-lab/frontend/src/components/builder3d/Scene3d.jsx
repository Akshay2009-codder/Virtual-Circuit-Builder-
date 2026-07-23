import { useEffect, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, ContactShadows, Environment } from "@react-three/drei";
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
  onToggle,
  selectedTerminal,
  onRemove,
  cameraRef,
  poweredIds,
  readings,
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
    <Canvas camera={{ position: [3.4, 3.6, 5], fov: 46 }} dpr={[1, 2]} shadows gl={{ toneMappingExposure: 1.25 }}>
      <color attach="background" args={["#0a0e13"]} />
      <fog attach="fog" args={["#0a0e13", 9, 26]} />

      {/* hemisphere ambient reads far less flat than a single flat ambientLight */}
      <hemisphereLight args={["#8fb8ff", "#1a120a", 0.6]} />
      <directionalLight position={[5, 8, 4]} intensity={1.25} castShadow />
      <directionalLight position={[-4, 3, -3]} intensity={0.4} color="#ff6f5e" />
      <pointLight position={[0, 3, 0]} intensity={0.25} color="#2fd66f" />
      {/* soft fill from near the camera so the face we're looking at isn't underlit */}
      <pointLight position={[2, 2, 4]} intensity={0.35} color="#ffffff" />

      <CameraCapture cameraRef={cameraRef} />

      <Suspense fallback={null}>
        {/* gives metal/glossy part materials (leads, pins, terminals) something
            to actually reflect - without this they render flat and dull */}
        <Environment preset="city" background={false} />
      </Suspense>

      {/* wooden workbench desk beneath everything */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[16, 48]} />
        <meshStandardMaterial color="#2a1f18" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* inset breadboard-style working surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#132018" roughness={0.7} metalness={0.05} />
      </mesh>

      <Grid
        args={[12, 12]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#2a3a2f"
        sectionSize={2.5}
        sectionThickness={1}
        sectionColor="#1f9a51"
        fadeDistance={13}
        fadeStrength={1.4}
        position={[0, 0.001, 0]}
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
          onToggle={onToggle}
          powered={poweredIds ? poweredIds.has(n.id) : false}
          reading={readings ? readings[n.id] : null}
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

      <ContactShadows position={[0, 0.008, 0]} opacity={0.45} scale={12} blur={2.2} far={4} />

      <OrbitControls
        makeDefault
        enabled={!draggingId}
        minDistance={2.2}
        maxDistance={16}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  );
}