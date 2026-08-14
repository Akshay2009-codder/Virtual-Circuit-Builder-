import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import { MODEL_BY_TYPE } from "./PartModels";

export default function PartViewer({ modelType, partKey, name }) {
  const Model = (partKey && MODEL_BY_TYPE[partKey]) || (modelType && MODEL_BY_TYPE[modelType]) || MODEL_BY_TYPE.resistor;

  return (
    <div style={{ width: "100%", height: "100%", background: "#131920" }}>
      <Canvas camera={{ position: [1.8, 1.4, 2.2], fov: 40 }} dpr={[1, 2]} shadows="soft">
        <color attach="background" args={["#131920"]} />

        {/* Real reflected highlights on component materials */}
        <Environment preset="city" resolution={256} background={false} />

        <ambientLight intensity={0.35} />
        <hemisphereLight args={["#cfe8ff", "#1a120a", 0.35]} />

        {/* Key light casting clean soft shadow */}
        <directionalLight
          position={[3, 4, 2]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0006}
        />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#45d8c4" />
        <directionalLight position={[0, 1.5, -3]} intensity={0.4} color="#8fd6ff" />

        <Suspense fallback={null}>
          {Model ? <Model partKey={partKey} modelType={modelType} name={name} /> : null}
          <ContactShadows position={[0, -0.95, 0]} opacity={0.65} scale={4} blur={2.0} far={2} />
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