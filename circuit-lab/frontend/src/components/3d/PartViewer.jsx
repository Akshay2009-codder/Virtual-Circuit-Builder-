import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import { MODEL_BY_TYPE } from "./PartModels";

export default function PartViewer({ modelType }) {
  const Model = MODEL_BY_TYPE[modelType];

  return (
    <div style={{ width: "100%", height: "100%", background: "#ffffff" }}>
      <Canvas camera={{ position: [1.8, 1.4, 2.2], fov: 40 }} dpr={[1, 2]} shadows="soft">
        <color attach="background" args={["#ffffff"]} />

        {/* Real reflected highlights on the part's material */}
        <Environment preset="city" resolution={256} background={false} />

        {/* Hemisphere fill tailored for white canvas background */}
        <ambientLight intensity={0.5} />
        <hemisphereLight args={["#ffffff", "#e2e8f0", 0.45]} />

        {/* Key light casting clean soft shadow on white canvas */}
        <directionalLight
          position={[3, 4, 2]}
          intensity={1.35}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0006}
        />
        <directionalLight position={[-3, 2, -2]} intensity={0.35} color="#8ea0b3" />
        <directionalLight position={[0, 1.5, -3]} intensity={0.3} color="#ffffff" />

        <Suspense fallback={null}>
          {Model ? <Model /> : null}
          <ContactShadows position={[0, -0.95, 0]} opacity={0.3} scale={4} blur={2.2} far={2} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableDamping
          dampingFactor={0.1}
          minDistance={1.6}
          maxDistance={4}
          autoRotate
          autoRotateSpeed={2.2}
        />
      </Canvas>
    </div>
  );
}