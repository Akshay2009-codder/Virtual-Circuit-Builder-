import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import { MODEL_BY_TYPE } from "./PartModels";

export default function PartViewer({ modelType }) {
  const Model = MODEL_BY_TYPE[modelType];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [1.8, 1.4, 2.2], fov: 40 }}
        dpr={[1, 2]}
        gl={{ toneMappingExposure: 1.3 }}
      >
        <color attach="background" args={["#10161d"]} />

        {/* hemisphere ambient reads far less flat than a single flat ambientLight -
            cool "sky" tint from above, warm "ground" tint from below */}
        <hemisphereLight args={["#8fb8ff", "#1a120a", 0.65]} />
        <directionalLight position={[3, 4, 2]} intensity={1.3} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.45} color="#45d8c4" />
        {/* soft fill near the camera so the face we're actually looking at isn't underlit */}
        <pointLight position={[1.5, 0.8, 2.5]} intensity={0.4} color="#ffffff" />

        <Suspense fallback={null}>
          {Model ? <Model /> : null}
          <ContactShadows position={[0, -0.95, 0]} opacity={0.5} scale={4} blur={2.4} far={2} />
          {/* gives metal/glossy materials something to actually reflect -
              without this, leads/pins/terminals render flat and dull */}
          <Environment preset="city" background={false} />
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