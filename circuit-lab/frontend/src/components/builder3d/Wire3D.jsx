import { useMemo, useState } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";

function ConnectorBoot({ position, color }) {
  return (
    <group position={position}>
      {/* Outer Insulated Dupont Header Socket Housing */}
      <mesh position={[0, 0.012, 0]} castShadow receiveShadow raycast={() => null}>
        <boxGeometry args={[0.028, 0.048, 0.028]} />
        <meshStandardMaterial color="#182028" roughness={0.35} metalness={0.25} envMapIntensity={1.2} />
      </mesh>
      {/* Colored Identification Stripe / Boot Collar */}
      <mesh position={[0, 0.032, 0]} castShadow receiveShadow raycast={() => null}>
        <boxGeometry args={[0.029, 0.014, 0.029]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} envMapIntensity={1.4} />
      </mesh>
      {/* Silver Metallic Crimp Ring at wire neck */}
      <mesh position={[0, 0.042, 0]} castShadow receiveShadow raycast={() => null}>
        <cylinderGeometry args={[0.012, 0.012, 0.008, 12]} />
        <meshStandardMaterial color="#c9d1d9" roughness={0.2} metalness={0.9} envMapIntensity={1.5} />
      </mesh>
      {/* Bottom Gold Pin Socket Tip Plugging onto Component Pin */}
      <mesh position={[0, -0.012, 0]} castShadow receiveShadow raycast={() => null}>
        <cylinderGeometry args={[0.013, 0.013, 0.018, 12]} />
        <meshStandardMaterial color="#d4af37" roughness={0.2} metalness={0.9} envMapIntensity={1.5} />
      </mesh>
    </group>
  );
}

export default function Wire3D({
  start,
  startPos,
  end,
  endPos,
  color = "#2fd66f",
  powered = false,
  selected = false,
  isSelected = false,
  isPreview = false,
  onClick = null,
}) {
  const [hovered, setHovered] = useState(false);

  const activeSelected = selected || isSelected;
  const rawStart = start || startPos || [0, 0.16, 0];
  const rawEnd = end || endPos || [0, 0.16, 0];

  const { tubeGeometry, startVec, endVec, midPoint } = useMemo(() => {
    const startX = typeof rawStart[0] === "number" ? rawStart[0] : 0;
    const startY = typeof rawStart[1] === "number" ? rawStart[1] : 0.16;
    const startZ = typeof rawStart[2] === "number" ? rawStart[2] : 0;

    const endX = typeof rawEnd[0] === "number" ? rawEnd[0] : 0;
    const endY = typeof rawEnd[1] === "number" ? rawEnd[1] : 0.16;
    const endZ = typeof rawEnd[2] === "number" ? rawEnd[2] : 0;

    const s = new THREE.Vector3(startX, startY, startZ);
    const e = new THREE.Vector3(endX, endY, endZ);
    const dist = s.distanceTo(e);

    // Natural 3D cubic Bezier curve - lifts out of headers and loops naturally
    const lift = Math.min(0.38, 0.09 + dist * 0.12);
    const cp1 = new THREE.Vector3(s.x, s.y + lift, s.z);
    const cp2 = new THREE.Vector3(e.x, e.y + lift, e.z);

    const curve = new THREE.CubicBezierCurve3(s, cp1, cp2, e);
    // Ultra-thin, realistic wire width matching real electronics jumper wire
    const radius = isPreview ? 0.007 : 0.0095;
    const geo = new THREE.TubeGeometry(curve, 36, radius, 12, false);

    const midP = curve.getPoint(0.5);

    return { tubeGeometry: geo, startVec: s, endVec: e, midPoint: midP };
  }, [rawStart[0], rawStart[1], rawStart[2], rawEnd[0], rawEnd[1], rawEnd[2], isPreview]);

  const activeColor = activeSelected ? "#ffffff" : hovered ? "#ff4757" : color;

  return (
    <group>
      {/* Sleek 3D Cable Wire Tube */}
      <mesh
        geometry={tubeGeometry}
        castShadow={!isPreview}
        receiveShadow={!isPreview}
        onPointerOver={(e) => {
          if (onClick && !isPreview) {
            e.stopPropagation();
            setHovered(true);
          }
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          if (onClick && !isPreview) {
            e.stopPropagation();
            onClick();
          }
        }}
      >
        <meshPhysicalMaterial
          color={activeColor}
          roughness={0.25}
          metalness={0.2}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
          envMapIntensity={1.4}
          emissive={powered || isPreview || selected || hovered ? activeColor : "#000000"}
          emissiveIntensity={hovered ? 1.6 : isPreview ? 0.9 : selected ? 1.4 : powered ? 0.6 : 0}
          transparent={isPreview}
          opacity={isPreview ? 0.85 : 1.0}
        />
      </mesh>

      {/* Realistic Dupont Pin Connector Boots at both start and end terminal ends */}
      {!isPreview && (
        <>
          <ConnectorBoot position={[startVec.x, startVec.y, startVec.z]} color={activeColor} />
          <ConnectorBoot position={[endVec.x, endVec.y, endVec.z]} color={activeColor} />
        </>
      )}

      {/* Instant Disconnect Button on Hover */}
      {hovered && onClick && !isPreview && (
        <Html position={[midPoint.x, midPoint.y + 0.06, midPoint.z]} center distanceFactor={9}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            style={{
              background: "#ff4757",
              color: "#ffffff",
              border: "1px solid #ff6b81",
              borderRadius: "12px",
              padding: "3px 8px",
              fontSize: "10px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(255, 71, 87, 0.5)",
              whiteSpace: "nowrap",
            }}
          >
            Disconnect ✕
          </button>
        </Html>
      )}
    </group>
  );
}

