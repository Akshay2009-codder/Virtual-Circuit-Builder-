import React, { Suspense, Component } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
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
        <div style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#131920",
          color: "#94a3b8",
          padding: "20px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "36px", marginBottom: "10px" }}>⚡</div>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc" }}>
            {this.props.name || "3D Component Model"}
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
            Interactive 3D preview fallback
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function SafeEnvironment() {
  return (
    <Suspense fallback={null}>
      <Environment preset="city" resolution={256} background={false} />
    </Suspense>
  );
}

export default function PartViewer({ modelType, partKey, name }) {
  const Model = (partKey && MODEL_BY_TYPE[partKey]) || 
                (modelType && MODEL_BY_TYPE[modelType]) || 
                MODEL_BY_TYPE.resistor;

  return (
    <ViewErrorBoundary name={name}>
      <div style={{ width: "100%", height: "100%", background: "#131920", position: "relative" }}>
        <Canvas camera={{ position: [1.8, 1.4, 2.2], fov: 40 }} dpr={[1, 2]} shadows="soft">
          <color attach="background" args={["#131920"]} />

          {/* Safe environment with fallback */}
          <SafeEnvironment />

          <ambientLight intensity={0.45} />
          <hemisphereLight args={["#cfe8ff", "#1a120a", 0.45]} />

          {/* Studio Key Light */}
          <directionalLight
            position={[3, 4, 2]}
            intensity={2.0}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0006}
          />
          <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#45d8c4" />
          <directionalLight position={[0, 1.5, -3]} intensity={0.5} color="#8fd6ff" />

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