import { useMemo } from "react";
import * as THREE from "three";

export default function Wire3D({ start, end, color = "#2fd66f", powered = false }) {
  const { tubeGeometry, startVec, endVec } = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const dist = s.distanceTo(e);

    // Natural 3D arching curve between terminals
    const midX = (start[0] + end[0]) / 2;
    const midY = Math.max(start[1], end[1]) + Math.min(0.5, 0.15 + dist * 0.12);
    const midZ = (start[2] + end[2]) / 2;
    const m = new THREE.Vector3(midX, midY, midZ);

    const curve = new THREE.CatmullRomCurve3([s, m, e]);
    const geo = new THREE.TubeGeometry(curve, 36, 0.038, 12, false);

    return { tubeGeometry: geo, startVec: s, endVec: e };
  }, [start, end]);

  return (
    <group raycast={() => null}>
      {/* Physical 3D Cable */}
      <mesh geometry={tubeGeometry} castShadow receiveShadow raycast={() => null}>
        <meshPhysicalMaterial
          color={color}
          roughness={0.3}
          metalness={0.15}
          clearcoat={0.7}
          clearcoatRoughness={0.2}
          envMapIntensity={1.3}
          emissive={powered ? color : "#000000"}
          emissiveIntensity={powered ? 0.5 : 0}
        />
      </mesh>

      {/* Terminal Connector Pins at Start & End */}
      <mesh position={startVec.toArray()} castShadow receiveShadow raycast={() => null}>
        <cylinderGeometry args={[0.048, 0.048, 0.1, 16]} />
        <meshStandardMaterial color="#cfd8dc" metalness={0.9} roughness={0.25} envMapIntensity={1.2} />
      </mesh>
      <mesh position={endVec.toArray()} castShadow receiveShadow raycast={() => null}>
        <cylinderGeometry args={[0.048, 0.048, 0.1, 16]} />
        <meshStandardMaterial color="#cfd8dc" metalness={0.9} roughness={0.25} envMapIntensity={1.2} />
      </mesh>
    </group>
  );
}
