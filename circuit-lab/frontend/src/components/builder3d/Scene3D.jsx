import { useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, ContactShadows, Environment } from "@react-three/drei";
import PlacedPart3D from "./PlacedPart3D";
import Wire3D from "./Wire3D";
import { getWireAutoColor } from "../../constants/defaultComponentPins";

const BOARD_X_OFFSET = 0.255;
const BOARD_PIN_PITCH = 0.051;

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
  onRemoveEdge,
  cameraRef,
  poweredIds,
  readings,
  activeWireColor,
}) {
  const [mouseWorldPos, setMouseWorldPos] = useState(null);
  const [isMouseHovering, setIsMouseHovering] = useState(false);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);

  function terminalWorldPos(nodeId, terminal) {
    const n = nodes.find((x) => x.id === nodeId);
    if (!n) return [0, 0.16, 0];

    const isLifted = draggingId === nodeId;
    const baseHeight = isLifted ? 0.28 : 0.16;

    if (Array.isArray(n.pins) && n.pins.length > 0) {
      const pin = n.pins.find((p) => p.terminal === terminal);
      if (pin) {
        if (typeof pin.xOffset === "number" && typeof pin.zOffset === "number") {
          return [n.x + pin.xOffset, baseHeight, n.z + pin.zOffset];
        }
        const col = n.pins.filter((p) => p.side === pin.side);
        const count = col.length;
        const idxInCol = pin.order ?? col.findIndex((p) => p.terminal === pin.terminal);
        const z = n.z + (idxInCol - (count - 1) / 2) * BOARD_PIN_PITCH;
        const x = n.x + (pin.side === "left" ? -BOARD_X_OFFSET : BOARD_X_OFFSET);
        return [x, baseHeight, z];
      }
    }

    const t = String(terminal || "").toLowerCase();
    const isLeft = ["a", "pos", "positive", "vcc", "pin1", "1", "anode", "in", "input"].includes(t);
    const isRight = ["b", "neg", "negative", "gnd", "ground", "pin2", "2", "cathode", "out", "output"].includes(t);

    if (isLeft) return [n.x - 0.19, baseHeight, n.z];
    if (isRight) return [n.x + 0.19, baseHeight, n.z];

    return [n.x, baseHeight, n.z];
  }

  function getEdgeColor(edge) {
    if (edge.color) return edge.color;

    // Look up terminal role to pick smart auto color
    const srcNode = nodes.find((n) => n.id === edge.sourceId);
    const pin = srcNode?.pins?.find((p) => p.terminal === edge.sourceTerminal);
    if (pin) {
      return getWireAutoColor(pin.role, pin.label);
    }

    // Default polarity check for 2-terminal parts
    if (edge.sourceTerminal === "a" || edge.sourceTerminal === "pos") return "#ff3838";
    if (edge.sourceTerminal === "b" || edge.sourceTerminal === "neg") return "#2ed573";

    return activeWireColor || "#2ed573";
  }

  function handleGroundMove(e) {
    if (e.point) {
      setMouseWorldPos([e.point.x, 0.16, e.point.z]);
      setIsMouseHovering(true);
    }
    if (draggingId && e.point) {
      onDragMove(draggingId, e.point.x, e.point.z);
    }
  }

  function handleGroundUp() {
    if (draggingId) onDragEnd();
  }

  function handleGroundLeave() {
    setIsMouseHovering(false);
    if (draggingId) onDragEnd();
  }

  const selectedStartPos = selectedTerminal
    ? terminalWorldPos(selectedTerminal.nodeId, selectedTerminal.terminal)
    : null;

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

      {/* Main Studio Key Light */}
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

      <CameraCapture cameraRef={cameraRef} />

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
        fadeStrength={1.5}
        position={[0, 0.022, 0]}
      />

      {/* Raycast floor plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerMove={handleGroundMove}
        onPointerUp={handleGroundUp}
        onPointerLeave={handleGroundLeave}
        onClick={() => setSelectedEdgeId(null)}
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

      {edges.map((e) => {
        const srcNode = nodes.find((n) => n.id === e.sourceId);
        const tgtNode = nodes.find((n) => n.id === e.targetId);
        if (!srcNode || !tgtNode) return null;

        const start = terminalWorldPos(e.sourceId, e.sourceTerminal);
        const end = terminalWorldPos(e.targetId, e.targetTerminal);
        const wireColor = getEdgeColor(e);
        const isPowered = poweredIds ? (poweredIds.has(e.sourceId) || poweredIds.has(e.targetId)) : false;
        const isSelected = selectedEdgeId === e.id;

        return (
          <Wire3D
            key={e.id}
            start={start}
            end={end}
            color={wireColor}
            powered={isPowered}
            selected={isSelected}
            onClick={() => {
              setSelectedEdgeId(e.id);
              if (onRemoveEdge) {
                // If clicked while already selected, remove edge
                if (isSelected) {
                  onRemoveEdge(e.id);
                  setSelectedEdgeId(null);
                }
              }
            }}
          />
        );
      })}

      {/* Dynamic 3D Live Wire Preview while drawing */}
      {selectedTerminal && selectedStartPos && isMouseHovering && mouseWorldPos && (
        <Wire3D
          start={selectedStartPos}
          end={mouseWorldPos}
          color={activeWireColor || "#2ed573"}
          isPreview
        />
      )}

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