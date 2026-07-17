import { useState } from "react";
import { Html } from "@react-three/drei";
import { MODEL_BY_TYPE } from "../3d/PartModels";
import { CATEGORY_COLOR } from "../../constants/categoryColors";

const SCALE = 0.34;
const TERMINAL_OFFSET = 0.55;

export default function PlacedPart3D({
  node,
  isDragging,
  onDragStart,
  onRemove,
  onTerminalClick,
  isTerminalSelected,
  powered,
}) {
  const [hovered, setHovered] = useState(false);
  const Model = MODEL_BY_TYPE[node.modelType];
  const accent = CATEGORY_COLOR[node.category] || "#45d8c4";
  const lifted = hovered || isDragging;
  const ringColor = powered ? "#3ddc84" : accent;
  const isLed = node.key === "led";

  return (
    <group position={[node.x, 0, node.z]}>
      {/* soft colored ring on the floor - grounds the part, brightens on hover/drag/power */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <ringGeometry args={[0.58, 0.66, 32]} />
        <meshBasicMaterial
          color={ringColor}
          transparent
          opacity={powered ? 0.85 : lifted ? 0.55 : 0.18}
        />
      </mesh>

      {/* a lit LED gets its own warm glow lighting the area around it */}
      {powered && isLed && <pointLight position={[0, 0.9, 0]} intensity={1.4} distance={2.2} color="#ff5555" />}
      {powered && !isLed && <pointLight position={[0, 0.7, 0]} intensity={0.35} distance={1.6} color="#3ddc84" />}

      {/* invisible drag handle beneath the part */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.015, 0]}
        onPointerDown={(e) => {
          e.stopPropagation();
          onDragStart(node.id);
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
        {Model && <Model />}
      </group>

      {/* terminals - click one, then another part's terminal, to wire them */}
      {["a", "b"].map((t, i) => {
        const selected = isTerminalSelected(node.id, t);
        return (
          <mesh
            key={t}
            position={[i === 0 ? -TERMINAL_OFFSET : TERMINAL_OFFSET, 0.12, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onTerminalClick(node.id, t);
            }}
          >
            <sphereGeometry args={[0.078, 16, 16]} />
            <meshStandardMaterial
              color={selected ? "#ffffff" : accent}
              emissive={accent}
              emissiveIntensity={selected ? 1.6 : 0.7}
            />
          </mesh>
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
      </Html>
    </group>
  );
}