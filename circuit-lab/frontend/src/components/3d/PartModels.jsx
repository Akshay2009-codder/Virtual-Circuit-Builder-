// Each component is modeled from Three.js primitives (no external asset
// downloads - keeps the app dependency-free and instant-loading). Shapes
// and materials are chosen to match each part's real-world silhouette
// (TO-92/TO-220 packages, DIP chips, glass fuse bodies, etc.) rather than
// generic colored boxes.

function Lead({ position, rotation = [0, 0, Math.PI / 2], length = 0.9, radius = 0.025 }) {
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[radius, radius, length, 12]} />
      <meshStandardMaterial color="#c9c9c9" metalness={0.8} roughness={0.3} />
    </mesh>
  );
}

function BentLead({ position }) {
  // simple down-bent lead for TO-220 style packages
  return (
    <group position={position}>
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 10]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ---------------- Passive ---------------- */

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

export function CapacitorElectrolyticModel() {
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
      {/* polarity stripe */}
      <mesh position={[0, 0, 0.44]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.06, 1.08, 0.02]} />
        <meshStandardMaterial color="#e7edf3" />
      </mesh>
      <Lead position={[-0.15, -0.85, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.7} />
      <Lead position={[0.15, -0.85, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.7} />
    </group>
  );
}

export function CapacitorCeramicModel() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.5, 24, 16]} />
        <meshStandardMaterial color="#e8a33d" roughness={0.5} />
      </mesh>
      <mesh scale={[1, 0.55, 0.5]}>
        <sphereGeometry args={[0.5, 24, 16]} />
        <meshStandardMaterial color="#e8a33d" roughness={0.5} />
      </mesh>
      <Lead position={[-0.18, -0.55, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.7} />
      <Lead position={[0.18, -0.55, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.7} />
    </group>
  );
}

export function InductorModel() {
  const wraps = 7;
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <cylinderGeometry args={[0.22, 0.22, 1.3, 20]} />
        <meshStandardMaterial color="#2b2f36" roughness={0.7} />
      </mesh>
      {Array.from({ length: wraps }).map((_, i) => (
        <mesh key={i} position={[0, -0.55 + (i * 1.1) / (wraps - 1), 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.26, 0.045, 8, 20]} />
          <meshStandardMaterial color="#d4a017" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      <Lead position={[0, -0.85, 0]} length={0.6} />
      <Lead position={[0, 0.85, 0]} length={0.6} />
    </group>
  );
}

export function PotentiometerModel() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 0.7, 0.9]} />
        <meshStandardMaterial color="#7a828c" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.35, 20]} />
        <meshStandardMaterial color="#232e3a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.68, 0.1]}>
        <boxGeometry args={[0.06, 0.28, 0.06]} />
        <meshStandardMaterial color="#e7edf3" />
      </mesh>
      {[-0.3, 0, 0.3].map((x, i) => (
        <Lead key={i} position={[x, -0.55, 0.5]} rotation={[Math.PI / 2, 0, 0]} length={0.4} />
      ))}
    </group>
  );
}

export function FuseModel() {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <cylinderGeometry args={[0.24, 0.24, 1.2, 20]} />
        <meshStandardMaterial color="#dfe9ea" roughness={0.15} transparent opacity={0.45} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.03, 0.03, 1.1, 8]} />
        <meshStandardMaterial color="#d4a017" metalness={0.6} roughness={0.3} />
      </mesh>
      {[-0.58, 0.58].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.16, 20]} />
          <meshStandardMaterial color="#c9c9c9" metalness={0.8} roughness={0.25} />
        </mesh>
      ))}
      <Lead position={[0, -0.85, 0]} length={0.6} />
      <Lead position={[0, 0.85, 0]} length={0.6} />
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

/* ---------------- Active / semiconductors ---------------- */

export function LedModel({ lit = true } = {}) {
  const domeColor = lit ? "#ff5555" : "#7a3030";
  const emissiveColor = lit ? "#ff2222" : "#000000";
  const emissiveIntensity = lit ? 1.3 : 0;
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.42, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
        <meshStandardMaterial
          color={domeColor} emissive={emissiveColor} emissiveIntensity={emissiveIntensity}
          transparent opacity={0.85} roughness={0.2}
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

export function DiodeModel() {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <cylinderGeometry args={[0.22, 0.22, 1.1, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.225, 0.225, 0.09, 20]} />
        <meshStandardMaterial color="#e7edf3" roughness={0.3} />
      </mesh>
      <Lead position={[0, -0.85, 0]} length={0.6} />
      <Lead position={[0, 0.85, 0]} length={0.6} />
    </group>
  );
}

export function TransistorModel() {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.8, 24, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#15181c" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.15, -0.21]}>
        <boxGeometry args={[0.84, 0.8, 0.02]} />
        <meshStandardMaterial color="#15181c" roughness={0.55} />
      </mesh>
      {[-0.25, 0, 0.25].map((x, i) => (
        <group key={i} position={[x, -0.35, 0.12]}>
          <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.5, 8]} />
            <meshStandardMaterial color="#c9c9c9" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function MosfetModel() {
  return (
    <group>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.9, 1, 0.28]} />
        <meshStandardMaterial color="#15181c" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.78, 0.02]}>
        <boxGeometry args={[0.55, 0.4, 0.06]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.78, 0.06]}>
        <cylinderGeometry args={[0.07, 0.07, 0.08, 16]} />
        <meshStandardMaterial color="#15181c" />
      </mesh>
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={i} position={[x, -0.55, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.55, 8]} />
          <meshStandardMaterial color="#c9c9c9" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------- Integrated circuits ---------------- */

export function IcDipModel() {
  const pinsPerSide = 4;
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.6, 0.28, 0.7]} />
        <meshStandardMaterial color="#111318" roughness={0.5} />
      </mesh>
      <mesh position={[-0.72, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#111318" roughness={0.5} />
      </mesh>
      {[-0.35, 0.35].map((z, side) =>
        Array.from({ length: pinsPerSide }).map((_, i) => (
          <mesh
            key={`${side}-${i}`}
            position={[-0.6 + i * 0.4, -0.18, z]}
            rotation={[0, 0, 0]}
          >
            <boxGeometry args={[0.06, 0.22, 0.05]} />
            <meshStandardMaterial color="#c9c9c9" metalness={0.8} roughness={0.3} />
          </mesh>
        ))
      )}
    </group>
  );
}

/* ---------------- Power sources ---------------- */

export function Battery9vModel() {
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

export function BatteryAaModel() {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <cylinderGeometry args={[0.32, 0.32, 1.2, 24]} />
        <meshStandardMaterial color="#2e6fbd" roughness={0.4} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.63, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.61, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.02, 24]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function SolarPanelModel() {
  const cells = 3;
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.4, 0.08, 1] } />
        <meshStandardMaterial color="#111f3d" roughness={0.35} metalness={0.2} />
      </mesh>
      {Array.from({ length: cells }).map((_, i) => (
        <mesh key={i} position={[-0.42 + i * 0.42, 0.045, 0]}>
          <boxGeometry args={[0.02, 0.01, 1]} />
          <meshStandardMaterial color="#45d8c4" emissive="#1f6a5f" emissiveIntensity={0.4} />
        </mesh>
      ))}
      <Lead position={[-0.2, -0.2, 0.55]} rotation={[Math.PI / 2, 0, 0]} length={0.4} />
      <Lead position={[0.2, -0.2, 0.55]} rotation={[Math.PI / 2, 0, 0]} length={0.4} />
    </group>
  );
}

/* ---------------- Control / input ---------------- */

export function SwitchModel({ on = true } = {}) {
  const leverAngle = on ? -0.5 : 0.5; // tilts left when on, right when off
  const leverColor = on ? "#2fd66f" : "#ff4757";
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
      <mesh position={[0.05, 0.2, 0]} rotation={[0, 0, leverAngle]}>
        <boxGeometry args={[0.7, 0.07, 0.12]} />
        <meshStandardMaterial color={leverColor} metalness={0.5} roughness={0.3} emissive={leverColor} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.4, 0.05, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function PushButtonModel() {
  return (
    <group>
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[0.9, 0.2, 0.9]} />
        <meshStandardMaterial color="#111318" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.14, 20]} />
        <meshStandardMaterial color="#7a828c" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.12, 20]} />
        <meshStandardMaterial color="#ff5d5d" roughness={0.4} />
      </mesh>
      {[[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].map(([x, z], i) => (
        <Lead key={i} position={[x, -0.4, z]} rotation={[Math.PI / 2, 0, 0]} length={0.3} radius={0.02} />
      ))}
    </group>
  );
}

export function RelayModel() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.2, 0.9, 0.9]} />
        <meshStandardMaterial color="#1c3d6b" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.46, -0.2]}>
        <boxGeometry args={[0.4, 0.02, 0.4]} />
        <meshStandardMaterial color="#e7edf3" />
      </mesh>
      {[-0.4, -0.13, 0.13, 0.4].map((x, i) => (
        <Lead key={i} position={[x, -0.55, 0.4]} rotation={[Math.PI / 2, 0, 0]} length={0.3} radius={0.025} />
      ))}
    </group>
  );
}

export function DipSwitchModel({ on = true } = {}) {
  const n = 4;
  const tilt = on ? -0.35 : 0.35;
  const color = on ? "#3ddc84" : "#e7edf3";
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.2, 0.22, 0.6]} />
        <meshStandardMaterial color="#1a3a63" roughness={0.5} />
      </mesh>
      {Array.from({ length: n }).map((_, i) => (
        <mesh key={i} position={[-0.45 + i * 0.3, 0.16, 0]} rotation={[0, 0, tilt]}>
          <boxGeometry args={[0.14, 0.14, 0.22]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------- Output ---------------- */

export function BuzzerModel() {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 0.4, 28]} />
        <meshStandardMaterial color="#15181c" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.03, 20]} />
        <meshStandardMaterial color="#c9a04a" metalness={0.5} roughness={0.4} />
      </mesh>
      <Lead position={[-0.15, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.5} />
      <Lead position={[0.15, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.5} />
    </group>
  );
}

export function DcMotorModel() {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <cylinderGeometry args={[0.42, 0.42, 1, 28]} />
        <meshStandardMaterial color="#8a8f96" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.4, 12]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.44, 0.44, 0.06, 28]} />
        <meshStandardMaterial color="#333333" roughness={0.5} />
      </mesh>
      <Lead position={[-0.12, -0.65, 0]} length={0.35} />
      <Lead position={[0.12, -0.65, 0]} length={0.35} />
    </group>
  );
}

export function SpeakerModel() {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.06, 12, 28]} />
        <meshStandardMaterial color="#232e3a" roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <coneGeometry args={[0.42, 0.35, 28, 1, true]} />
        <meshStandardMaterial color="#3a4552" roughness={0.6} side={2} />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.22, 24]} />
        <meshStandardMaterial color="#15181c" roughness={0.4} metalness={0.3} />
      </mesh>
      <Lead position={[-0.1, -0.5, 0]} length={0.3} />
      <Lead position={[0.1, -0.5, 0]} length={0.3} />
    </group>
  );
}

/* ---------------- Sensors ---------------- */

export function LdrModel() {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.45, 0.45, 0.12, 28]} />
        <meshStandardMaterial color="#d8c85a" roughness={0.4} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.22, 0.065, Math.sin(angle) * 0.22]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[0.3, 0.01, 0.03]} />
            <meshStandardMaterial color="#2b2f36" />
          </mesh>
        );
      })}
      <Lead position={[-0.15, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.5} />
      <Lead position={[0.15, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.5} />
    </group>
  );
}

export function ThermistorModel() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.32, 20, 20]} />
        <meshStandardMaterial color="#2e6fbd" roughness={0.35} metalness={0.1} />
      </mesh>
      <Lead position={[-0.1, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.55} />
      <Lead position={[0.1, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.55} />
    </group>
  );
}

/* ---------------- Microcontroller boards ---------------- */

export function DevBoardModel() {
  const pinCount = 9;
  return (
    <group rotation={[-0.08, 0.35, 0]}>
      {/* PCB substrate */}
      <mesh>
        <boxGeometry args={[1.7, 0.06, 1]} />
        <meshStandardMaterial color="#0f6b38" roughness={0.55} />
      </mesh>

      {/* RF shield / main chip module */}
      <mesh position={[0.05, 0.09, -0.15]}>
        <boxGeometry args={[0.55, 0.1, 0.45]} />
        <meshStandardMaterial color="#9aa1a8" metalness={0.65} roughness={0.35} />
      </mesh>
      <mesh position={[0.05, 0.145, -0.15]}>
        <boxGeometry args={[0.5, 0.01, 0.4]} />
        <meshStandardMaterial color="#7a828c" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* USB connector */}
      <mesh position={[-0.88, 0.05, 0]}>
        <boxGeometry args={[0.22, 0.16, 0.34]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.75} roughness={0.3} />
      </mesh>

      {/* reset button */}
      <mesh position={[0.62, 0.08, 0.35]}>
        <cylinderGeometry args={[0.05, 0.05, 0.06, 14]} />
        <meshStandardMaterial color="#111318" roughness={0.5} />
      </mesh>

      {/* status LED */}
      <mesh position={[0.55, 0.07, -0.4]}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshStandardMaterial color="#3ddc84" emissive="#2fd66f" emissiveIntensity={1.1} />
      </mesh>

      {/* header pins along both long edges */}
      {Array.from({ length: pinCount }).map((_, i) => (
        <mesh key={`t${i}`} position={[-0.68 + i * 0.17, 0.06, 0.47]}>
          <cylinderGeometry args={[0.016, 0.016, 0.14, 6]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {Array.from({ length: pinCount }).map((_, i) => (
        <mesh key={`b${i}`} position={[-0.68 + i * 0.17, 0.06, -0.47]}>
          <cylinderGeometry args={[0.016, 0.016, 0.14, 6]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------- Power (additional) ---------------- */

export function CoinCellModel() {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 0.12, 28]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.065, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.01, 28]} />
        <meshStandardMaterial color="#8a8f96" metalness={0.7} roughness={0.3} />
      </mesh>
      <Lead position={[0, -0.4, 0]} length={0.5} />
      <Lead position={[0, 0.4, 0]} length={0.5} />
    </group>
  );
}

export function BenchPsuModel() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.6, 1, 0.9]} />
        <meshStandardMaterial color="#3a4552" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[-0.4, 0.15, 0.46]}>
        <boxGeometry args={[0.5, 0.28, 0.02]} />
        <meshStandardMaterial color="#1a1f26" roughness={0.3} />
      </mesh>
      <mesh position={[-0.4, 0.15, 0.47]}>
        <boxGeometry args={[0.42, 0.16, 0.01]} />
        <meshStandardMaterial color="#3ddc84" emissive="#2fd66f" emissiveIntensity={0.6} />
      </mesh>
      {[0.15, 0.5].map((x, i) => (
        <mesh key={i} position={[x, -0.15, 0.46]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.06, 20]} />
          <meshStandardMaterial color="#111318" roughness={0.6} />
        </mesh>
      ))}
      <Lead position={[-0.2, -0.55, 0.3]} rotation={[Math.PI / 2, 0, 0]} length={0.35} />
      <Lead position={[0.2, -0.55, 0.3]} rotation={[Math.PI / 2, 0, 0]} length={0.35} />
    </group>
  );
}

export function UsbPowerModel() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.9, 0.35, 0.5]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.7, 0.22, 0.35]} />
        <meshStandardMaterial color="#15181c" roughness={0.4} />
      </mesh>
      <Lead position={[-0.15, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.4} />
      <Lead position={[0.15, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.4} />
    </group>
  );
}

/* ---------------- Diodes (additional) ---------------- */

export function BridgeRectifierModel() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.9, 0.4, 0.9]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
        <meshStandardMaterial color="#e7edf3" />
      </mesh>
      {[[-0.35, -0.35], [0.35, -0.35], [-0.35, 0.35], [0.35, 0.35]].map(([x, z], i) => (
        <Lead key={i} position={[x, -0.35, z]} rotation={[Math.PI / 2, 0, 0]} length={0.35} radius={0.025} />
      ))}
    </group>
  );
}

export function RgbLedModel() {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.42, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
        <meshStandardMaterial color="#e0e0e0" transparent opacity={0.55} roughness={0.15} />
      </mesh>
      {[["#ff3b3b", -0.15], ["#3ddc84", 0], ["#4a90ff", 0.15]].map(([c, x], i) => (
        <mesh key={i} position={[x, 0.12, 0.1]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.8} />
        </mesh>
      ))}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.3, 24]} />
        <meshStandardMaterial color="#e0e0e0" transparent opacity={0.4} roughness={0.2} />
      </mesh>
      <Lead position={[-0.14, -0.85, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.9} />
      <Lead position={[0.14, -1.0, 0]} rotation={[Math.PI / 2, 0, 0]} length={1.1} />
    </group>
  );
}

/* ---------------- Switches (additional) ---------------- */

export function RockerSwitchModel({ on = true } = {}) {
  const color = on ? "#3ddc84" : "#ff4757";
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.9, 0.5, 0.6]} />
        <meshStandardMaterial color="#15181c" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.28, on ? -0.08 : 0.08]} rotation={[on ? -0.25 : 0.25, 0, 0]}>
        <boxGeometry args={[0.6, 0.3, 0.18]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} roughness={0.4} />
      </mesh>
      <Lead position={[-0.2, -0.35, 0.35]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
      <Lead position={[0.2, -0.35, 0.35]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
    </group>
  );
}

export function SlideSwitchModel({ on = true } = {}) {
  const knobX = on ? 0.25 : -0.25;
  return (
    <group>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1, 0.15, 0.4]} />
        <meshStandardMaterial color="#232e3a" roughness={0.6} />
      </mesh>
      <mesh position={[knobX, 0.02, 0]}>
        <boxGeometry args={[0.3, 0.12, 0.3]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.4} />
      </mesh>
      <Lead position={[-0.35, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
      <Lead position={[0.35, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
    </group>
  );
}

/* ---------------- Sensors (additional) ---------------- */

export function To92SensorModel() {
  return <TransistorModel />;
}

export function UltrasonicSensorModel() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.3, 0.5, 0.6]} />
        <meshStandardMaterial color="#1a3a63" roughness={0.5} />
      </mesh>
      {[-0.32, 0.32].map((x, i) => (
        <mesh key={i} position={[x, 0.05, 0.28]}>
          <cylinderGeometry args={[0.22, 0.22, 0.22, 24]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#c9c9c9" metalness={0.6} roughness={0.35} />
        </mesh>
      ))}
      <Lead position={[-0.4, -0.35, -0.2]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
      <Lead position={[0.4, -0.35, -0.2]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
    </group>
  );
}

export function IrSensorModel() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 0.18, 0.5]} />
        <meshStandardMaterial color="#1a3a63" roughness={0.5} />
      </mesh>
      {[-0.25, 0.25].map((x, i) => (
        <mesh key={i} position={[x, 0.14, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.14, 16]} />
          <meshStandardMaterial color={i === 0 ? "#3a2a6a" : "#1a1a1a"} roughness={0.3} />
        </mesh>
      ))}
      <Lead position={[-0.3, -0.25, 0.2]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
      <Lead position={[0.3, -0.25, 0.2]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
    </group>
  );
}

export function PirSensorModel() {
  return (
    <group>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.15, 24]} />
        <meshStandardMaterial color="#e7edf3" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.4, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f5f5f0" transparent opacity={0.75} roughness={0.2} />
      </mesh>
      <Lead position={[-0.12, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
      <Lead position={[0.12, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
    </group>
  );
}

export function GasSensorModel() {
  return (
    <group>
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshStandardMaterial color="#1a3a63" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.4, 20]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.37, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.03, 20]} />
        <meshStandardMaterial color="#7a828c" metalness={0.5} roughness={0.4} />
      </mesh>
      <Lead position={[-0.25, -0.25, 0.3]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
      <Lead position={[0.25, -0.25, 0.3]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
    </group>
  );
}

export function HumiditySensorModel() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.8, 1, 0.35]} />
        <meshStandardMaterial color="#2e6fbd" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.15, 0.18]}>
        <boxGeometry args={[0.5, 0.35, 0.03]} />
        <meshStandardMaterial color="#e7edf3" roughness={0.6} />
      </mesh>
      <Lead position={[-0.15, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.4} />
      <Lead position={[0.15, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.4} />
    </group>
  );
}

export function TouchSensorModel() {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.4, 0.4, 0.08, 24]} />
        <meshStandardMaterial color="#1a3a63" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 24]} />
        <meshStandardMaterial color="#e8a33d" metalness={0.6} roughness={0.3} emissive="#e8a33d" emissiveIntensity={0.2} />
      </mesh>
      <Lead position={[-0.12, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
      <Lead position={[0.12, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
    </group>
  );
}

/* ---------------- Displays ---------------- */

export function SevenSegmentModel() {
  const segments = [
    [0, 0.32, 0.62, 0.09],
    [0, -0.32, 0.62, 0.09],
    [0, 0, 0.62, 0.09],
    [-0.26, 0.16, 0.09, 0.55],
    [0.26, 0.16, 0.09, 0.55],
    [-0.26, -0.16, 0.09, 0.55],
    [0.26, -0.16, 0.09, 0.55],
  ];
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 1.3, 0.2]} />
        <meshStandardMaterial color="#15181c" roughness={0.5} />
      </mesh>
      {segments.map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0.11]}>
          <boxGeometry args={[w, h, 0.02]} />
          <meshStandardMaterial color="#ff3b3b" emissive="#ff2222" emissiveIntensity={0.9} />
        </mesh>
      ))}
      <mesh position={[0.4, -0.55, 0.11]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial color="#ff3b3b" emissive="#ff2222" emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
}

export function LcdDisplayModel() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.8, 0.9, 0.15]} />
        <meshStandardMaterial color="#e7edf3" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.09]}>
        <boxGeometry args={[1.5, 0.55, 0.02]} />
        <meshStandardMaterial color="#3ddc84" emissive="#1f9a51" emissiveIntensity={0.5} roughness={0.3} />
      </mesh>
      <Lead position={[-0.7, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
      <Lead position={[0.7, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
    </group>
  );
}

export function OledDisplayModel() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 0.7, 0.1]} />
        <meshStandardMaterial color="#0a0e13" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[0.8, 0.45, 0.01]} />
        <meshStandardMaterial color="#4a90ff" emissive="#2f6fe0" emissiveIntensity={0.7} />
      </mesh>
      <Lead position={[-0.35, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.25} />
      <Lead position={[0.35, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.25} />
    </group>
  );
}

export function LedMatrixModel() {
  const n = 5;
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.1, 1.1, 0.15]} />
        <meshStandardMaterial color="#15181c" roughness={0.5} />
      </mesh>
      {Array.from({ length: n }).map((_, row) =>
        Array.from({ length: n }).map((_, col) => (
          <mesh key={`${row}-${col}`} position={[-0.4 + col * 0.2, -0.4 + row * 0.2, 0.09]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#ff3b3b" emissive="#ff2222" emissiveIntensity={0.7} />
          </mesh>
        ))
      )}
    </group>
  );
}

/* ---------------- Outputs (additional) ---------------- */

export function ServoMotorModel() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.8, 0.9, 0.5]} />
        <meshStandardMaterial color="#2e6fbd" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.12, 20]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.65, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.5, 0.06, 0.1]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.4} />
      </mesh>
      <Lead position={[-0.1, -0.55, 0.3]} rotation={[Math.PI / 2, 0, 0]} length={0.35} />
      <Lead position={[0.1, -0.55, 0.3]} rotation={[Math.PI / 2, 0, 0]} length={0.35} />
    </group>
  );
}

export function StepperMotorModel() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.9, 0.9, 0.7]} />
        <meshStandardMaterial color="#8a8f96" metalness={0.5} roughness={0.4} />
      </mesh>
      {[[-0.38, -0.38], [0.38, -0.38], [-0.38, 0.38], [0.38, 0.38]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.36]}>
          <cylinderGeometry args={[0.05, 0.05, 0.1, 10]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.8} roughness={0.2} />
      </mesh>
      <Lead position={[-0.1, -0.5, -0.3]} length={0.3} />
      <Lead position={[0.1, -0.5, -0.3]} length={0.3} />
    </group>
  );
}

export function FanModel() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 1, 0.25]} />
        <meshStandardMaterial color="#15181c" roughness={0.5} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[0, 0, 0.15]} rotation={[0, 0, angle]}>
            <mesh position={[0.22, 0, 0]}>
              <boxGeometry args={[0.32, 0.12, 0.03]} />
              <meshStandardMaterial color="#7a828c" roughness={0.4} />
            </mesh>
          </mesh>
        );
      })}
      <mesh position={[0, 0, 0.16]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <Lead position={[-0.1, -0.5, -0.1]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
      <Lead position={[0.1, -0.5, -0.1]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
    </group>
  );
}

/* ---------------- Misc ---------------- */

export function CrystalOscillatorModel() {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <boxGeometry args={[0.7, 0.4, 0.3]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.75} roughness={0.25} />
      </mesh>
      <Lead position={[0, -0.35, 0]} length={0.4} />
      <Lead position={[0, 0.35, 0]} length={0.4} />
    </group>
  );
}

export function BreadboardModel() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[2, 0.15, 1.2]} />
        <meshStandardMaterial color="#e8e4d8" roughness={0.6} />
      </mesh>
      {Array.from({ length: 10 }).map((_, col) =>
        Array.from({ length: 4 }).map((_, row) => (
          <mesh key={`${col}-${row}`} position={[-0.85 + col * 0.19, 0.08, -0.4 + row * 0.28]}>
            <cylinderGeometry args={[0.02, 0.02, 0.04, 6]} />
            <meshStandardMaterial color="#2b2f36" />
          </mesh>
        ))
      )}
      <mesh position={[0, 0.08, 0.52]}>
        <boxGeometry args={[1.9, 0.02, 0.06]} />
        <meshStandardMaterial color="#ff4757" />
      </mesh>
      <mesh position={[0, 0.08, -0.52]}>
        <boxGeometry args={[1.9, 0.02, 0.06]} />
        <meshStandardMaterial color="#2b2f36" />
      </mesh>
    </group>
  );
}

export function TerminalBlockModel() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 0.5, 0.5]} />
        <meshStandardMaterial color="#1a8a4a" roughness={0.5} />
      </mesh>
      {[-0.25, 0.25].map((x, i) => (
        <mesh key={i} position={[x, 0.28, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.1, 12]} />
          <meshStandardMaterial color="#c9c9c9" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      <Lead position={[-0.25, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
      <Lead position={[0.25, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
    </group>
  );
}

export const MODEL_BY_TYPE = {
  resistor: ResistorModel,
  capacitor_electrolytic: CapacitorElectrolyticModel,
  capacitor_ceramic: CapacitorCeramicModel,
  inductor: InductorModel,
  potentiometer: PotentiometerModel,
  fuse: FuseModel,
  wire: WireModel,

  led: LedModel,
  diode: DiodeModel,
  transistor: TransistorModel,
  mosfet: MosfetModel,

  ic_dip: IcDipModel,

  battery_9v: Battery9vModel,
  battery_aa: BatteryAaModel,
  solar_panel: SolarPanelModel,

  switch: SwitchModel,
  push_button: PushButtonModel,
  relay: RelayModel,
  dip_switch: DipSwitchModel,

  buzzer: BuzzerModel,
  dc_motor: DcMotorModel,
  speaker: SpeakerModel,

  ldr: LdrModel,
  thermistor: ThermistorModel,

  dev_board: DevBoardModel,

  coin_cell: CoinCellModel,
  bench_psu: BenchPsuModel,
  usb_power: UsbPowerModel,

  bridge_rectifier: BridgeRectifierModel,
  rgb_led: RgbLedModel,

  rocker_switch: RockerSwitchModel,
  slide_switch: SlideSwitchModel,

  to92_sensor: To92SensorModel,
  ultrasonic_sensor: UltrasonicSensorModel,
  ir_sensor: IrSensorModel,
  pir_sensor: PirSensorModel,
  gas_sensor: GasSensorModel,
  humidity_sensor: HumiditySensorModel,
  touch_sensor: TouchSensorModel,

  seven_segment: SevenSegmentModel,
  lcd_display: LcdDisplayModel,
  oled_display: OledDisplayModel,
  led_matrix: LedMatrixModel,

  servo_motor: ServoMotorModel,
  stepper_motor: StepperMotorModel,
  fan: FanModel,

  crystal_oscillator: CrystalOscillatorModel,
  breadboard: BreadboardModel,
  terminal_block: TerminalBlockModel,
};