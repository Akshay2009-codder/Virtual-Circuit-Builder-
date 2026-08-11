import { useMemo, useState } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export default function Wire3D({
  start,
  end,
  color = "#2fd66f",
  powered = false,
  selected = false,
  isPreview = false,
  onClick = null,
}) {
  const [hovered, setHovered] = useState(false);

  const { tubeGeometry, startVec, endVec, midPoint } = useMemo(() => {
    const startY = typeof start[1] === "number" ? start[1] : 0.16;
    const endY = typeof end[1] === "number" ? end[1] : 0.16;

    const s = new THREE.Vector3(start[0], startY, start[2]);
    const e = new THREE.Vector3(end[0], endY, end[2]);
    const dist = s.distanceTo(e);

    // Natural 3D cubic Bezier curve - lifts out of headers and never overshoots into sky
    const lift = Math.min(0.35, 0.08 + dist * 0.12);
    const cp1 = new THREE.Vector3(s.x, s.y + lift, s.z);
    const cp2 = new THREE.Vector3(e.x, e.y + lift, e.z);

    const curve = new THREE.CubicBezierCurve3(s, cp1, cp2, e);
    // Ultra-thin, realistic wire width matching real electronics jumper wire
    const radius = isPreview ? 0.007 : 0.0095;
    const geo = new THREE.TubeGeometry(curve, 36, radius, 12, false);

    const midP = curve.getPoint(0.5);

    return { tubeGeometry: geo, startVec: s, endVec: e, midPoint: midP };
  }, [start, end, isPreview]);

  const activeColor = selected ? "#ffffff" : hovered ? "#ff4757" : color;

  return (
    <group>
      {/* Sleek 3D Cable Wire */}
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

      {/* Dupont Female Header Pin Sockets plugging directly onto the vertical pin | */}
      {!isPreview && (
        <>
          <mesh position={[startVec.x, startVec.y, startVec.z]} castShadow receiveShadow raycast={() => null}>
            <cylinderGeometry args={[0.015, 0.015, 0.045, 12]} />
            <meshStandardMaterial color={activeColor} roughness={0.3} metalness={0.6} envMapIntensity={1.2} />
          </mesh>
          <mesh position={[endVec.x, endVec.y, endVec.z]} castShadow receiveShadow raycast={() => null}>
            <cylinderGeometry args={[0.015, 0.015, 0.045, 12]} />
            <meshStandardMaterial color={activeColor} roughness={0.3} metalness={0.6} envMapIntensity={1.2} />
          </mesh>
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
