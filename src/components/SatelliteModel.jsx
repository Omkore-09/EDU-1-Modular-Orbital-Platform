import { useMemo, useEffect, useRef } from "react";
import * as THREE from "three";

const metal = (color, opts = {}) =>
  new THREE.MeshStandardMaterial({
    color,
    metalness: 0.6,
    roughness: 0.4,
    ...opts,
  });

/**
 * A procedurally-built 1U "teaching CubeSat", assembled from primitives
 * so the whole scene stays lightweight (no external model download / no
 * network fetch needed) while still exercising real Three.js concerns:
 * grouped pivots, per-part materials, and refs the scroll timeline can
 * drive directly (imperative, not via React state, to keep scroll smooth).
 */
export default function SatelliteModel({ partsRef, onReady }) {
  const group = useRef();
  const chassis = useRef();
  const panelLPivot = useRef();
  const panelRPivot = useRef();
  const antenna = useRef();
  const sensor = useRef();

  const materials = useMemo(
    () => ({
      body: metal("#2a2f38"),
      trim: metal("#4a5262", { metalness: 0.8, roughness: 0.25 }),
      panel: new THREE.MeshStandardMaterial({
        color: "#141a34",
        metalness: 0.3,
        roughness: 0.35,
        emissive: "#1c2560",
        emissiveIntensity: 0.25,
      }),
      antenna: metal("#c7ccd4", { metalness: 0.9, roughness: 0.2 }),
      sensor: new THREE.MeshStandardMaterial({
        color: "#1a1e26",
        metalness: 0.2,
        roughness: 0.5,
        emissive: "#ffb020",
        emissiveIntensity: 0,
      }),
    }),
    []
  );

  useEffect(() => {
    if (!partsRef) return;
    partsRef.current = {
      group: group.current,
      chassis: chassis.current,
      panelL: panelLPivot.current,
      panelR: panelRPivot.current,
      antenna: antenna.current,
      sensor: sensor.current,
      materials,
    };
    // R3F mounts this scene graph through its own renderer, which can
    // commit a frame or two after the surrounding React tree's effects
    // have already run — so anything outside the canvas that depends on
    // these refs (the scroll timeline) needs an explicit signal that
    // they're populated, rather than assuming effect order.
    if (onReady) onReady();
  }, [partsRef, materials, onReady]);

  return (
    <group ref={group}>
      {/* --- Chassis --- */}
      <group ref={chassis}>
        <mesh material={materials.body} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1.1]} />
        </mesh>
        {/* corner rails */}
        {[
          [-0.48, -0.48],
          [0.48, -0.48],
          [-0.48, 0.48],
          [0.48, 0.48],
        ].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0]} material={materials.trim}>
            <boxGeometry args={[0.06, 0.06, 1.16]} />
          </mesh>
        ))}
        {/* sensor tray on the +Z face */}
        <mesh
          ref={sensor}
          position={[0, -0.1, 0.58]}
          rotation={[Math.PI / 2, 0, 0]}
          material={materials.sensor}
        >
          <cylinderGeometry args={[0.16, 0.16, 0.12, 24]} />
        </mesh>
      </group>

      {/* --- Solar panels: pivot group so rotation reads as a hinge --- */}
      <group ref={panelLPivot} position={[-0.5, 0, 0]}>
        <mesh position={[-0.62, 0, 0]} material={materials.panel}>
          <boxGeometry args={[1.24, 0.85, 0.02]} />
        </mesh>
      </group>
      <group ref={panelRPivot} position={[0.5, 0, 0]}>
        <mesh position={[0.62, 0, 0]} material={materials.panel}>
          <boxGeometry args={[1.24, 0.85, 0.02]} />
        </mesh>
      </group>

      {/* --- Antenna: starts retracted, extends on scroll --- */}
      <group ref={antenna} position={[0, 0.5, -0.3]}>
        <mesh position={[0, 0.05, 0]} material={materials.trim}>
          <cylinderGeometry args={[0.05, 0.06, 0.1, 16]} />
        </mesh>
        <mesh position={[0, 0.35, 0]} material={materials.antenna}>
          <cylinderGeometry args={[0.012, 0.012, 0.6, 8]} />
        </mesh>
      </group>
    </group>
  );
}
