import { Canvas } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import SatelliteModel from "./SatelliteModel";

export default function Scene({ partsRef, labelsRef, sceneRootRef, cameraRef, controlsRef, onReady }) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.3, 4.2], fov: 32 }}
      onCreated={({ camera }) => {
        cameraRef.current = camera;
      }}
    >
      <color attach="background" args={["#0a0d12"]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 2]} intensity={1.7} color="#fff3e0" />
      <directionalLight position={[-3, -1, -2]} intensity={0.45} color="#4fd1c5" />
      {/* Rim/fill lights stand in for an HDR environment map — this keeps
          the scene fully self-contained (no external asset fetch at
          runtime, unlike drei's <Environment>, which pulls an .hdr file
          from a CDN and can crash the whole tree if that request fails). */}
      <pointLight position={[-2, 2, -2]} intensity={0.5} color="#ffb020" />
      <pointLight position={[2, -1.5, 2]} intensity={0.3} color="#8899ff" />
      <OrbitControls
        ref={controlsRef}
        enabled={false}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        target={[0, 0, 0]}
      />

      <group ref={sceneRootRef}>
        <SatelliteModel partsRef={partsRef} onReady={onReady} />

        {/* Part labels for the exploded view, hidden (opacity 0) until revealed */}
        <Html
          position={[-1.5, 0, 0]}
          center
          ref={(el) => labelsRef.current && (labelsRef.current.panelL = el)}
          style={{ opacity: 0, transition: "opacity 0.4s" }}
        >
          <div className="part-tag" data-label="panelL">
            <em>MOD-02</em> Solar array
          </div>
        </Html>
        <Html
          position={[1.5, 0, 0]}
          center
          ref={(el) => labelsRef.current && (labelsRef.current.panelR = el)}
          style={{ opacity: 0, transition: "opacity 0.4s" }}
        >
          <div className="part-tag" data-label="panelR">
            <em>MOD-02</em> Solar array
          </div>
        </Html>
        <Html
          position={[0, 1.3, -0.3]}
          center
          ref={(el) => labelsRef.current && (labelsRef.current.antenna = el)}
          style={{ opacity: 0, transition: "opacity 0.4s" }}
        >
          <div className="part-tag" data-label="antenna">
            <em>MOD-03</em> UHF whip
          </div>
        </Html>
        <Html
          position={[0, -0.1, 1.3]}
          center
          ref={(el) => labelsRef.current && (labelsRef.current.sensor = el)}
          style={{ opacity: 0, transition: "opacity 0.4s" }}
        >
          <div className="part-tag" data-label="sensor">
            <em>MOD-04</em> Sensor tray
          </div>
        </Html>
        <Html
          position={[0, 0, 0]}
          center
          ref={(el) => labelsRef.current && (labelsRef.current.chassis = el)}
          style={{ opacity: 0, transition: "opacity 0.4s" }}
        >
          <div className="part-tag" data-label="chassis">
            <em>MOD-01</em> Chassis
          </div>
        </Html>
      </group>

      <ContactShadows position={[0, -0.85, 0]} opacity={0.5} scale={6} blur={2.4} far={2} />
    </Canvas>
  );
}
