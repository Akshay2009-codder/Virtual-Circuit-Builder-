import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import { MODEL_BY_TYPE } from "./PartModels";

export default function PartViewer({ modelType }) {
  const Model = MODEL_BY_TYPE[modelType];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [1.8, 1.4, 2.2], fov: 40 }} dpr={[1, 2]} shadows="soft">
        <color attach="background" args={["#10161d"]} />

        {/* Real reflected highlights on the part's material, same source
            as the Builder bench - this is what stops a single-part preview
            from looking flat-shaded when it's the only thing on screen.
            background=false so it only feeds reflections, never overrides
            the dark backdrop above. */}
        <Environment preset="city" resolution={256} background={false} />

        {/* Hemisphere fill instead of a flat ambient - gives a soft
            cool-sky/warm-bounce gradient across the part instead of
            uniformly flattening its shading. */}
        <ambientLight intensity={0.4} />
        <hemisphereLight args={["#cfe8ff", "#2a1f18", 0.4]} />

        {/* key light - now casts a real soft shadow */}
        <directionalLight
          position={[3, 4, 2]}
          intensity={1.25}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0006}
        />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#45d8c4" />
        {/* subtle rim from behind, keeps the far edge from going flat black
            now that the key light + environment are both a bit stronger */}
        <directionalLight position={[0, 1.5, -3]} intensity={0.25} color="#ffffff" />

        <Suspense fallback={null}>
          {Model ? <Model /> : null}
          <ContactShadows position={[0, -0.95, 0]} opacity={0.5} scale={4} blur={2.4} far={2} />
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