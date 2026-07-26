import { useState } from "react";
import { Html } from "@react-three/drei";
import { MODEL_BY_TYPE } from "../3d/PartModels";
import { CATEGORY_COLOR } from "../../constants/categoryColors";

const SCALE = 0.34;
const TERMINAL_OFFSET = 0.55;

// Boards (ESP32 etc) have many pins laid out in two columns instead of the
// simple left/right pair every other part uses.
const BOARD_X_OFFSET = 0.85;
const BOARD_PIN_PITCH = 0.16;

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
  const Model = MODEL_BY_TYPE[node.modelType];
  const accent = CATEGORY_COLOR[node.category] || "#45d8c4";
  const lifted = hovered || isDragging;
  const isLed = node.key === "led";
  const isPolarized = POLARIZED_KEYS.has(node.key);
  const isToggleable = TOGGLE_KEYS.has(node.key);
  const isOn = node.on !== false; // default on
  const ringColor = powered ? "#3ddc84" : accent;
  const ringOpacity = powered ? 0.85 : lifted ? 0.55 : isToggleable && !isOn ? 0.06 : 0.18;

  // Multi-pin board (ESP32 etc) - pins were copied onto the node at drop
  // time from the catalog component's spec.pins. Everything else keeps the
  // original simple two-terminal a/b layout.
  const hasBoardPins = Array.isArray(node.pins) && node.pins.length > 0;
  const isCodeable = node.category === "board" && typeof onOpenCode === "function";

  return (
    <group position={[node.x, 0, node.z]}>
      {/* soft colored ring on the floor - grounds the part, brightens on hover/drag/power, dims when a switch is off */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <ringGeometry args={[hasBoardPins ? 0.95 : 0.58, hasBoardPins ? 1.03 : 0.66, 32]} />
        <meshBasicMaterial color={ringColor} transparent opacity={ringOpacity} />
      </mesh>

      {/* a lit LED gets its own warm glow lighting the area around it */}
      {powered && isLed && <pointLight position={[0, 0.9, 0]} intensity={1.4} distance={2.2} color="#ff5555" />}
      {powered && !isLed && <pointLight position={[0, 0.7, 0]} intensity={0.35} distance={1.6} color="#3ddc84" />}

      {/* invisible drag handle beneath the part - also toggles switches on
          click, and opens the code editor on double-click for boards */}
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
        onDoubleClick={(e) => {
          if (isCodeable) {
            e.stopPropagation();
            onOpenCode(node.id);
          }
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

      <group scale={SCALE} position={[0, lifted ? 0.46 : 0.35, 0]}>
        {Model && <Model lit={isLed ? powered : undefined} on={isToggleable ? isOn : undefined} />}
      </group>

      {/* terminals */}
      {hasBoardPins
        ? node.pins.map((pin) => {
            const selected = isTerminalSelected(node.id, pin.terminal);
            const col = pin.side === "left" ? node.pins.filter((p) => p.side === "left") : node.pins.filter((p) => p.side === "right");
            const count = col.length;
            const idxInCol = pin.order ?? col.findIndex((p) => p.terminal === pin.terminal);
            const zPos = (idxInCol - (count - 1) / 2) * BOARD_PIN_PITCH;
            const xPos = pin.side === "left" ? -BOARD_X_OFFSET : BOARD_X_OFFSET;
            const termColor = PIN_ROLE_COLOR[pin.role] || accent;
            const pos = [xPos, 0.1, zPos];
            return (
              <group key={pin.terminal}>
                <mesh
                  position={pos}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTerminalClick(node.id, pin.terminal);
                  }}
                >
                  <sphereGeometry args={[0.052, 12, 12]} />
                  <meshStandardMaterial
                    color={selected ? "#ffffff" : termColor}
                    emissive={termColor}
                    emissiveIntensity={selected ? 1.6 : 0.7}
                  />
                </mesh>
                <Html position={[pos[0] + (pin.side === "left" ? -0.16 : 0.16), pos[1], pos[2]]} center distanceFactor={12} occlude>
                  <span className="part3d-pin-label" style={{ color: termColor }}>
                    {pin.label}
                  </span>
                </Html>
              </group>
            );
          })
        : ["a", "b"].map((t, i) => {
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
            {reading && reading.state === "on" ? (
              <span className="part3d-label-value" style={{ color: "#3ddc84" }}>
                {reading.voltage.toFixed(2)}V · {reading.current_mA.toFixed(1)}mA
              </span>
            ) : (
              node.unit && (
                <span className="part3d-label-value">
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
              style={{ marginRight: 2 }}
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
    </group>
  );
}