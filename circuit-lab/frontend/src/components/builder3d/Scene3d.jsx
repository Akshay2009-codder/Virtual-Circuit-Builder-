import { useEffect } from "react";
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
    if (!n) return [0, 0.12, 0];

    // Multi-pin board (ESP32 etc) - mirror PlacedPart3D's pin layout math
    // so wires land exactly on the pin dot instead of the old fixed a/b spot.
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

    // Simple two-terminal parts - PlacedPart3D only ever renders "a" (left)
    // and "b" (right), so branch on both explicitly instead of treating
    // "anything that isn't a" as "b". That previous fallback silently put
    // BOTH terminals at the same spot for any unexpected terminal name,
    // drawing a zero-length wire that looked like a broken connection.
    if (terminal === "a") return [n.x - 0.55, 0.12, n.z];
    if (terminal === "b") return [n.x + 0.55, 0.12, n.z];

    console.warn(`terminalWorldPos: unrecognized terminal "${terminal}" on node ${nodeId}`);
    return [n.x, 0.12, n.z];
  }

  function handleGroundMove(e) {
    if (!draggingId) return;
    onDragMove(draggingId, e.point.x, e.point.z);
  }
  function handleGroundUp() {
    if (draggingId) onDragEnd();
  }

  return (
    <Canvas camera={{ position: [3.4, 3.6, 5], fov: 46 }} dpr={[1, 2]} shadows="soft">
      <color attach="background" args={["#0a0e13"]} />
      {/* fog pushed further out - previously started at 9 units, which
          dimmed the bench itself on wider/zoomed-out views */}
      <fog attach="fog" args={["#0a0e13", 13, 30]} />

      {/* Real image-based reflections on every part's material - this is
          the single biggest lever for making parts read as actual 3D
          objects instead of flat-shaded shapes, since it gives plastic
          and metal surfaces a believable highlight that moves with the
          camera. background=false so it only feeds material reflections,
          it never overrides the hand-tuned light rig or the dark bench
          backdrop above. Fetches a small preset HDRI from drei's CDN on
          first load - needs the browser to have network access. */}
      <Environment preset="city" resolution={256} background={false} />

      {/* Base fill: ambient + hemisphere carry a bit less of the load now
          that Environment supplies real reflected fill light - lowered
          slightly from before so the scene doesn't wash out and parts
          keep visible shading instead of looking flat-lit. */}
      <ambientLight intensity={0.6} />
      <hemisphereLight args={["#cfe8ff", "#3a2a1c", 0.45]} />

      {/* key light - the main directional shadow-caster, nudged up so
          reflections and shading both read clearly against the new
          environment fill */}
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.55}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0005}
      />
      {/* warm rim/fill from the opposite side, keeps shadowed edges from going flat black */}
      <directionalLight position={[-4, 3, -3]} intensity={0.32} color="#ff6f5e" />
      <pointLight position={[0, 3, 0]} intensity={0.16} color="#2fd66f" />

      {/* corner accent lights */}
      <spotLight
        position={[5.5, 3.4, 5.5]}
        target-position={[0, 0, 0]}
        angle={0.58}
        penumbra={0.85}
        intensity={0.42}
        distance={17}
        color="#ffffff"
      />
      <spotLight
        position={[-5.5, 3.4, 5.5]}
        target-position={[0, 0, 0]}
        angle={0.58}
        penumbra={0.85}
        intensity={0.42}
        distance={17}
        color="#ffffff"
      />
      <spotLight
        position={[5.5, 3.4, -5.5]}
        target-position={[0, 0, 0]}
        angle={0.58}
        penumbra={0.85}
        intensity={0.32}
        distance={17}
        color="#dceeff"
      />
      <spotLight
        position={[-5.5, 3.4, -5.5]}
        target-position={[0, 0, 0]}
        angle={0.58}
        penumbra={0.85}
        intensity={0.32}
        distance={17}
        color="#dceeff"
      />

      <CameraCapture cameraRef={cameraRef} />

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
        />
      ))}

      <ContactShadows position={[0, 0.008, 0]} opacity={0.45} scale={12} blur={2.2} far={4} />

      <OrbitControls
        makeDefault
        enabled={!draggingId}
        enableDamping
        dampingFactor={0.08}
        minDistance={2.2}
        maxDistance={16}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  );
}