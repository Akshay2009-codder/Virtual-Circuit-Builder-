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
}) {
  const Model = MODEL_BY_TYPE[node.modelType];
  const accent = CATEGORY_COLOR[node.category] || "#45d8c4";

  return (
    <group position={[node.x, 0, node.z]}>
      {/* invisible drag handle beneath the part */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.015, 0]}
        onPointerDown={(e) => {
          e.stopPropagation();
          onDragStart(node.id);
        }}
      >
        <circleGeometry args={[0.72, 24]} />
        <meshBasicMaterial transparent opacity={isDragging ? 0.1 : 0} color={accent} />
      </mesh>

      <group scale={SCALE} position={[0, 0.35, 0]}>
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
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial
              color={selected ? "#ffffff" : accent}
              emissive={accent}
              emissiveIntensity={selected ? 1.6 : 0.7}
            />
          </mesh>
        );
      })}

      <Html position={[0, 1.05, 0]} center distanceFactor={9} occlude>
        <div className="part3d-label" style={{ borderColor: accent }}>
          <span>{node.name}</span>
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