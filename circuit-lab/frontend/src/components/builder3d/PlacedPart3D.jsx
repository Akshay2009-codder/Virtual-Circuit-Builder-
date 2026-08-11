import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, ContactShadows } from "@react-three/drei";
import { MODEL_BY_TYPE } from "../3d/PartModels";
import { CATEGORY_COLOR } from "../../constants/categoryColors";

const SCALE = 0.34;
const TERMINAL_OFFSET = 0.19;

// Boards (ESP32 etc) have many pins laid out in two columns instead of the
// simple left/right pair every other part uses.
const BOARD_X_OFFSET = 0.255;
const BOARD_PIN_PITCH = 0.051;

const PIN_ROLE_COLOR = {
  power: "#ff4757",
  ground: "#4a4a4a",
  gpio: "#45d8c4",
};

// Parts where terminal order actually matters in real life. Terminal "a"
// (left) is treated as positive/anode, "b" (right) as negative/cathode -
// matches real red/black wire convention and gives a visual +/- marker.
const POLARIZED_KEYS = new Set([
  "battery_9v",
  "battery_aa",
  "solar_panel",
  "led",
  "capacitor_electrolytic",
  "coin_cell",
  "bench_power_supply",
  "usb_power",
  "rgb_led",
  "lithium_battery",
  "power_bank",
]);

const TOGGLE_KEYS = new Set(["switch", "dip_switch", "rocker_switch", "slide_switch", "limit_switch", "reed_switch"]);

// How quickly the part glides toward its target position/lift each frame.
// Higher = snappier, lower = floatier. 0.2 lands in ~150-200ms, no
// perceptible lag behind the cursor while dragging, but no more hard snaps.
const LERP_SPEED = 0.22;

export default function PlacedPart3D({
  node,
  isDragging,
  onDragStart,
  onRemove,
  onTerminalClick,
  onToggle,
  onOpenCode,
  isTerminalSelected,
  powered,
  reading,
}) {
  const [hovered, setHovered] = useState(false);
  const [labelOpen, setLabelOpen] = useState(false);
  const Model = MODEL_BY_TYPE[node.modelType];
  const accent = CATEGORY_COLOR[node.category] || "#45d8c4";
  const lifted = isDragging;
  const isLed = node.key === "led";
  const isPolarized = POLARIZED_KEYS.has(node.key);
  const isToggleable = TOGGLE_KEYS.has(node.key);
  const isOn = node.on !== false; // default on
  const labelColor = powered ? "#3ddc84" : accent;

  // Multi-pin board (ESP32 etc) - pins were copied onto the node at drop
  // time from the catalog component's spec.pins. Everything else keeps the
  // original simple two-terminal a/b layout.
  const hasBoardPins = Array.isArray(node.pins) && node.pins.length > 0;
  const isCodeable = node.category === "board" && typeof onOpenCode === "function";

  // Outer group is no longer pinned to [node.x, 0, node.z] directly - it
  // glides toward that target every frame instead, so dragging a part (or
  // its position snapping to the grid on drop) reads as smooth motion
  // rather than an instant teleport. First mount snaps immediately so a
  // freshly-placed or freshly-loaded part doesn't fly in from the origin.
  const groupRef = useRef(null);
  const initedRef = useRef(false);
  const liftRef = useRef(null);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    const targetX = Number.isFinite(node.x) ? node.x : 0;
    const targetZ = Number.isFinite(node.z) ? node.z : 0;

    if (!initedRef.current) {
      g.position.set(targetX, 0, targetZ);
      initedRef.current = true;
    } else {
      g.position.x += (targetX - g.position.x) * LERP_SPEED;
      g.position.z += (targetZ - g.position.z) * LERP_SPEED;
    }

    const targetLift = lifted ? 0.24 : 0.12;
    const l = liftRef.current;
    if (l) {
      if (!initedRef.current) {
        l.position.y = targetLift;
      } else {
        l.position.y += (targetLift - l.position.y) * LERP_SPEED;
      }
    }
  });

  function getClosestTerminal(clickPoint) {
    if (!clickPoint) return hasBoardPins ? node.pins[0]?.terminal : "a";

    const clickX = clickPoint.x;
    const clickZ = clickPoint.z;

    if (hasBoardPins && Array.isArray(node.pins) && node.pins.length > 0) {
      let closestPin = node.pins[0];
      let minDist = Infinity;

      for (const pin of node.pins) {
        let px = node.x;
        let pz = node.z;

        if (typeof pin.xOffset === "number" && typeof pin.zOffset === "number") {
          px += pin.xOffset;
          pz += pin.zOffset;
        } else {
          const col = pin.side === "left" ? node.pins.filter((p) => p.side === "left") : node.pins.filter((p) => p.side === "right");
          const count = col.length;
          const idxInCol = pin.order ?? col.findIndex((p) => p.terminal === pin.terminal);
          pz += (idxInCol - (count - 1) / 2) * BOARD_PIN_PITCH;
          px += pin.side === "left" ? -BOARD_X_OFFSET : BOARD_X_OFFSET;
        }

        const dist = (clickX - px) ** 2 + (clickZ - pz) ** 2;
        if (dist < minDist) {
          minDist = dist;
          closestPin = pin;
        }
      }
      return closestPin.terminal;
    } else {
      const posXA = node.x - TERMINAL_OFFSET;
      const posXB = node.x + TERMINAL_OFFSET;
      const distA = (clickX - posXA) ** 2 + (clickZ - node.z) ** 2;
      const distB = (clickX - posXB) ** 2 + (clickZ - node.z) ** 2;
      return distA <= distB ? "a" : "b";
    }
  }

  return (
    <group ref={groupRef}>
      {/* Local contact shadow directly under the component to anchor it on stage */}
      <ContactShadows
        position={[0, 0.012, 0]}
        opacity={lifted ? 0.85 : 0.65}
        scale={hasBoardPins ? 2.4 : 1.5}
        blur={lifted ? 1.4 : 0.6}
        far={0.8}
        raycast={() => null}
      />

      {/* Always-on low fill light */}
      <pointLight position={[0, 0.6, 0]} intensity={0.06} distance={0.9} color="#cfe8ff" />

      {/* a lit LED gets its own warm glow lighting the area around it */}
      {powered && isLed && <pointLight position={[0, 0.6, 0]} intensity={1.5} distance={2.4} color="#ff5555" />}
      {powered && !isLed && <pointLight position={[0, 0.5, 0]} intensity={0.45} distance={1.8} color="#3ddc84" />}

      {/* Stage Mounting Pad beneath the part */}
      <mesh position={[0, 0.01, 0]} receiveShadow castShadow raycast={() => null}>
        <boxGeometry args={[hasBoardPins ? 1.8 : 1.1, 0.015, hasBoardPins ? 1.2 : 0.8]} />
        <meshStandardMaterial color="#1a232e" roughness={0.4} metalness={0.6} envMapIntensity={0.8} />
      </mesh>

      {/* Primary interactive drag & direct component wire handle */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        onPointerDown={(e) => {
          e.stopPropagation();
          onDragStart(node.id);
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (isToggleable) {
            onToggle(node.id);
          } else {
            const closest = getClosestTerminal(e.point);
            onTerminalClick(node.id, closest);
          }
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setLabelOpen((o) => !o);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <circleGeometry args={[hasBoardPins ? 1.1 : 0.72, 24]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* 3D Model group - Clicking directly on the actual 3D component model connects a wire to it */}
      <group
        ref={liftRef}
        scale={SCALE}
        position={[0, 0.12, 0]}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          if (isToggleable) {
            onToggle(node.id);
          } else {
            const closest = getClosestTerminal(e.point);
            onTerminalClick(node.id, closest);
          }
        }}
      >
        {Model && <Model lit={isLed ? powered : undefined} on={isToggleable ? isOn : undefined} />}
      </group>

      {/* direct pin connection hit areas (no artificial dots - connects directly to circuit like real life) */}
      {hasBoardPins
        ? node.pins.map((pin) => {
            const selected = isTerminalSelected(node.id, pin.terminal);
            let xPos = 0;
            let zPos = 0;
            if (typeof pin.xOffset === "number" && typeof pin.zOffset === "number") {
              xPos = pin.xOffset;
              zPos = pin.zOffset;
            } else {
              const col = pin.side === "left" ? node.pins.filter((p) => p.side === "left") : node.pins.filter((p) => p.side === "right");
              const count = col.length;
              const idxInCol = pin.order ?? col.findIndex((p) => p.terminal === pin.terminal);
              zPos = (idxInCol - (count - 1) / 2) * BOARD_PIN_PITCH;
              xPos = pin.side === "left" ? -BOARD_X_OFFSET : BOARD_X_OFFSET;
            }
            const liftY = isDragging ? 0.28 : 0.16;
            const pos = [xPos, liftY, zPos];
            return (
              <group key={pin.terminal}>
                {/* Invisible hit box surrounding vertical header pin */}
                <mesh
                  position={pos}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTerminalClick(node.id, pin.terminal);
                  }}
                  onPointerOver={(e) => e.stopPropagation()}
                >
                  <cylinderGeometry args={[0.06, 0.06, 0.16, 12]} />
                  <meshBasicMaterial visible={false} />
                </mesh>

                {/* Subtle glowing ring ONLY when this pin is currently selected for wiring */}
                {selected && (
                  <mesh position={[pos[0], pos[1] + 0.02, pos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.035, 0.07, 16]} />
                    <meshBasicMaterial color="#ffffff" side={2} transparent opacity={0.9} />
                  </mesh>
                )}
              </group>
            );
          })
        : ["a", "b"].map((t, i) => {
            const selected = isTerminalSelected(node.id, t);
            const isPositive = t === "a";
            const termColor = isPolarized ? (isPositive ? "#ff4757" : "#4a90e2") : accent;
            const liftY = isDragging ? 0.28 : 0.16;
            const pos = [i === 0 ? -TERMINAL_OFFSET : TERMINAL_OFFSET, liftY, 0];
            return (
              <group key={t}>
                {/* Invisible hit box for direct lead/terminal clicking */}
                <mesh
                  position={pos}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTerminalClick(node.id, t);
                  }}
                >
                  <cylinderGeometry args={[0.08, 0.08, 0.16, 12]} />
                  <meshBasicMaterial visible={false} />
                </mesh>

                {/* Subtle glowing ring ONLY when this lead is selected for wiring */}
                {selected && (
                  <mesh position={[pos[0], pos[1] + 0.02, pos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.04, 0.075, 16]} />
                    <meshBasicMaterial color="#ffffff" side={2} transparent opacity={0.9} />
                  </mesh>
                )}
              </group>
            );
          })}

      {/* Small persistent "open code" badge for boards - stays available even
          with the label closed, since double-click no longer opens code
          directly. Styled with an explicit color, not left to external CSS. */}
      {isCodeable && !labelOpen && (
        <Html position={[0, 1.15, 0]} center distanceFactor={8} occlude>
          <button
            className="part3d-code-badge"
            onClick={(e) => {
              e.stopPropagation();
              onOpenCode(node.id);
            }}
            title={`Edit code for ${node.name}`}
            style={{ color: labelColor, borderColor: labelColor }}
          >
            {"</>"}
          </button>
        </Html>
      )}

      {labelOpen && (
        <Html position={[0, 1.15, 0]} center distanceFactor={8} occlude>
          <div
            className="part3d-label"
            style={{ borderColor: powered ? "#3ddc84" : accent }}
          >
            <span className="part3d-label-dot" style={{ background: powered ? "#3ddc84" : accent }} />
            <div className="part3d-label-text">
              <span className="part3d-label-name" style={{ color: labelColor }}>
                {node.name}
              </span>
              {reading && reading.state === "on" ? (
                <span className="part3d-label-value" style={{ color: "#3ddc84" }}>
                  {reading.voltage.toFixed(2)}V · {reading.current_mA.toFixed(1)}mA
                </span>
              ) : (
                node.unit && (
                  <span className="part3d-label-value" style={{ color: "var(--text-faint, #6c7a85)" }}>
                    {node.default_value} {node.unit}
                  </span>
                )
              )}
            </div>
            {isCodeable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCode(node.id);
                }}
                title="Edit code"
                style={{ marginRight: 2, color: labelColor }}
              >
                {"</>"}
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(node.id);
              }}
              title="Remove"
            >
              ×
            </button>
          </div>
          {isToggleable && (
            <button
              className="part3d-toggle"
              style={{ background: isOn ? "#2fd66f" : "#ff4757" }}
              onClick={(e) => {
                e.stopPropagation();
                onToggle(node.id);
              }}
            >
              {isOn ? "ON" : "OFF"}
            </button>
          )}
        </Html>
      )}
    </group>
  );
}