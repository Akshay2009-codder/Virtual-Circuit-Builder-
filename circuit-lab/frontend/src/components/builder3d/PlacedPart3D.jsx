import { useState } from "react";
import { Html } from "@react-three/drei";
import { MODEL_BY_TYPE } from "../3d/PartModels";
import { CATEGORY_COLOR } from "../../constants/categoryColors";

const SCALE = 0.34;
const TERMINAL_OFFSET = 0.55;

// Parts where terminal order actually matters in real life. Terminal "a"
// (left) is treated as positive/anode, "b" (right) as negative/cathode -
// matches real red/black wire convention and gives a visual +/- marker.
const POLARIZED_KEYS = new Set([
  "battery_9v",
  "battery_aa",
  "solar_panel",
  "led",
  "capacitor_electrolytic",
]);

const TOGGLE_KEYS = new Set(["switch", "dip_switch"]);

export default function PlacedPart3D({
  node,
  isDragging,
  onDragStart,
  onRemove,
  onTerminalClick,
  onToggle,
  isTerminalSelected,
  powered,
}) {
  const [hovered, setHovered] = useState(false);
  const Model = MODEL_BY_TYPE[node.modelType];
  const accent = CATEGORY_COLOR[node.category] || "#45d8c4";
  const lifted = hovered || isDragging;
  const isLed = node.key === "led";
  const isPolarized = POLARIZED_KEYS.has(node.key);
  const isToggleable = TOGGLE_KEYS.has(node.key);
  const isOn = node.on !== false; // default on
  const ringColor = powered ? "#3ddc84" : accent;
  const ringOpacity = powered ? 0.85 : lifted ? 0.55 : isToggleable && !isOn ? 0.06 : 0.18;

  return (
    <group position={[node.x, 0, node.z]}>
      {/* soft colored ring on the floor - grounds the part, brightens on hover/drag/power, dims when a switch is off */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <ringGeometry args={[0.58, 0.66, 32]} />
        <meshBasicMaterial color={ringColor} transparent opacity={ringOpacity} />
      </mesh>

      {/* a lit LED gets its own warm glow lighting the area around it */}
      {powered && isLed && <pointLight position={[0, 0.9, 0]} intensity={1.4} distance={2.2} color="#ff5555" />}
      {powered && !isLed && <pointLight position={[0, 0.7, 0]} intensity={0.35} distance={1.6} color="#3ddc84" />}

      {/* invisible drag handle beneath the part - also toggles switches on click */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.015, 0]}
        onPointerDown={(e) => {
          e.stopPropagation();
          onDragStart(node.id);
        }}
        onClick={(e) => {
          if (isToggleable) {
            e.stopPropagation();
            onToggle(node.id);
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <circleGeometry args={[0.72, 24]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <group scale={SCALE} position={[0, lifted ? 0.46 : 0.35, 0]}>
        {Model && <Model lit={isLed ? powered : undefined} on={isToggleable ? isOn : undefined} />}
      </group>

      {/* terminals - click one, then another part's terminal, to wire them */}
      {["a", "b"].map((t, i) => {
        const selected = isTerminalSelected(node.id, t);
        const isPositive = t === "a";
        const termColor = isPolarized ? (isPositive ? "#ff4757" : "#4a90e2") : accent;
        const pos = [i === 0 ? -TERMINAL_OFFSET : TERMINAL_OFFSET, 0.12, 0];
        return (
          <group key={t}>
            <mesh
              position={pos}
              onClick={(e) => {
                e.stopPropagation();
                onTerminalClick(node.id, t);
              }}
            >
              <sphereGeometry args={[0.078, 16, 16]} />
              <meshStandardMaterial
                color={selected ? "#ffffff" : termColor}
                emissive={termColor}
                emissiveIntensity={selected ? 1.6 : 0.7}
              />
            </mesh>
            {isPolarized && (
              <Html position={[pos[0], pos[1] + 0.22, pos[2]]} center distanceFactor={10} occlude>
                <span className="part3d-polarity" style={{ color: termColor }}>
                  {isPositive ? "+" : "−"}
                </span>
              </Html>
            )}
          </group>
        );
      })}

      <Html position={[0, 1.15, 0]} center distanceFactor={8} occlude>
        <div className="part3d-label" style={{ borderColor: powered ? "#3ddc84" : accent }}>
          <span className="part3d-label-dot" style={{ background: powered ? "#3ddc84" : accent }} />
          <div className="part3d-label-text">
            <span className="part3d-label-name">{node.name}</span>
            {node.unit && (
              <span className="part3d-label-value">
                {node.default_value} {node.unit}
              </span>
            )}
          </div>
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
    </group>
  );
}