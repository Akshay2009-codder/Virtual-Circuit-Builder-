import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { MODEL_BY_TYPE } from "./PartModels";

export default function PartViewer({ modelType }) {
  const Model = MODEL_BY_TYPE[modelType];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [1.8, 1.4, 2.2], fov: 40 }} dpr={[1, 2]}>
        <color attach="background" args={["#10161d"]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 4, 2]} intensity={1.1} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.35} color="#45d8c4" />

        <Suspense fallback={null}>
          {Model ? <Model /> : null}
          <ContactShadows position={[0, -0.95, 0]} opacity={0.5} scale={4} blur={2.4} far={2} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={1.6}
          maxDistance={4}
          autoRotate
          autoRotateSpeed={2.2}
        />
      </Canvas>
    </div>
  );
}