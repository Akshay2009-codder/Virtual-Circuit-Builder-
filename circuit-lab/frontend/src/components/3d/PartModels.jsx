// Each component is modeled from Three.js primitives (no external asset
// downloads - keeps the app dependency-free and instant-loading). Shapes
// and materials are chosen to match each part's real-world silhouette
// (TO-92/TO-220 packages, DIP chips, glass fuse bodies, etc.) rather than
// generic colored boxes.

function Lead({ position, rotation = [0, 0, Math.PI / 2], length = 0.9, radius = 0.025 }) {
  return (
    <mesh castShadow receiveShadow position={position} rotation={rotation}>
      <cylinderGeometry args={[radius, radius, length, 12]} />
      <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.8} roughness={0.3} />
    </mesh>
  );
}

function BentLead({ position }) {
  // simple down-bent lead for TO-220 style packages
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 10]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ---------------- Passive ---------------- */

export function ResistorModel() {
  const bandColors = ["#c0392b", "#8e5a2b", "#111111", "#d4a017"];
  return (
    <group>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.28, 1, 24]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#e8d4a0" roughness={0.6} />
      </mesh>
      {bandColors.map((c, i) => (
        <mesh castShadow receiveShadow key={c + i} position={[-0.32 + i * 0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.285, 0.05, 8, 24]} />
          <meshStandardMaterial envMapIntensity={0.4} color={c} roughness={0.5} />
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
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.45, 1.1, 28]} />
        <meshStandardMaterial envMapIntensity={0.7} color="#2e6fbd" roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.56, 0]}>
        <cylinderGeometry args={[0.46, 0.46, 0.04, 28]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* polarity stripe */}
      <mesh castShadow receiveShadow position={[0, 0, 0.44]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.06, 1.08, 0.02]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#e7edf3" />
      </mesh>
      <Lead position={[-0.15, -0.85, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.7} />
      <Lead position={[0.15, -0.85, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.7} />
    </group>
  );
}

export function CapacitorCeramicModel() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.5, 24, 16]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#e8a33d" roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow scale={[1, 0.55, 0.5]}>
        <sphereGeometry args={[0.5, 24, 16]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#e8a33d" roughness={0.5} />
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
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.22, 1.3, 20]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#2b2f36" roughness={0.7} />
      </mesh>
      {Array.from({ length: wraps }).map((_, i) => (
        <mesh castShadow receiveShadow key={i} position={[0, -0.55 + (i * 1.1) / (wraps - 1), 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.26, 0.045, 8, 20]} />
          <meshStandardMaterial envMapIntensity={1.3} color="#d4a017" metalness={0.7} roughness={0.3} />
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
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 0.7, 0.9]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#7a828c" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.35, 20]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#232e3a" roughness={0.6} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.68, 0.1]}>
        <boxGeometry args={[0.06, 0.28, 0.06]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#e7edf3" />
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
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.24, 0.24, 1.2, 20]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#dfe9ea" roughness={0.15} transparent opacity={0.45} />
      </mesh>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.1, 8]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#d4a017" metalness={0.6} roughness={0.3} />
      </mesh>
      {[-0.58, 0.58].map((y, i) => (
        <mesh castShadow receiveShadow key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.16, 20]} />
          <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.8} roughness={0.25} />
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
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.09, 0.09, 1.9, 20]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#45d8c4" roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.95, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.8} roughness={0.2} />
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
      <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.42, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
        <meshStandardMaterial envMapIntensity={0.4}
          color={domeColor} emissive={emissiveColor} emissiveIntensity={emissiveIntensity}
          transparent opacity={0.85} roughness={0.2}
        />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.3, 24]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#e0e0e0" transparent opacity={0.5} roughness={0.2} />
      </mesh>
      <Lead position={[-0.14, -0.85, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.9} />
      <Lead position={[0.14, -1.0, 0]} rotation={[Math.PI / 2, 0, 0]} length={1.1} />
    </group>
  );
}

export function DiodeModel() {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.22, 1.1, 20]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#1a1a1a" roughness={0.4} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.225, 0.225, 0.09, 20]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#e7edf3" roughness={0.3} />
      </mesh>
      <Lead position={[0, -0.85, 0]} length={0.6} />
      <Lead position={[0, 0.85, 0]} length={0.6} />
    </group>
  );
}

export function TransistorModel() {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.8, 24, 1, false, 0, Math.PI]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#15181c" roughness={0.55} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.15, -0.21]}>
        <boxGeometry args={[0.84, 0.8, 0.02]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#15181c" roughness={0.55} />
      </mesh>
      {[-0.25, 0, 0.25].map((x, i) => (
        <group key={i} position={[x, -0.35, 0.12]}>
          <mesh castShadow receiveShadow position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.5, 8]} />
            <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function MosfetModel() {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[0.9, 1, 0.28]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#15181c" roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.78, 0.02]}>
        <boxGeometry args={[0.55, 0.4, 0.06]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.78, 0.06]}>
        <cylinderGeometry args={[0.07, 0.07, 0.08, 16]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#15181c" />
      </mesh>
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh castShadow receiveShadow key={i} position={[x, -0.55, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.55, 8]} />
          <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------- Integrated circuits ---------------- */

export function GenericDipIcModel({ pins = 8, label = "IC", partNumber = "" }) {
  const pinsPerSide = Math.floor(pins / 2);
  const bodyLength = 0.35 + pinsPerSide * 0.22;
  const pinSpacing = (bodyLength - 0.3) / (pinsPerSide - 1 || 1);

  return (
    <group>
      {/* Black Molded Epoxy DIP Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[bodyLength, 0.28, 0.7]} />
        <meshStandardMaterial envMapIntensity={0.5} color="#15181e" roughness={0.45} />
      </mesh>

      {/* Pin 1 Half-Moon Notch at Top Edge */}
      <mesh castShadow receiveShadow position={[-bodyLength / 2 + 0.08, 0.14, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#0f1115" roughness={0.4} />
      </mesh>

      {/* Pin 1 Corner Dot Indentation */}
      <mesh position={[-bodyLength / 2 + 0.18, 0.145, -0.22]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
        <meshStandardMaterial color="#0b0d10" roughness={0.3} />
      </mesh>

      {/* Laser-Etched Top Silkscreen Chip Label */}
      <mesh position={[0, 0.142, 0]}>
        <boxGeometry args={[bodyLength * 0.75, 0.005, 0.35]} />
        <meshStandardMaterial
          color="#d1d5db"
          roughness={0.8}
          metalness={0.1}
          emissive="#8a94a6"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Dual Inline Pins (DIP Silver Pins) */}
      {[-0.37, 0.37].map((z, side) =>
        Array.from({ length: pinsPerSide }).map((_, i) => {
          const x = -bodyLength / 2 + 0.18 + i * pinSpacing;
          return (
            <group key={`${side}-${i}`} position={[x, -0.16, z]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.07, 0.25, 0.05]} />
                <meshStandardMaterial envMapIntensity={1.3} color="#d4d4d4" metalness={0.85} roughness={0.2} />
              </mesh>
            </group>
          );
        })
      )}
    </group>
  );
}

export function IcDipModel() {
  return <GenericDipIcModel pins={8} label="GENERIC IC" partNumber="DIP-8" />;
}

export function Ic555Model() {
  return <GenericDipIcModel pins={8} label="555 TIMER" partNumber="NE555P" />;
}

export function IcOpampModel() {
  return <GenericDipIcModel pins={8} label="DUAL OP-AMP" partNumber="LM358P" />;
}

export function MicrocontrollerAtmega328Model() {
  return <GenericDipIcModel pins={28} label="MICROCHIP" partNumber="ATMEGA328P-PU" />;
}

export function EepromIcModel() {
  return <GenericDipIcModel pins={8} label="EEPROM 256K" partNumber="24LC256" />;
}

export function AdcIcModel() {
  return <GenericDipIcModel pins={16} label="10-BIT ADC" partNumber="MCP3008" />;
}

export function LogicAndModel() {
  return <GenericDipIcModel pins={14} label="QUAD AND" partNumber="SN74HC08N" />;
}

export function LogicOrModel() {
  return <GenericDipIcModel pins={14} label="QUAD OR" partNumber="SN74HC32N" />;
}

export function LogicXorModel() {
  return <GenericDipIcModel pins={14} label="QUAD XOR" partNumber="SN74HC86N" />;
}

export function LogicNandModel() {
  return <GenericDipIcModel pins={14} label="QUAD NAND" partNumber="SN74HC00N" />;
}

export function LogicNorModel() {
  return <GenericDipIcModel pins={14} label="QUAD NOR" partNumber="SN74HC02N" />;
}

export function LogicNotModel() {
  return <GenericDipIcModel pins={14} label="HEX INVERTER" partNumber="SN74HC04N" />;
}

export function FlipFlopModel() {
  return <GenericDipIcModel pins={14} label="DUAL D-FF" partNumber="SN74HC74N" />;
}

export function VoltageRegulatorModel() {
  return (
    <group>
      {/* Black Molded TO-220 Body */}
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[0.9, 1.0, 0.28]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#15181c" roughness={0.5} />
      </mesh>
      {/* Top Silkscreen Etching */}
      <mesh position={[0, 0.35, 0.145]}>
        <boxGeometry args={[0.7, 0.25, 0.005]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.8} />
      </mesh>
      {/* Metal Heat Tab with Hole */}
      <mesh castShadow receiveShadow position={[0, 0.78, 0.02]}>
        <boxGeometry args={[0.55, 0.4, 0.06]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.78, 0.06]}>
        <cylinderGeometry args={[0.07, 0.07, 0.08, 16]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#15181c" />
      </mesh>
      {/* 3 Lead Legs (IN, GND, OUT) */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh castShadow receiveShadow key={i} position={[x, -0.55, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.55, 8]} />
          <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export function IcSocketModel() {
  return (
    <group>
      {/* Black Plastic Socket Frame */}
      <mesh castShadow receiveShadow position={[0, 0.06, 0]}>
        <boxGeometry args={[1.6, 0.12, 0.75]} />
        <meshStandardMaterial color="#1a1e24" roughness={0.6} />
      </mesh>
      {/* Open Recess Slot */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.3, 0.08, 0.45]} />
        <meshStandardMaterial color="#0c0e12" roughness={0.8} />
      </mesh>
      {/* Dual Wipe Contacts (8 Holes) */}
      {[-0.32, 0.32].map((z, side) =>
        [-0.6, -0.2, 0.2, 0.6].map((x, i) => (
          <mesh key={`${side}-${i}`} position={[x, 0.08, z]}>
            <boxGeometry args={[0.1, 0.08, 0.08]} />
            <meshStandardMaterial color="#b8c0cc" metalness={0.9} roughness={0.2} />
          </mesh>
        ))
      )}
    </group>
  );
}

export function AccelerometerIcModel() {
  return (
    <group>
      {/* Blue Sensor Module PCB */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.06, 0.8]} />
        <meshStandardMaterial envMapIntensity={0.6} color="#0077b6" roughness={0.35} metalness={0.2} />
      </mesh>
      {/* MPU-6050 QFN Chip */}
      <mesh castShadow receiveShadow position={[0, 0.06, 0]}>
        <boxGeometry args={[0.3, 0.05, 0.3]} />
        <meshStandardMaterial color="#111318" roughness={0.3} />
      </mesh>
      {/* Gold Orient Dot */}
      <mesh position={[-0.1, 0.09, -0.1]}>
        <cylinderGeometry args={[0.02, 0.02, 0.01, 12]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} />
      </mesh>
      {/* 8 Pin Gold Male Header */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-0.45 + i * 0.13, 0.15, -0.3]}>
          <boxGeometry args={[0.04, 0.25, 0.04]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------- Power sources ---------------- */

export function Battery9vModel() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.7, 1.3, 0.5]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#2f9e6e" roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.14, 16]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#d4af37" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.68, 0]}>
        <boxGeometry args={[0.72, 0.06, 0.52]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#333333" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

export function BatteryAaModel() {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.32, 1.2, 24]} />
        <meshStandardMaterial envMapIntensity={0.7} color="#2e6fbd" roughness={0.4} metalness={0.15} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.63, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.61, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.02, 24]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function SolarPanelModel() {
  const cells = 3;
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.08, 1] } />
        <meshStandardMaterial envMapIntensity={0.7} color="#111f3d" roughness={0.35} metalness={0.2} />
      </mesh>
      {Array.from({ length: cells }).map((_, i) => (
        <mesh castShadow receiveShadow key={i} position={[-0.42 + i * 0.42, 0.045, 0]}>
          <boxGeometry args={[0.02, 0.01, 1]} />
          <meshStandardMaterial envMapIntensity={0.4} color="#45d8c4" emissive="#1f6a5f" emissiveIntensity={0.4} />
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
      <mesh castShadow receiveShadow position={[0, -0.15, 0]}>
        <boxGeometry args={[1.3, 0.18, 0.5]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#232e3a" roughness={0.6} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.4, 0.05, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.05, 0.2, 0]} rotation={[0, 0, leverAngle]}>
        <boxGeometry args={[0.7, 0.07, 0.12]} />
        <meshStandardMaterial envMapIntensity={1.3} color={leverColor} metalness={0.5} roughness={0.3} emissive={leverColor} emissiveIntensity={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.4, 0.05, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function PushButtonModel({ on = false } = {}) {
  const buttonY = on ? 0.08 : 0.14;
  return (
    <group>
      {/* Black Plastic Base Body */}
      <mesh castShadow receiveShadow position={[0, -0.15, 0]}>
        <boxGeometry args={[0.9, 0.22, 0.9]} />
        <meshStandardMaterial envMapIntensity={0.6} color="#12161f" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Metallic Silver Retaining Ring / Bezel Collar */}
      <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.14, 24]} />
        <meshStandardMaterial envMapIntensity={1.2} color="#b0b8c0" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Vibrant Tactile Push Button Plunger Cap */}
      <mesh castShadow receiveShadow position={[0, buttonY, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.14, 24]} />
        <meshStandardMaterial envMapIntensity={0.7} color="#ff4757" roughness={0.35} metalness={0.1} />
      </mesh>

      {/* 4 Metal Terminal Leads */}
      {[[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].map(([x, z], i) => (
        <Lead key={i} position={[x, -0.4, z]} rotation={[Math.PI / 2, 0, 0]} length={0.3} radius={0.022} />
      ))}
    </group>
  );
}

export function RelayModel() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.9, 0.9]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#1c3d6b" roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.46, -0.2]}>
        <boxGeometry args={[0.4, 0.02, 0.4]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#e7edf3" />
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
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.22, 0.6]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#1a3a63" roughness={0.5} />
      </mesh>
      {Array.from({ length: n }).map((_, i) => (
        <mesh castShadow receiveShadow key={i} position={[-0.45 + i * 0.3, 0.16, 0]} rotation={[0, 0, tilt]}>
          <boxGeometry args={[0.14, 0.14, 0.22]} />
          <meshStandardMaterial envMapIntensity={0.4} color={color} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------- Output ---------------- */

export function BuzzerModel() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.4, 28]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#15181c" roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.03, 20]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#c9a04a" metalness={0.5} roughness={0.4} />
      </mesh>
      <Lead position={[-0.15, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.5} />
      <Lead position={[0.15, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.5} />
    </group>
  );
}

export function DcMotorModel() {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.42, 1, 28]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#8a8f96" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.4, 12]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.44, 0.44, 0.06, 28]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#333333" roughness={0.5} />
      </mesh>
      <Lead position={[-0.12, -0.65, 0]} length={0.35} />
      <Lead position={[0.12, -0.65, 0]} length={0.35} />
    </group>
  );
}

export function SpeakerModel() {
  return (
    <group>
      <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.06, 12, 28]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#232e3a" roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.05, 0]}>
        <coneGeometry args={[0.42, 0.35, 28, 1, true]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#3a4552" roughness={0.6} side={2} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.22, 24]} />
        <meshStandardMaterial envMapIntensity={0.7} color="#15181c" roughness={0.4} metalness={0.3} />
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
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.12, 28]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#d8c85a" roughness={0.4} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh castShadow receiveShadow key={i} position={[Math.cos(angle) * 0.22, 0.065, Math.sin(angle) * 0.22]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[0.3, 0.01, 0.03]} />
            <meshStandardMaterial envMapIntensity={0.4} color="#2b2f36" />
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
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.32, 20, 20]} />
        <meshStandardMaterial envMapIntensity={0.7} color="#2e6fbd" roughness={0.35} metalness={0.1} />
      </mesh>
      <Lead position={[-0.1, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.55} />
      <Lead position={[0.1, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.55} />
    </group>
  );
}

/* ---------------- Microcontroller boards & Specialized Modules ---------------- */

export function Esp32BoardModel({ lit }) {
  const pinsPerSide = 15;
  return (
    <group>
      {/* Black / Dark Navy ESP32 PCB Substrate */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.06, 2.5]} />
        <meshStandardMaterial envMapIntensity={0.6} color="#121820" roughness={0.35} metalness={0.2} />
      </mesh>

      {/* PCB Silkscreen Border Lines */}
      <mesh position={[0, 0.032, 0]}>
        <boxGeometry args={[1.65, 0.002, 2.35]} />
        <meshStandardMaterial color="#3a4b5c" roughness={0.5} />
      </mesh>

      {/* ESP-WROOM-32 Metallic Shield Box */}
      <mesh castShadow receiveShadow position={[0, 0.12, -0.3]}>
        <boxGeometry args={[0.9, 0.12, 1.05]} />
        <meshStandardMaterial envMapIntensity={1.4} color="#a0a7b0" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Etched Chip Branding Plate */}
      <mesh castShadow receiveShadow position={[0, 0.185, -0.3]}>
        <boxGeometry args={[0.78, 0.01, 0.9]} />
        <meshStandardMaterial envMapIntensity={1.2} color="#78808a" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* PCB Wi-Fi Antenna Trace Area (Gold/Copper Top) */}
      <mesh castShadow receiveShadow position={[0, 0.035, -1.02]}>
        <boxGeometry args={[1.4, 0.01, 0.32]} />
        <meshStandardMaterial envMapIntensity={1.2} color="#1a251c" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.041, -1.02]}>
        <boxGeometry args={[1.1, 0.002, 0.2]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Micro-USB Port Block */}
      <mesh castShadow receiveShadow position={[0, 0.08, 1.12]}>
        <boxGeometry args={[0.42, 0.14, 0.32]} />
        <meshStandardMaterial envMapIntensity={1.5} color="#d1d8e0" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* CP2102 USB-to-UART Bridge IC Chip */}
      <mesh castShadow receiveShadow position={[0, 0.05, 0.45]}>
        <boxGeometry args={[0.35, 0.04, 0.35]} />
        <meshStandardMaterial envMapIntensity={0.6} color="#1c2430" roughness={0.3} />
      </mesh>

      {/* Tactile Push Buttons (EN and BOOT) */}
      <mesh castShadow receiveShadow position={[-0.55, 0.07, 0.85]}>
        <boxGeometry args={[0.18, 0.08, 0.18]} />
        <meshStandardMaterial envMapIntensity={1.2} color="#485460" metalness={0.6} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.55, 0.12, 0.85]}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
        <meshStandardMaterial color="#1e272e" />
      </mesh>
      <mesh castShadow receiveShadow position={[0.55, 0.07, 0.85]}>
        <boxGeometry args={[0.18, 0.08, 0.18]} />
        <meshStandardMaterial envMapIntensity={1.2} color="#485460" metalness={0.6} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.55, 0.12, 0.85]}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
        <meshStandardMaterial color="#1e272e" />
      </mesh>

      {/* Status LEDs (Red Power & Blue GPIO2) */}
      <mesh position={[-0.3, 0.045, 0.85]}>
        <boxGeometry args={[0.06, 0.03, 0.08]} />
        <meshStandardMaterial color="#ff3838" emissive="#ff3838" emissiveIntensity={lit ? 1.5 : 0.6} />
      </mesh>
      <mesh position={[0.3, 0.045, 0.85]}>
        <boxGeometry args={[0.06, 0.03, 0.08]} />
        <meshStandardMaterial color="#1e90ff" emissive="#1e90ff" emissiveIntensity={lit ? 1.8 : 0.3} />
      </mesh>

      {/* 30 Golden Header Pins (15 Left, 15 Right) */}
      {Array.from({ length: pinsPerSide }).map((_, i) => (
        <mesh castShadow receiveShadow key={`left-${i}`} position={[-0.75, 0.06, -1.05 + i * 0.15]}>
          <cylinderGeometry args={[0.022, 0.022, 0.16, 8]} />
          <meshStandardMaterial envMapIntensity={1.5} color="#d4af37" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}
      {Array.from({ length: pinsPerSide }).map((_, i) => (
        <mesh castShadow receiveShadow key={`right-${i}`} position={[0.75, 0.06, -1.05 + i * 0.15]}>
          <cylinderGeometry args={[0.022, 0.022, 0.16, 8]} />
          <meshStandardMaterial envMapIntensity={1.5} color="#d4af37" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}
    </group>
  );
}

export function MicrobitBoardModel({ lit }) {
  return (
    <group>
      {/* BBC micro:bit PCB Substrate with rounded corners aesthetic */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.06, 1.8]} />
        <meshStandardMaterial envMapIntensity={0.6} color="#1e272e" roughness={0.35} metalness={0.1} />
      </mesh>

      {/* Gold Edge Connector Contacts along front edge */}
      <mesh castShadow receiveShadow position={[0, 0.035, 0.75]}>
        <boxGeometry args={[2.0, 0.005, 0.25]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 5 Large Ring Terminals (GND, 3V, P0, P1, P2) */}
      {[-0.8, -0.4, 0.0, 0.4, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 0.04, 0.75]}>
          <cylinderGeometry args={[0.09, 0.09, 0.01, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* 5x5 LED Matrix Screen in center */}
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 5 }).map((_, col) => {
          // Glow pattern (heart or grid pattern)
          const isGlowing = lit && (row === 1 || row === 3 || col === 2);
          return (
            <mesh key={`${row}-${col}`} position={[-0.32 + col * 0.16, 0.045, -0.45 + row * 0.16]}>
              <boxGeometry args={[0.1, 0.03, 0.1]} />
              <meshStandardMaterial
                color={isGlowing ? "#ff3838" : "#3d3d3d"}
                emissive={isGlowing ? "#ff3838" : "#000000"}
                emissiveIntensity={isGlowing ? 2.0 : 0}
              />
            </mesh>
          );
        })
      )}

      {/* Buttons A & B */}
      <mesh castShadow receiveShadow position={[-0.78, 0.08, -0.1]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
        <meshStandardMaterial color="#f5f6fa" roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.78, 0.08, -0.1]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
        <meshStandardMaterial color="#f5f6fa" roughness={0.3} />
      </mesh>

      {/* Micro:bit Top Silkscreen Emblem */}
      <mesh position={[0, 0.035, -0.65]}>
        <boxGeometry args={[0.6, 0.002, 0.2]} />
        <meshStandardMaterial color="#f5f6fa" roughness={0.4} />
      </mesh>
    </group>
  );
}

export function NeopixelRingModel({ lit }) {
  const pixelCount = 12;
  const colors = [
    "#ff3838", "#ff9f1a", "#ffd32a", "#32ff7e",
    "#18dcff", "#7d5fff", "#ff4d4d", "#ffaf40",
    "#fffa65", "#70a1ff", "#ff6b81", "#2ed573"
  ];

  return (
    <group>
      {/* Circular PCB Ring Body */}
      <mesh castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.62, 1.05, 36]} />
        <meshStandardMaterial envMapIntensity={0.8} color="#1e272e" roughness={0.4} metalness={0.2} side={2} />
      </mesh>

      {/* Golden Outer & Inner Ring Accent Bezel */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[1.02, 1.05, 36]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[0.62, 0.65, 36]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 12 Individually Molded RGB NeoPixel LEDs around the Ring */}
      {Array.from({ length: pixelCount }).map((_, i) => {
        const angle = (i / pixelCount) * Math.PI * 2;
        const radius = 0.83;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const col = colors[i % colors.length];

        return (
          <group key={i} position={[x, 0.04, z]} rotation={[0, -angle, 0]}>
            {/* Black IC Chip Package Base */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.16, 0.05, 0.16]} />
              <meshStandardMaterial color="#2d3436" roughness={0.3} />
            </mesh>
            {/* Glowing Phosphor Core Lens */}
            <mesh position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
              <meshPhysicalMaterial
                color={lit ? col : "#f5f6fa"}
                emissive={lit ? col : "#000000"}
                emissiveIntensity={lit ? 2.5 : 0}
                roughness={0.1}
                clearcoat={0.9}
              />
            </mesh>
          </group>
        );
      })}

      {/* Ambient Radial Rainbow Glow when powered */}
      {lit && (
        <pointLight position={[0, 0.4, 0]} intensity={2.8} distance={3.5} color="#32ff7e" />
      )}

      {/* Solder Connection Pads along bottom arc (VCC, DIN, DOUT, GND) */}
      {[-0.28, -0.09, 0.09, 0.28].map((x, i) => (
        <mesh key={i} position={[x, 0.02, 0.85]}>
          <boxGeometry args={[0.12, 0.008, 0.16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.15} />
        </mesh>
      ))}
    </group>
  );
}

export function ArduinoUnoModel({ lit }) {
  return (
    <group>
      {/* Signature Italian Teal-Blue Arduino PCB Substrate with corner cutouts */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.07, 1.8]} />
        <meshStandardMaterial envMapIntensity={0.6} color="#00878f" roughness={0.35} metalness={0.25} />
      </mesh>

      {/* 4 Silver Corner Screw Mounting Pads */}
      {[[-1.1, -0.75], [-1.1, 0.75], [1.1, -0.75], [1.1, 0.75]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.038, z]}>
          <cylinderGeometry args={[0.09, 0.09, 0.005, 16]} />
          <meshStandardMaterial color="#c9d1d9" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Silver Metal USB-B Port Jack with inner black housing */}
      <group position={[-0.92, 0.22, -0.45]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.48, 0.35, 0.42]} />
          <meshStandardMaterial envMapIntensity={1.5} color="#c9d1d9" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[-0.245, 0, 0]}>
          <boxGeometry args={[0.01, 0.25, 0.3]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      </group>

      {/* Black DC Barrel Power Jack */}
      <group position={[-0.92, 0.2, 0.48]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.45, 0.32, 0.42]} />
          <meshStandardMaterial envMapIntensity={0.5} color="#15181c" roughness={0.5} />
        </mesh>
        <mesh castShadow receiveShadow position={[-0.23, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
          <meshStandardMaterial color="#0a0d10" />
        </mesh>
      </group>

      {/* ATmega328P DIP IC Microcontroller Socket & Chip */}
      <group position={[0.2, 0.1, 0.1]}>
        {/* Socket */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.25, 0.1, 0.38]} />
          <meshStandardMaterial envMapIntensity={0.6} color="#161b22" roughness={0.4} />
        </mesh>
        {/* Dual In-line Pins (28 legs) */}
        {Array.from({ length: 14 }).map((_, i) => (
          <group key={i}>
            <mesh position={[-0.55 + i * 0.085, -0.06, -0.2]}>
              <boxGeometry args={[0.03, 0.08, 0.02]} />
              <meshStandardMaterial color="#d4af37" metalness={0.9} />
            </mesh>
            <mesh position={[-0.55 + i * 0.085, -0.06, 0.2]}>
              <boxGeometry args={[0.03, 0.08, 0.02]} />
              <meshStandardMaterial color="#d4af37" metalness={0.9} />
            </mesh>
          </group>
        ))}
        {/* Chip Branding Plate */}
        <mesh position={[0, 0.052, 0]}>
          <boxGeometry args={[1.15, 0.005, 0.32]} />
          <meshStandardMaterial color="#21262d" roughness={0.3} />
        </mesh>
      </group>

      {/* Silver HC-49/S Crystal Oscillator (16MHz) */}
      <mesh castShadow receiveShadow position={[-0.35, 0.1, -0.4]}>
        <boxGeometry args={[0.25, 0.1, 0.14]} />
        <meshStandardMaterial envMapIntensity={1.4} color="#d1d8e0" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* 2x3 ICSP Male Header Pins */}
      <group position={[1.05, 0.1, -0.45]}>
        {[-0.08, 0.08].map((x, xi) =>
          [-0.08, 0, 0.08].map((z, zi) => (
            <mesh key={`${xi}-${zi}`} position={[x, 0, z]}>
              <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
              <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.15} />
            </mesh>
          ))
        )}
      </group>

      {/* Digital & Analog Female Header Sockets (Dark Navy Blocks) */}
      <mesh castShadow receiveShadow position={[0.1, 0.14, -0.72]}>
        <boxGeometry args={[1.65, 0.18, 0.14]} />
        <meshStandardMaterial envMapIntensity={0.5} color="#0d1117" roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.2, 0.14, 0.72]}>
        <boxGeometry args={[1.35, 0.18, 0.14]} />
        <meshStandardMaterial envMapIntensity={0.5} color="#0d1117" roughness={0.5} />
      </mesh>

      {/* Reset Button (Red Plunger in Metallic Collar) */}
      <mesh castShadow receiveShadow position={[-0.95, 0.12, -0.72]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
        <meshStandardMaterial envMapIntensity={1.2} color="#c9c9c9" metalness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.95, 0.18, -0.72]}>
        <cylinderGeometry args={[0.05, 0.05, 0.06, 16]} />
        <meshStandardMaterial color="#ff3838" emissive="#ff3838" emissiveIntensity={0.3} />
      </mesh>

      {/* Status LEDs (ON Green, L Yellow, TX/RX Amber) */}
      <mesh position={[-0.5, 0.045, -0.15]}>
        <boxGeometry args={[0.06, 0.02, 0.06]} />
        <meshStandardMaterial color="#2ed573" emissive="#2ed573" emissiveIntensity={lit ? 1.8 : 0.4} />
      </mesh>
      <mesh position={[-0.5, 0.045, 0.0]}>
        <boxGeometry args={[0.06, 0.02, 0.06]} />
        <meshStandardMaterial color="#ffa801" emissive="#ffa801" emissiveIntensity={lit ? 1.5 : 0.2} />
      </mesh>

      {/* White Silkscreen Text / Branding Plate */}
      <mesh position={[-0.3, 0.038, 0.4]}>
        <boxGeometry args={[0.8, 0.002, 0.22]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function RaspberryPiPicoModel({ lit }) {
  const pinsPerSide = 20;
  return (
    <group>
      {/* Signature Raspberry Pi Green PCB Substrate */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.06, 2.4]} />
        <meshStandardMaterial envMapIntensity={0.6} color="#008040" roughness={0.35} metalness={0.2} />
      </mesh>

      {/* Micro-USB Connector Port at top */}
      <mesh castShadow receiveShadow position={[0, 0.08, -1.1]}>
        <boxGeometry args={[0.38, 0.12, 0.3]} />
        <meshStandardMaterial envMapIntensity={1.5} color="#c9d1d9" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* RP2040 Dual-Core Microcontroller QFN Chip */}
      <group position={[0, 0.06, 0.1]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.45, 0.04, 0.45]} />
          <meshStandardMaterial envMapIntensity={0.6} color="#161b22" roughness={0.3} />
        </mesh>
        <mesh position={[0.16, 0.022, 0.16]}>
          <cylinderGeometry args={[0.02, 0.02, 0.005, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} />
        </mesh>
      </group>

      {/* BOOTSEL Tactile Push Button */}
      <mesh castShadow receiveShadow position={[0, 0.07, -0.6]}>
        <boxGeometry args={[0.18, 0.06, 0.18]} />
        <meshStandardMaterial envMapIntensity={1.2} color="#ffffff" roughness={0.2} />
      </mesh>

      {/* Green User LED (GP25) */}
      <mesh position={[-0.3, 0.045, -0.8]}>
        <boxGeometry args={[0.06, 0.02, 0.06]} />
        <meshStandardMaterial color="#2ed573" emissive="#2ed573" emissiveIntensity={lit ? 1.8 : 0.3} />
      </mesh>

      {/* 3-pin SWD Debug Header at Bottom */}
      <group position={[0, 0.05, 1.05]}>
        {[-0.1, 0, 0.1].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* 40 Castellated Gold Pin Holes (20 Left, 20 Right) */}
      {Array.from({ length: pinsPerSide }).map((_, i) => (
        <mesh castShadow receiveShadow key={`pico-l-${i}`} position={[-0.58, 0.035, -1.0 + i * 0.105]}>
          <cylinderGeometry args={[0.02, 0.02, 0.015, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      {Array.from({ length: pinsPerSide }).map((_, i) => (
        <mesh castShadow receiveShadow key={`pico-r-${i}`} position={[0.58, 0.035, -1.0 + i * 0.105]}>
          <cylinderGeometry args={[0.02, 0.02, 0.015, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

export function ArduinoNanoModel({ lit }) {
  const pinsPerSide = 15;
  return (
    <group>
      {/* Compact Royal Blue PCB */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.06, 2.1]} />
        <meshStandardMaterial envMapIntensity={0.6} color="#0077b6" roughness={0.35} metalness={0.2} />
      </mesh>

      {/* Mini-USB Port */}
      <mesh castShadow receiveShadow position={[0, 0.08, -0.92]}>
        <boxGeometry args={[0.36, 0.13, 0.28]} />
        <meshStandardMaterial envMapIntensity={1.5} color="#c9d1d9" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* ATmega328P TQFP Chip (Rotated 45 degrees) */}
      <mesh castShadow receiveShadow position={[0, 0.06, -0.1]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.38, 0.04, 0.38]} />
        <meshStandardMaterial envMapIntensity={0.6} color="#161b22" roughness={0.3} />
      </mesh>

      {/* Reset Button */}
      <mesh castShadow receiveShadow position={[0, 0.07, 0.5]}>
        <boxGeometry args={[0.16, 0.06, 0.16]} />
        <meshStandardMaterial color="#485460" />
      </mesh>

      {/* 2x3 ICSP Male Header Pins */}
      <group position={[0, 0.08, 0.8]}>
        {[-0.08, 0.08].map((x, xi) =>
          [-0.08, 0, 0.08].map((z, zi) => (
            <mesh key={`${xi}-${zi}`} position={[x, 0, z]}>
              <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
              <meshStandardMaterial color="#d4af37" metalness={0.9} />
            </mesh>
          ))
        )}
      </group>

      {/* 30 Golden Header Pins */}
      {Array.from({ length: pinsPerSide }).map((_, i) => (
        <mesh castShadow receiveShadow key={`nano-l-${i}`} position={[-0.48, 0.06, -0.9 + i * 0.13]}>
          <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      {Array.from({ length: pinsPerSide }).map((_, i) => (
        <mesh castShadow receiveShadow key={`nano-r-${i}`} position={[0.48, 0.06, -0.9 + i * 0.13]}>
          <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

export function Stm32BoardModel({ lit }) {
  const pinsPerSide = 20;
  return (
    <group>
      {/* Royal Blue STM32 "Blue Pill" PCB Substrate */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.06, 2.3]} />
        <meshStandardMaterial envMapIntensity={0.7} color="#1f5690" roughness={0.35} metalness={0.25} />
      </mesh>

      {/* Micro-USB Connector Port at top */}
      <mesh castShadow receiveShadow position={[0, 0.08, -1.05]}>
        <boxGeometry args={[0.38, 0.12, 0.28]} />
        <meshStandardMaterial envMapIntensity={1.5} color="#c9d1d9" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* STM32F103C8T6 ARM 32-bit QFP-48 Chip */}
      <group position={[0, 0.06, -0.15]} rotation={[0, Math.PI / 4, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.04, 0.42]} />
          <meshStandardMaterial envMapIntensity={0.6} color="#161b22" roughness={0.3} />
        </mesh>
        <mesh position={[-0.15, 0.022, -0.15]}>
          <cylinderGeometry args={[0.02, 0.02, 0.005, 12]} />
          <meshStandardMaterial color="#c9d1d9" metalness={0.8} />
        </mesh>
      </group>

      {/* 2 Yellow Plastic BOOT0 / BOOT1 Jumper Block Caps */}
      <group position={[-0.32, 0.09, -0.65]}>
        <mesh castShadow receiveShadow position={[0, 0, -0.06]}>
          <boxGeometry args={[0.12, 0.1, 0.08]} />
          <meshStandardMaterial color="#ffd32a" roughness={0.3} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0, 0.06]}>
          <boxGeometry args={[0.12, 0.1, 0.08]} />
          <meshStandardMaterial color="#ffd32a" roughness={0.3} />
        </mesh>
      </group>

      {/* Silver 8MHz Main Crystal & 32.768kHz RTC Crystal */}
      <mesh castShadow receiveShadow position={[0.28, 0.08, -0.4]}>
        <cylinderGeometry args={[0.05, 0.05, 0.22, 12]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial envMapIntensity={1.4} color="#d1d8e0" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.28, 0.06, 0.25]}>
        <cylinderGeometry args={[0.03, 0.03, 0.16, 10]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial envMapIntensity={1.4} color="#d1d8e0" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Reset Push Button */}
      <mesh castShadow receiveShadow position={[0, 0.07, 0.55]}>
        <boxGeometry args={[0.16, 0.06, 0.16]} />
        <meshStandardMaterial color="#485460" />
      </mesh>

      {/* Status LEDs (Red PWR, Green PC13) */}
      <mesh position={[-0.25, 0.045, -0.85]}>
        <boxGeometry args={[0.05, 0.02, 0.05]} />
        <meshStandardMaterial color="#ff3838" emissive="#ff3838" emissiveIntensity={lit ? 1.8 : 0.4} />
      </mesh>
      <mesh position={[0.25, 0.045, -0.85]}>
        <boxGeometry args={[0.05, 0.02, 0.05]} />
        <meshStandardMaterial color="#2ed573" emissive="#2ed573" emissiveIntensity={lit ? 1.8 : 0.3} />
      </mesh>

      {/* 4-pin Right-Angle ST-Link Debug Header at Bottom */}
      <group position={[0, 0.06, 1.02]}>
        {[-0.15, -0.05, 0.05, 0.15].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* 40 Golden Header Pins (20 Left, 20 Right) */}
      {Array.from({ length: pinsPerSide }).map((_, i) => (
        <mesh castShadow receiveShadow key={`stm-l-${i}`} position={[-0.52, 0.06, -0.95 + i * 0.1]}>
          <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      {Array.from({ length: pinsPerSide }).map((_, i) => (
        <mesh castShadow receiveShadow key={`stm-r-${i}`} position={[0.52, 0.06, -0.95 + i * 0.1]}>
          <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

export function NodeMcuBoardModel({ lit }) {
  const pinsPerSide = 15;
  return (
    <group>
      {/* Matte Dark Black PCB Substrate */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.06, 2.4]} />
        <meshStandardMaterial envMapIntensity={0.6} color="#181c24" roughness={0.35} metalness={0.2} />
      </mesh>

      {/* ESP-12E Metal Shield Box */}
      <mesh castShadow receiveShadow position={[0, 0.1, -0.3]}>
        <boxGeometry args={[0.85, 0.1, 0.95]} />
        <meshStandardMaterial envMapIntensity={1.4} color="#a0a7b0" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* PCB Serpentine Wi-Fi Antenna Area at top */}
      <mesh position={[0, 0.04, -0.95]}>
        <boxGeometry args={[1.1, 0.002, 0.25]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Micro-USB Port */}
      <mesh castShadow receiveShadow position={[0, 0.08, 1.1]}>
        <boxGeometry args={[0.4, 0.13, 0.3]} />
        <meshStandardMaterial envMapIntensity={1.5} color="#c9d1d9" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* CP2102 USB-to-UART Converter IC */}
      <mesh castShadow receiveShadow position={[0, 0.05, 0.5]}>
        <boxGeometry args={[0.35, 0.04, 0.35]} />
        <meshStandardMaterial envMapIntensity={0.6} color="#1c2430" roughness={0.3} />
      </mesh>

      {/* FLASH and RST Tactile Buttons */}
      <mesh castShadow receiveShadow position={[-0.45, 0.07, 0.85]}>
        <boxGeometry args={[0.16, 0.07, 0.16]} />
        <meshStandardMaterial color="#485460" />
      </mesh>
      <mesh castShadow receiveShadow position={[0.45, 0.07, 0.85]}>
        <boxGeometry args={[0.16, 0.07, 0.16]} />
        <meshStandardMaterial color="#485460" />
      </mesh>

      {/* Blue Onboard LED */}
      <mesh position={[-0.25, 0.045, -0.2]}>
        <boxGeometry args={[0.06, 0.02, 0.06]} />
        <meshStandardMaterial color="#1e90ff" emissive="#1e90ff" emissiveIntensity={lit ? 1.8 : 0.3} />
      </mesh>

      {/* 30 Golden Header Pins */}
      {Array.from({ length: pinsPerSide }).map((_, i) => (
        <mesh castShadow receiveShadow key={`nodemcu-l-${i}`} position={[-0.64, 0.06, -0.9 + i * 0.13]}>
          <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      {Array.from({ length: pinsPerSide }).map((_, i) => (
        <mesh castShadow receiveShadow key={`nodemcu-r-${i}`} position={[0.64, 0.06, -0.9 + i * 0.13]}>
          <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

export function ArduinoMegaModel({ lit }) {
  return (
    <group>
      {/* Extended Italian Teal-Blue Arduino PCB Substrate for Mega 2560 */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.07, 1.8]} />
        <meshStandardMaterial envMapIntensity={0.65} color="#007d85" roughness={0.35} metalness={0.25} />
      </mesh>

      {/* Silver Corner Screw Mounting Pads */}
      {[[-1.5, -0.75], [-1.5, 0.75], [1.5, -0.75], [1.5, 0.75]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.038, z]}>
          <cylinderGeometry args={[0.09, 0.09, 0.005, 16]} />
          <meshStandardMaterial color="#c9d1d9" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Silver Metal USB-B Port Jack */}
      <group position={[-1.38, 0.22, -0.45]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.48, 0.35, 0.42]} />
          <meshStandardMaterial envMapIntensity={1.5} color="#c9d1d9" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[-0.245, 0, 0]}>
          <boxGeometry args={[0.01, 0.25, 0.3]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      </group>

      {/* Black DC Barrel Power Jack */}
      <group position={[-1.38, 0.2, 0.48]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.45, 0.32, 0.42]} />
          <meshStandardMaterial envMapIntensity={0.5} color="#15181c" roughness={0.5} />
        </mesh>
        <mesh castShadow receiveShadow position={[-0.23, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
          <meshStandardMaterial color="#0a0d10" />
        </mesh>
      </group>

      {/* Main ATmega2560 Square QFP-100 Chip */}
      <group position={[0.3, 0.06, 0.1]} rotation={[0, Math.PI / 4, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.04, 0.55]} />
          <meshStandardMaterial envMapIntensity={0.6} color="#161b22" roughness={0.3} />
        </mesh>
        <mesh position={[-0.2, 0.022, -0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.005, 12]} />
          <meshStandardMaterial color="#c9d1d9" metalness={0.8} />
        </mesh>
      </group>

      {/* Extended Double 2x18 Digital Pin Block at Right End */}
      <mesh castShadow receiveShadow position={[1.5, 0.14, 0.0]}>
        <boxGeometry args={[0.28, 0.18, 1.45]} />
        <meshStandardMaterial envMapIntensity={0.5} color="#0d1117" roughness={0.5} />
      </mesh>

      {/* Top and Bottom Female Header Sockets */}
      <mesh castShadow receiveShadow position={[-0.2, 0.14, -0.72]}>
        <boxGeometry args={[2.2, 0.18, 0.14]} />
        <meshStandardMaterial envMapIntensity={0.5} color="#0d1117" roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.2, 0.14, 0.72]}>
        <boxGeometry args={[2.2, 0.18, 0.14]} />
        <meshStandardMaterial envMapIntensity={0.5} color="#0d1117" roughness={0.5} />
      </mesh>

      {/* Silver Crystal Oscillator */}
      <mesh castShadow receiveShadow position={[-0.6, 0.1, -0.4]}>
        <boxGeometry args={[0.25, 0.1, 0.14]} />
        <meshStandardMaterial envMapIntensity={1.4} color="#d1d8e0" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Reset Button */}
      <mesh castShadow receiveShadow position={[-1.4, 0.12, -0.72]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
        <meshStandardMaterial envMapIntensity={1.2} color="#c9c9c9" metalness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[-1.4, 0.18, -0.72]}>
        <cylinderGeometry args={[0.05, 0.05, 0.06, 16]} />
        <meshStandardMaterial color="#ff3838" emissive="#ff3838" emissiveIntensity={0.3} />
      </mesh>

      {/* Status LEDs */}
      <mesh position={[-0.9, 0.045, -0.15]}>
        <boxGeometry args={[0.06, 0.02, 0.06]} />
        <meshStandardMaterial color="#2ed573" emissive="#2ed573" emissiveIntensity={lit ? 1.8 : 0.4} />
      </mesh>
      <mesh position={[-0.9, 0.045, 0.0]}>
        <boxGeometry args={[0.06, 0.02, 0.06]} />
        <meshStandardMaterial color="#ffa801" emissive="#ffa801" emissiveIntensity={lit ? 1.5 : 0.2} />
      </mesh>

      {/* Silkscreen Mega 2560 Label */}
      <mesh position={[-0.5, 0.038, 0.35]}>
        <boxGeometry args={[1.0, 0.002, 0.25]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function TeensyBoardModel({ lit }) {
  const pinsPerSide = 14;
  return (
    <group>
      {/* Compact Deep Purple PCB Substrate for Teensy 4.0 */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.06, 1.8]} />
        <meshStandardMaterial envMapIntensity={0.7} color="#4c1d95" roughness={0.35} metalness={0.2} />
      </mesh>

      {/* Micro-USB Port */}
      <mesh castShadow receiveShadow position={[0, 0.08, -0.8]}>
        <boxGeometry args={[0.34, 0.12, 0.26]} />
        <meshStandardMaterial envMapIntensity={1.5} color="#c9d1d9" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* High Performance NXP i.MXRT1062 ARM Cortex-M7 Chip */}
      <group position={[0, 0.06, -0.1]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.04, 0.42]} />
          <meshStandardMaterial envMapIntensity={0.6} color="#161b22" roughness={0.3} />
        </mesh>
        <mesh position={[0.14, 0.022, 0.14]}>
          <cylinderGeometry args={[0.015, 0.015, 0.005, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} />
        </mesh>
      </group>

      {/* White Program Tactile Push Button */}
      <mesh castShadow receiveShadow position={[0, 0.07, 0.45]}>
        <boxGeometry args={[0.16, 0.06, 0.16]} />
        <meshStandardMaterial color="#f5f6fa" roughness={0.3} />
      </mesh>

      {/* Orange Onboard User LED (Pin 13) */}
      <mesh position={[-0.22, 0.045, -0.5]}>
        <boxGeometry args={[0.05, 0.02, 0.05]} />
        <meshStandardMaterial color="#ff9f1a" emissive="#ff9f1a" emissiveIntensity={lit ? 1.8 : 0.3} />
      </mesh>

      {/* Golden Header Pins / Castellated Pads (14 Left, 14 Right) */}
      {Array.from({ length: pinsPerSide }).map((_, i) => (
        <mesh castShadow receiveShadow key={`teensy-l-${i}`} position={[-0.38, 0.05, -0.75 + i * 0.115]}>
          <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      {Array.from({ length: pinsPerSide }).map((_, i) => (
        <mesh castShadow receiveShadow key={`teensy-r-${i}`} position={[0.38, 0.05, -0.75 + i * 0.115]}>
          <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

export function RaspberryPi4Model({ lit }) {
  return (
    <group>
      {/* Iconic Raspberry Pi Green PCB Substrate (Full Pi Format) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.07, 1.8]} />
        <meshStandardMaterial envMapIntensity={0.65} color="#008040" roughness={0.35} metalness={0.2} />
      </mesh>

      {/* Corner Mounting Holes */}
      {[[-1.15, -0.75], [-1.15, 0.75], [1.15, -0.75], [1.15, 0.75]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.038, z]}>
          <cylinderGeometry args={[0.08, 0.08, 0.005, 16]} />
          <meshStandardMaterial color="#c9d1d9" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Broadcom BCM2711 SoC Chip with Metal Heat Spreader */}
      <mesh castShadow receiveShadow position={[-0.2, 0.07, 0.1]}>
        <boxGeometry args={[0.55, 0.05, 0.55]} />
        <meshStandardMaterial envMapIntensity={1.4} color="#a0a7b0" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Dual Stacked Blue USB 3.0 Ports */}
      <group position={[1.1, 0.22, -0.45]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.45, 0.38, 0.42]} />
          <meshStandardMaterial envMapIntensity={1.5} color="#c9d1d9" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0.226, 0, 0]}>
          <boxGeometry args={[0.01, 0.28, 0.3]} />
          <meshStandardMaterial color="#0077b6" />
        </mesh>
      </group>

      {/* Dual Stacked Black USB 2.0 Ports */}
      <group position={[1.1, 0.22, 0.05]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.45, 0.38, 0.42]} />
          <meshStandardMaterial envMapIntensity={1.5} color="#c9d1d9" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0.226, 0, 0]}>
          <boxGeometry args={[0.01, 0.28, 0.3]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      </group>

      {/* Gigabit Ethernet RJ45 Port */}
      <group position={[1.1, 0.24, 0.55]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.48, 0.4, 0.44]} />
          <meshStandardMaterial envMapIntensity={1.5} color="#c9d1d9" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0.241, 0, 0]}>
          <boxGeometry args={[0.01, 0.28, 0.32]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      </group>

      {/* Dual Micro-HDMI Ports & USB-C Power along bottom edge */}
      <mesh castShadow receiveShadow position={[-0.7, 0.1, 0.76]}>
        <boxGeometry args={[0.3, 0.12, 0.25]} />
        <meshStandardMaterial envMapIntensity={1.5} color="#c9d1d9" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.2, 0.1, 0.76]}>
        <boxGeometry args={[0.25, 0.1, 0.22]} />
        <meshStandardMaterial envMapIntensity={1.5} color="#c9d1d9" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.2, 0.1, 0.76]}>
        <boxGeometry args={[0.25, 0.1, 0.22]} />
        <meshStandardMaterial envMapIntensity={1.5} color="#c9d1d9" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* 40-Pin Double Row GPIO Header Block along top edge */}
      <mesh castShadow receiveShadow position={[-0.1, 0.14, -0.72]}>
        <boxGeometry args={[1.85, 0.18, 0.2]} />
        <meshStandardMaterial envMapIntensity={0.5} color="#0d1117" roughness={0.5} />
      </mesh>

      {/* Red Power LED & Green ACT Activity LED */}
      <mesh position={[-1.1, 0.045, 0.6]}>
        <boxGeometry args={[0.06, 0.02, 0.06]} />
        <meshStandardMaterial color="#ff3838" emissive="#ff3838" emissiveIntensity={lit ? 1.8 : 0.4} />
      </mesh>
      <mesh position={[-0.98, 0.045, 0.6]}>
        <boxGeometry args={[0.06, 0.02, 0.06]} />
        <meshStandardMaterial color="#2ed573" emissive="#2ed573" emissiveIntensity={lit ? 1.8 : 0.3} />
      </mesh>
    </group>
  );
}

export function Esp32CamModel({ lit }) {
  const pinsPerSide = 8;
  return (
    <group>
      {/* Matte Dark Board Substrate for ESP32-CAM AI-Thinker */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.06, 1.8]} />
        <meshStandardMaterial envMapIntensity={0.6} color="#181c24" roughness={0.35} metalness={0.2} />
      </mesh>

      {/* ESP-32S Metallic Shield Box */}
      <mesh castShadow receiveShadow position={[0, 0.1, -0.2]}>
        <boxGeometry args={[0.75, 0.08, 0.85]} />
        <meshStandardMaterial envMapIntensity={1.4} color="#a0a7b0" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* MicroSD Card Reader Slot Housing */}
      <mesh castShadow receiveShadow position={[0, 0.08, 0.5]}>
        <boxGeometry args={[0.65, 0.06, 0.6]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#c9d1d9" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* OV2640 Camera Lens Housing Module */}
      <group position={[0, 0.18, 0.45]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.36, 0.12, 0.36]} />
          <meshStandardMaterial color="#111111" roughness={0.3} />
        </mesh>
        {/* Camera Lens Element */}
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.03, 20]} />
          <meshPhysicalMaterial color="#1e272e" roughness={0.1} clearcoat={0.9} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.086, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.005, 16]} />
          <meshStandardMaterial color="#45d8c4" roughness={0.1} emissive="#45d8c4" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* High-Power White Flash LED */}
      <mesh position={[-0.32, 0.06, 0.65]}>
        <boxGeometry args={[0.1, 0.03, 0.1]} />
        <meshStandardMaterial
          color={lit ? "#ffffff" : "#f1f2f6"}
          emissive={lit ? "#ffffff" : "#000000"}
          emissiveIntensity={lit ? 3.0 : 0}
        />
      </mesh>

      {/* 16 Golden Header Pins (8 Left, 8 Right) */}
      {Array.from({ length: pinsPerSide }).map((_, i) => (
        <mesh castShadow receiveShadow key={`cam-l-${i}`} position={[-0.52, 0.06, -0.65 + i * 0.18]}>
          <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      {Array.from({ length: pinsPerSide }).map((_, i) => (
        <mesh castShadow receiveShadow key={`cam-r-${i}`} position={[0.52, 0.06, -0.65 + i * 0.18]}>
          <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

export function DevBoardModel({ lit, node, partKey, modelType, key, name }) {
  const k = (partKey || node?.key || key || node?.name || name || node?.modelType || modelType || "").toLowerCase();

  if (k.includes("mega") || k.includes("2560")) return <ArduinoMegaModel lit={lit} />;
  if (k.includes("teensy")) return <TeensyBoardModel lit={lit} />;
  if (k.includes("pi_4") || k.includes("raspberry_pi_4") || k.includes("rpi4") || k.includes("rpi_4")) return <RaspberryPi4Model lit={lit} />;
  if (k.includes("cam") || k.includes("esp32_cam") || k.includes("esp32-cam")) return <Esp32CamModel lit={lit} />;
  if (k.includes("uno") || k.includes("arduino_uno")) return <ArduinoUnoModel lit={lit} />;
  if (k.includes("pico") || k.includes("raspberry")) return <RaspberryPiPicoModel lit={lit} />;
  if (k.includes("nano") || k.includes("arduino_nano")) return <ArduinoNanoModel lit={lit} />;
  if (k.includes("stm32") || k.includes("blue_pill")) return <Stm32BoardModel lit={lit} />;
  if (k.includes("nodemcu") || k.includes("esp8266")) return <NodeMcuBoardModel lit={lit} />;
  if (k.includes("microbit")) return <MicrobitBoardModel lit={lit} />;
  if (k.includes("neopixel")) return <NeopixelRingModel lit={lit} />;

  return <Esp32BoardModel lit={lit} />;
}




/* ---------------- Power (additional) ---------------- */

export function CoinCellModel() {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.12, 28]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.065, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.01, 28]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#8a8f96" metalness={0.7} roughness={0.3} />
      </mesh>
      <Lead position={[0, -0.4, 0]} length={0.5} />
      <Lead position={[0, 0.4, 0]} length={0.5} />
    </group>
  );
}

export function BenchPsuModel() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.6, 1, 0.9]} />
        <meshStandardMaterial envMapIntensity={0.7} color="#3a4552" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.4, 0.15, 0.46]}>
        <boxGeometry args={[0.5, 0.28, 0.02]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#1a1f26" roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.4, 0.15, 0.47]}>
        <boxGeometry args={[0.42, 0.16, 0.01]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#3ddc84" emissive="#2fd66f" emissiveIntensity={0.6} />
      </mesh>
      {[0.15, 0.5].map((x, i) => (
        <mesh castShadow receiveShadow key={i} position={[x, -0.15, 0.46]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.06, 20]} />
          <meshStandardMaterial envMapIntensity={0.4} color="#111318" roughness={0.6} />
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
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.35, 0.5]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0, 0.05]}>
        <boxGeometry args={[0.7, 0.22, 0.35]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#15181c" roughness={0.4} />
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
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.4, 0.9]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#1a1a1a" roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#e7edf3" />
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
      <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.42, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#e0e0e0" transparent opacity={0.55} roughness={0.15} />
      </mesh>
      {[["#ff3b3b", -0.15], ["#3ddc84", 0], ["#4a90ff", 0.15]].map(([c, x], i) => (
        <mesh castShadow receiveShadow key={i} position={[x, 0.12, 0.1]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial envMapIntensity={0.4} color={c} emissive={c} emissiveIntensity={0.8} />
        </mesh>
      ))}
      <mesh castShadow receiveShadow position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.3, 24]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#e0e0e0" transparent opacity={0.4} roughness={0.2} />
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
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.5, 0.6]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#15181c" roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.28, on ? -0.08 : 0.08]} rotation={[on ? -0.25 : 0.25, 0, 0]}>
        <boxGeometry args={[0.6, 0.3, 0.18]} />
        <meshStandardMaterial envMapIntensity={0.4} color={color} emissive={color} emissiveIntensity={0.3} roughness={0.4} />
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
      <mesh castShadow receiveShadow position={[0, -0.1, 0]}>
        <boxGeometry args={[1, 0.15, 0.4]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#232e3a" roughness={0.6} />
      </mesh>
      <mesh castShadow receiveShadow position={[knobX, 0.02, 0]}>
        <boxGeometry args={[0.3, 0.12, 0.3]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#e8e8e8" roughness={0.4} />
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
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.5, 0.6]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#1a3a63" roughness={0.5} />
      </mesh>
      {[-0.32, 0.32].map((x, i) => (
        <mesh castShadow receiveShadow key={i} position={[x, 0.05, 0.28]}>
          <cylinderGeometry args={[0.22, 0.22, 0.22, 24]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.6} roughness={0.35} />
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
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 0.18, 0.5]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#1a3a63" roughness={0.5} />
      </mesh>
      {[-0.25, 0.25].map((x, i) => (
        <mesh castShadow receiveShadow key={i} position={[x, 0.14, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.14, 16]} />
          <meshStandardMaterial envMapIntensity={0.4} color={i === 0 ? "#3a2a6a" : "#1a1a1a"} roughness={0.3} />
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
      <mesh castShadow receiveShadow position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.15, 24]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#e7edf3" roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.4, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#f5f5f0" transparent opacity={0.75} roughness={0.2} />
      </mesh>
      <Lead position={[-0.12, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
      <Lead position={[0.12, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
    </group>
  );
}

export function GasSensorModel() {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, -0.15, 0]}>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#1a3a63" roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.4, 20]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.37, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.03, 20]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#7a828c" metalness={0.5} roughness={0.4} />
      </mesh>
      <Lead position={[-0.25, -0.25, 0.3]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
      <Lead position={[0.25, -0.25, 0.3]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
    </group>
  );
}

export function HumiditySensorModel() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.8, 1, 0.35]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#2e6fbd" roughness={0.4} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.15, 0.18]}>
        <boxGeometry args={[0.5, 0.35, 0.03]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#e7edf3" roughness={0.6} />
      </mesh>
      <Lead position={[-0.15, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.4} />
      <Lead position={[0.15, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.4} />
    </group>
  );
}

export function TouchSensorModel() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.08, 24]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#1a3a63" roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 24]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#e8a33d" metalness={0.6} roughness={0.3} emissive="#e8a33d" emissiveIntensity={0.2} />
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
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1.3, 0.2]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#15181c" roughness={0.5} />
      </mesh>
      {segments.map(([x, y, w, h], i) => (
        <mesh castShadow receiveShadow key={i} position={[x, y, 0.11]}>
          <boxGeometry args={[w, h, 0.02]} />
          <meshStandardMaterial envMapIntensity={0.4} color="#ff3b3b" emissive="#ff2222" emissiveIntensity={0.9} />
        </mesh>
      ))}
      <mesh castShadow receiveShadow position={[0.4, -0.55, 0.11]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#ff3b3b" emissive="#ff2222" emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
}

export function LcdDisplayModel() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.9, 0.15]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#e7edf3" roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0, 0.09]}>
        <boxGeometry args={[1.5, 0.55, 0.02]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#3ddc84" emissive="#1f9a51" emissiveIntensity={0.5} roughness={0.3} />
      </mesh>
      <Lead position={[-0.7, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
      <Lead position={[0.7, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
    </group>
  );
}

export function OledDisplayModel() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 0.7, 0.1]} />
        <meshStandardMaterial envMapIntensity={0.7} color="#0a0e13" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0, 0.06]}>
        <boxGeometry args={[0.8, 0.45, 0.01]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#4a90ff" emissive="#2f6fe0" emissiveIntensity={0.7} />
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
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.1, 1.1, 0.15]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#15181c" roughness={0.5} />
      </mesh>
      {Array.from({ length: n }).map((_, row) =>
        Array.from({ length: n }).map((_, col) => (
          <mesh castShadow receiveShadow key={`${row}-${col}`} position={[-0.4 + col * 0.2, -0.4 + row * 0.2, 0.09]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial envMapIntensity={0.4} color="#ff3b3b" emissive="#ff2222" emissiveIntensity={0.7} />
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
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.9, 0.5]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#2e6fbd" roughness={0.4} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.12, 20]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.65, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.5, 0.06, 0.1]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#e8e8e8" roughness={0.4} />
      </mesh>
      <Lead position={[-0.1, -0.55, 0.3]} rotation={[Math.PI / 2, 0, 0]} length={0.35} />
      <Lead position={[0.1, -0.55, 0.3]} rotation={[Math.PI / 2, 0, 0]} length={0.35} />
    </group>
  );
}

export function StepperMotorModel() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.9, 0.7]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#8a8f96" metalness={0.5} roughness={0.4} />
      </mesh>
      {[[-0.38, -0.38], [0.38, -0.38], [-0.38, 0.38], [0.38, 0.38]].map(([x, y], i) => (
        <mesh castShadow receiveShadow key={i} position={[x, y, 0.36]}>
          <cylinderGeometry args={[0.05, 0.05, 0.1, 10]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial envMapIntensity={0.4} color="#333333" />
        </mesh>
      ))}
      <mesh castShadow receiveShadow position={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.8} roughness={0.2} />
      </mesh>
      <Lead position={[-0.1, -0.5, -0.3]} length={0.3} />
      <Lead position={[0.1, -0.5, -0.3]} length={0.3} />
    </group>
  );
}

export function FanModel() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1, 0.25]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#15181c" roughness={0.5} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh castShadow receiveShadow key={i} position={[0, 0, 0.15]} rotation={[0, 0, angle]}>
            <mesh castShadow receiveShadow position={[0.22, 0, 0]}>
              <boxGeometry args={[0.32, 0.12, 0.03]} />
              <meshStandardMaterial envMapIntensity={0.4} color="#7a828c" roughness={0.4} />
            </mesh>
          </mesh>
        );
      })}
      <mesh castShadow receiveShadow position={[0, 0, 0.16]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#333333" />
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
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.4, 0.3]} />
        <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.75} roughness={0.25} />
      </mesh>
      <Lead position={[0, -0.35, 0]} length={0.4} />
      <Lead position={[0, 0.35, 0]} length={0.4} />
    </group>
  );
}

export function BreadboardModel() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 0.15, 1.2]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#e8e4d8" roughness={0.6} />
      </mesh>
      {Array.from({ length: 10 }).map((_, col) =>
        Array.from({ length: 4 }).map((_, row) => (
          <mesh castShadow receiveShadow key={`${col}-${row}`} position={[-0.85 + col * 0.19, 0.08, -0.4 + row * 0.28]}>
            <cylinderGeometry args={[0.02, 0.02, 0.04, 6]} />
            <meshStandardMaterial envMapIntensity={0.4} color="#2b2f36" />
          </mesh>
        ))
      )}
      <mesh castShadow receiveShadow position={[0, 0.08, 0.52]}>
        <boxGeometry args={[1.9, 0.02, 0.06]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#ff4757" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.08, -0.52]}>
        <boxGeometry args={[1.9, 0.02, 0.06]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#2b2f36" />
      </mesh>
    </group>
  );
}

export function TerminalBlockModel() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 0.5, 0.5]} />
        <meshStandardMaterial envMapIntensity={0.4} color="#1a8a4a" roughness={0.5} />
      </mesh>
      {[-0.25, 0.25].map((x, i) => (
        <mesh castShadow receiveShadow key={i} position={[x, 0.28, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.1, 12]} />
          <meshStandardMaterial envMapIntensity={1.3} color="#c9c9c9" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      <Lead position={[-0.25, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
      <Lead position={[0.25, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]} length={0.3} />
    </group>
  );
}

export function SoilMoistureSensorModel() {
  return (
    <group>
      {/* Sensor Control PCB Board */}
      <mesh castShadow receiveShadow position={[0, 0.08, -0.4]}>
        <boxGeometry args={[0.7, 0.06, 0.6]} />
        <meshStandardMaterial envMapIntensity={0.6} color="#181c24" roughness={0.35} metalness={0.2} />
      </mesh>
      {/* Blue Potentiometer Trim */}
      <mesh castShadow receiveShadow position={[0, 0.14, -0.4]}>
        <boxGeometry args={[0.2, 0.08, 0.2]} />
        <meshStandardMaterial color="#0077b6" />
      </mesh>
      {/* Dual Gold PCB Probe Prongs */}
      <mesh castShadow receiveShadow position={[-0.2, 0.04, 0.4]}>
        <boxGeometry args={[0.15, 0.03, 1.0]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.2, 0.04, 0.4]}>
        <boxGeometry args={[0.15, 0.03, 1.0]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function FlameSensorModel() {
  return (
    <group>
      {/* Sensor Module PCB */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.06, 1.1]} />
        <meshStandardMaterial envMapIntensity={0.6} color="#1f5690" roughness={0.35} metalness={0.25} />
      </mesh>
      {/* IR Receiver LED Lens at top */}
      <mesh castShadow receiveShadow position={[0, 0.08, -0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.2, 16]} />
        <meshStandardMaterial color="#111111" roughness={0.2} />
      </mesh>
      <Lead position={[-0.15, -0.4, 0.45]} rotation={[Math.PI / 2, 0, 0]} length={0.4} />
      <Lead position={[0.15, -0.4, 0.45]} rotation={[Math.PI / 2, 0, 0]} length={0.4} />
    </group>
  );
}

export function WaterLevelSensorModel() {
  return (
    <group>
      {/* PCB Card */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.65, 0.05, 1.6]} />
        <meshStandardMaterial envMapIntensity={0.6} color="#0077b6" roughness={0.35} metalness={0.2} />
      </mesh>
      {/* Parallel Gold Trace Lines */}
      {[-0.2, -0.07, 0.07, 0.2].map((x, i) => (
        <mesh key={i} position={[x, 0.03, 0.1]}>
          <boxGeometry args={[0.06, 0.005, 1.2]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}
    </group>
  );
}

export function NixieTubeModel({ lit }) {
  return (
    <group>
      {/* Black Socket Base */}
      <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.2, 24]} />
        <meshStandardMaterial color="#161b22" roughness={0.5} />
      </mesh>
      {/* Glass Bulb Envelope */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 1.0, 24]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.35} roughness={0.05} clearcoat={1} />
      </mesh>
      {/* Orange Glowing Filament Digit 8 */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.18, 0.5, 0.02]} />
        <meshStandardMaterial
          color="#ffa801"
          emissive="#ffa801"
          emissiveIntensity={lit ? 3.0 : 0.6}
        />
      </mesh>
    </group>
  );
}

export function HeatSinkModel() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.8, 0.6]} />
        <meshStandardMaterial envMapIntensity={1.4} color="#57606f" metalness={0.8} roughness={0.25} />
      </mesh>
      {[-0.35, -0.12, 0.12, 0.35].map((x, i) => (
        <mesh key={i} position={[x, 0.45, 0]}>
          <boxGeometry args={[0.08, 0.5, 0.58]} />
          <meshStandardMaterial envMapIntensity={1.4} color="#57606f" metalness={0.8} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

export const MODEL_BY_TYPE = {
  resistor: ResistorModel,
  resistor_variable: PotentiometerModel,
  capacitor_electrolytic: CapacitorElectrolyticModel,
  capacitor_ceramic: CapacitorCeramicModel,
  polyester_capacitor: CapacitorCeramicModel,
  varistor: CapacitorCeramicModel,
  inductor: InductorModel,
  ferrite_bead: InductorModel,
  potentiometer: PotentiometerModel,
  fuse: FuseModel,
  wire: WireModel,
  jumper_wire: WireModel,

  led: LedModel,
  ir_led: LedModel,
  laser_diode: DiodeModel,
  diode: DiodeModel,
  zener_diode: DiodeModel,
  schottky_diode: DiodeModel,
  transistor: TransistorModel,
  transistor_npn: TransistorModel,
  transistor_pnp: TransistorModel,
  mosfet: MosfetModel,
  voltage_regulator: VoltageRegulatorModel,

  ic_dip: IcDipModel,
  ic_555: Ic555Model,
  ic_opamp: IcOpampModel,
  microcontroller_atmega328: MicrocontrollerAtmega328Model,
  eeprom_ic: EepromIcModel,
  adc_ic: AdcIcModel,
  ic_socket: IcSocketModel,
  logic_and: LogicAndModel,
  logic_or: LogicOrModel,
  logic_xor: LogicXorModel,
  logic_nand: LogicNandModel,
  logic_nor: LogicNorModel,
  logic_not: LogicNotModel,
  flip_flop: FlipFlopModel,

  battery_9v: Battery9vModel,
  battery_aa: BatteryAaModel,
  lithium_battery: BatteryAaModel,
  solar_panel: SolarPanelModel,
  power_bank: BenchPsuModel,

  switch: SwitchModel,
  push_button: PushButtonModel,
  relay: RelayModel,
  dip_switch: DipSwitchModel,
  limit_switch: SwitchModel,
  reed_switch: SwitchModel,

  buzzer: BuzzerModel,
  dc_motor: DcMotorModel,
  solenoid: DcMotorModel,
  vibration_motor: DcMotorModel,
  speaker: SpeakerModel,

  ldr: LdrModel,
  thermistor: ThermistorModel,
  temperature_sensor: To92SensorModel,
  photodiode: DiodeModel,
  hall_effect_sensor: To92SensorModel,
  accelerometer: AccelerometerIcModel,
  soil_moisture_sensor: SoilMoistureSensorModel,
  flame_sensor: FlameSensorModel,
  water_level_sensor: WaterLevelSensorModel,

  dev_board: DevBoardModel,
  esp32: Esp32BoardModel,
  microbit: MicrobitBoardModel,
  neopixel_ring: NeopixelRingModel,
  arduino_uno: ArduinoUnoModel,
  arduino: ArduinoUnoModel,
  uno: ArduinoUnoModel,
  arduino_mega: ArduinoMegaModel,
  arduino_mega_2560: ArduinoMegaModel,
  mega: ArduinoMegaModel,
  teensy: TeensyBoardModel,
  teensy40: TeensyBoardModel,
  raspberry_pi_4: RaspberryPi4Model,
  rpi4: RaspberryPi4Model,
  esp32_cam: Esp32CamModel,
  esp32cam: Esp32CamModel,
  raspberry_pi_pico: RaspberryPiPicoModel,
  pico: RaspberryPiPicoModel,
  arduino_nano: ArduinoNanoModel,
  nano: ArduinoNanoModel,
  nodemcu: NodeMcuBoardModel,
  esp8266: NodeMcuBoardModel,
  stm32: Stm32BoardModel,
  stm32_blue_pill: Stm32BoardModel,
  blue_pill: Stm32BoardModel,

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
  seven_segment_display: SevenSegmentModel,
  lcd_display: LcdDisplayModel,
  oled_display: OledDisplayModel,
  led_matrix: LedMatrixModel,
  rgb_led_display: LedMatrixModel,
  nixie_tube: NixieTubeModel,

  servo_motor: ServoMotorModel,
  servo_sg90: ServoMotorModel,
  servo: ServoMotorModel,
  sg90: ServoMotorModel,
  stepper_motor: StepperMotorModel,
  fan: FanModel,

  crystal_oscillator: CrystalOscillatorModel,
  breadboard: BreadboardModel,
  terminal_block: TerminalBlockModel,
  heat_sink: HeatSinkModel,

  acs712: To92SensorModel,
  uln2003: IcDipModel,
  mcp4725: IcDipModel,
  ssd1306: OledDisplayModel,
  hc_sr04: UltrasonicSensorModel,
};