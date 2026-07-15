// Each component is modeled from basic Three.js primitives (no external
// assets - keeps things dependency-free and fast to load). Materials use
// physically-plausible-ish colors so parts read as what they are at a glance.

function Lead({ position, rotation = [0, 0, Math.PI / 2], length = 0.9 }) {
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[0.025, 0.025, length, 12]} />
      <meshStandardMaterial color="#c9c9c9" metalness={0.8} roughness={0.3} />
    </mesh>
  );
}

export function ResistorModel() {
  const bandColors = ["#c0392b", "#8e5a2b", "#111111", "#d4a017"];
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.28, 0.28, 1, 24]} />
        <meshStandardMaterial color="#e8d4a0" roughness={0.6} />
      </mesh>
      {bandColors.map((c, i) => (
        <mesh key={c + i} position={[-0.32 + i * 0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.285, 0.05, 8, 24]} />
          <meshStandardMaterial color={c} roughness={0.5} />
        </mesh>
      ))}
      <Lead position={[-1.05, 0, 0]} />
      <Lead position={[1.05, 0, 0]} />
    </group>
  );
}

export function CapacitorModel() {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.45, 0.45, 1.1, 28]} />
        <meshStandardMaterial color="#2e6fbd" roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.56, 0]}>
        <cylinderGeometry args={[0.46, 0.46, 0.04, 28]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.8} roughness={0.3} />
      </mesh>
      <Lead position={[-0.15, -0.85, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.7} />
      <Lead position={[0.15, -0.85, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.7} />
    </group>
  );
}

export function LedModel() {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.42, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
        <meshStandardMaterial
          color="#ff5555"
          emissive="#ff2222"
          emissiveIntensity={0.9}
          transparent
          opacity={0.85}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.3, 24]} />
        <meshStandardMaterial color="#e0e0e0" transparent opacity={0.5} roughness={0.2} />
      </mesh>
      <Lead position={[-0.14, -0.85, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.9} />
      <Lead position={[0.14, -1.0, 0]} rotation={[Math.PI / 2, 0, 0]} length={1.1} />
    </group>
  );
}

export function BatteryModel() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.7, 1.3, 0.5]} />
        <meshStandardMaterial color="#2f9e6e" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.14, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.68, 0]}>
        <boxGeometry args={[0.72, 0.06, 0.52]} />
        <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

export function SwitchModel() {
  return (
    <group>
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[1.3, 0.18, 0.5]} />
        <meshStandardMaterial color="#232e3a" roughness={0.6} />
      </mesh>
      <mesh position={[-0.4, 0.05, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.05, 0.2, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.7, 0.07, 0.12]} />
        <meshStandardMaterial color="#e8a33d" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.4, 0.05, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function WireModel() {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <cylinderGeometry args={[0.09, 0.09, 1.9, 20]} />
        <meshStandardMaterial color="#45d8c4" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.95, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export const MODEL_BY_TYPE = {
  resistor: ResistorModel,
  capacitor: CapacitorModel,
  led: LedModel,
  battery: BatteryModel,
  switch: SwitchModel,
  wire: WireModel,
};