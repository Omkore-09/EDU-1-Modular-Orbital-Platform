import { useCallback, useEffect, useRef, useState } from "react";
import Scene from "./components/Scene";
import HudClock from "./components/HudClock";
import useScrollTimeline from "./hooks/useScrollTimeline";
import { sections, exploded, hero } from "./content";

function useWebglSupport() {
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      setSupported(!!gl);
    } catch (e) {
      setSupported(false);
    }
  }, []);
  return supported;
}

export default function App() {
  const webglOk = useWebglSupport();

  const pageRef = useRef(null);
  const groupRef = useRef(null);
  const partsRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const labelsRef = useRef({});

  const sectionRefs = {
    chassis: useRef(null),
    power: useRef(null),
    comms: useRef(null),
    payload: useRef(null),
    exploded: useRef(null),
  };

  // Flips true once the 3D model's refs are actually populated inside the
  // Canvas — see the comment in SatelliteModel.jsx for why this can't be
  // assumed from ordinary React effect timing.
  const [modelReady, setModelReady] = useState(false);
  const handleModelReady = useCallback(() => setModelReady(true), []);

  useScrollTimeline({
    refs: sectionRefs,
    partsRef,
    cameraRef,
    controlsRef,
    labelsRef,
    pageRef,
    groupRef,
    ready: modelReady,
  });

  return (
    <>
      {webglOk ? (
        <div className="canvas-stage">
          <Scene
            partsRef={partsRef}
            labelsRef={labelsRef}
            sceneRootRef={groupRef}
            cameraRef={cameraRef}
            controlsRef={controlsRef}
            onReady={handleModelReady}
          />
        </div>
      ) : (
        <div className="no-webgl-fallback">
          <span>3D preview unavailable on this device — WebGL not supported.</span>
        </div>
      )}
      <div className="canvas-vignette" />

      <div className="hud">
        <div className="hud-mark">
          <span className="hud-dot" />
          EDU-1 · LIVE VIEW
        </div>
        <HudClock />
      </div>

      <div className="content" ref={pageRef}>
        <section className="section section--left">
          <div className="hero">
            <span className="panel-code">{hero.code}</span>
            <h1>{hero.title}</h1>
            <p>{hero.body}</p>
            <div className="scroll-cue">
              <span className="line" />
              scroll to walk through the build
            </div>
          </div>
        </section>

        {sections.map((s) => (
          <section
            key={s.id}
            ref={sectionRefs[s.id]}
            className={`section section--${s.align}`}
          >
            <div className="panel">
              <span className="panel-code">{s.code}</span>
              <h2>{s.title}</h2>
              <p>{s.body}</p>
              <dl className="specs">
                {s.specs.map((sp) => (
                  <div className="spec" key={sp.label}>
                    <dt>{sp.label}</dt>
                    <dd>{sp.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        ))}

        <section
          ref={sectionRefs.exploded}
          className="section section--center"
          style={{ minHeight: "160vh" }}
        >
          <div className="panel">
            <span className="panel-code">{exploded.code}</span>
            <h2>{exploded.title}</h2>
            <p>{exploded.body}</p>
          </div>
        </section>

        <footer className="footer">
          <h2>Built for the classroom, not the launch pad.</h2>
          <p>
            EDU-1 ships as a kit — frame, trays, and a lab guide — so a
            class can assemble, wire, and fly the same subsystems a real
            CubeSat uses, without the mission risk.
          </p>
          <button className="cta-btn">Request the build guide</button>
          <div className="meta">Concept demo · built with React Three Fiber &amp; GSAP</div>
        </footer>
      </div>
    </>
  );
}
