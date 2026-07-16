import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

export default function Wire3D({ start, end, color = "#2fd66f" }) {
  const lineRef = useRef();

  const mid = [
    (start[0] + end[0]) / 2,
    Math.max(start[1], end[1]) + 0.35,
    (start[2] + end[2]) / 2,
  ];
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(...start),
    new THREE.Vector3(...mid),
    new THREE.Vector3(...end)
  );
  const points = curve.getPoints(24);

  // animate the dash pattern sliding along the wire - reads as current flowing
  useFrame((_, delta) => {
    if (lineRef.current?.material) {
      lineRef.current.material.dashOffset -= delta * 1.4;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={2.2}
      dashed
      dashSize={0.12}
      gapSize={0.08}
    />
  );
}
