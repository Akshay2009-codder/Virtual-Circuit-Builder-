import { useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, ContactShadows, Environment } from "@react-three/drei";
import PlacedPart3D from "./PlacedPart3D";
import Wire3D from "./Wire3D";

const BOARD_X_OFFSET = 0.85;
const BOARD_PIN_PITCH = 0.16;

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
  onOpenCode,
  selectedTerminal,
  onRemove,
  cameraRef,
  poweredIds,
  readings,
}) {
  function terminalWorldPos(nodeId, terminal) {
    const n = nodes.find((x) => x.id === nodeId);
    if (!n) return [0, 0.1, 0];

    if (Array.isArray(n.pins) && n.pins.length > 0) {
      const pin = n.pins.find((p) => p.terminal === terminal);
      if (pin) {
        const col = n.pins.filter((p) => p.side === pin.side);
        const count = col.length;
        const idxInCol = pin.order ?? col.findIndex((p) => p.terminal === pin.terminal);
        const z = n.z + (idxInCol - (count - 1) / 2) * BOARD_PIN_PITCH;
        const x = n.x + (pin.side === "left" ? -BOARD_X_OFFSET : BOARD_X_OFFSET);
        return [x, 0.1, z];
      }
    }

    if (terminal === "a") return [n.x - 0.55, 0.1, n.z];
    if (terminal === "b") return [n.x + 0.55, 0.1, n.z];

    console.warn(`terminalWorldPos: unrecognized terminal "${terminal}" on node ${nodeId}`);
    return [n.x, 0.1, n.z];
  }

  function handleGroundMove(e) {
    if (!draggingId) return;
    onDragMove(draggingId, e.point.x, e.point.z);
  }
  function handleGroundUp() {
    if (draggingId) onDragEnd();
  }

  return (
    <Canvas
      camera={{ position: [2.5, 4.2, 5.8], fov: 42 }}
      dpr={[1, 2]}
      shadows="soft"
      gl={{
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.25,
        antialias: true,
      }}
    >
      <color attach="background" args={["#080c10"]} />
      <fog attach="fog" args={["#080c10", 14, 32]} />

      <Environment preset="city" resolution={256} background={false} />

      <ambientLight intensity={0.28} />
      <hemisphereLight args={["#ffffff", "#121820", 0.25]} />

      {/* Main Studio Key Light - strong angled sun casting realistic 3D component shadows */}
      <directionalLight
        position={[6, 9, 4]}
        intensity={2.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0003}
      />
      {/* Cool fill light picking out shadow details */}
      <directionalLight position={[-6, 4, -4]} intensity={0.35} color="#5f8ab8" />
      {/* Rim light defining 3D contours and silhouettes of parts */}
      <directionalLight position={[0, 4, -6]} intensity={0.65} color="#45d8c4" />
      {/* Under-bench ambient accent glow */}
      <pointLight position={[0, 1.2, 0]} intensity={0.4} distance={6} color="#1f9a51" />

      <CameraCapture cameraRef={cameraRef} />

      {/* Physical 3D Laboratory Workbench Table Top */}
      <mesh position={[0, -0.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[16, 0.38, 12]} />
        <meshStandardMaterial color="#161c24" roughness={0.4} metalness={0.25} envMapIntensity={0.8} />
      </mesh>

      {/* Raised 3D ESD Electronics Working Surface */}
      <mesh position={[0, 0.005, 0]} receiveShadow castShadow>
        <boxGeometry args={[12.3, 0.03, 12.3]} />
        <meshStandardMaterial color="#0e1713" roughness={0.55} metalness={0.15} envMapIntensity={0.6} />
      </mesh>

      {/* Metallic Border Bezel around Working Surface */}
      <mesh position={[0, 0.008, 0]}>
        <ringGeometry args={[6.15, 6.22, 4]} />
        <meshStandardMaterial color="#35465a" metalness={0.85} roughness={0.2} envMapIntensity={1.2} />
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
        fadeStrength={1.5}
        position={[0, 0.022, 0]}
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
          onOpenCode={onOpenCode}
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
          powered={poweredIds ? (poweredIds.has(e.sourceId) || poweredIds.has(e.targetId)) : false}
        />
      ))}

      <ContactShadows position={[0, 0.022, 0]} opacity={0.75} scale={13} blur={1.5} far={3} resolution={1024} />

      <OrbitControls
        makeDefault
        enabled={!draggingId}
        enableDamping
        dampingFactor={0.08}
        minDistance={2.0}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  );
}