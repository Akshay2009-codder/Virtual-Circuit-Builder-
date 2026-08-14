import React, { Suspense, Component } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { MODEL_BY_TYPE } from "./PartModels";

class ViewErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("PartViewer 3D rendering fallback triggered:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#131920",
            color: "#94a3b8",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "10px" }}>⚡</div>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc" }}>
            {this.props.name || "3D Component Model"}
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
            3D Component Preview
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function PartViewer({ modelType, partKey, name }) {
  const Model =
    (partKey && MODEL_BY_TYPE[partKey]) ||
    (modelType && MODEL_BY_TYPE[modelType]) ||
    MODEL_BY_TYPE.resistor;

  return (
    <ViewErrorBoundary name={name}>
      <div style={{ width: "100%", height: "100%", background: "#131920", position: "relative" }}>
        <Canvas camera={{ position: [1.8, 1.4, 2.2], fov: 40 }} dpr={[1, 2]} shadows="soft">
          <color attach="background" args={["#131920"]} />

          {/* High-quality studio lights — 100% network-free & instant loading */}
          <ambientLight intensity={0.65} />
          <hemisphereLight args={["#ffffff", "#121820", 0.55]} />

          {/* Main Key Light */}
          <directionalLight
            position={[4, 6, 3]}
            intensity={2.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0006}
          />

          {/* Rim & Fill Lights */}
          <directionalLight position={[-4, 3, -3]} intensity={0.8} color="#45d8c4" />
          <directionalLight position={[0, 2, -5]} intensity={0.7} color="#8fd6ff" />
          <directionalLight position={[0, -3, 2]} intensity={0.3} color="#ffffff" />

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
    </ViewErrorBoundary>
  );
}