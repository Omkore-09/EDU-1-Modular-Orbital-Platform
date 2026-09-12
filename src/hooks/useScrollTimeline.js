import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Wires the scroll position to the satellite model. Everything here writes
 * directly to Three.js object properties via refs (never through React
 * state), which is what keeps a scroll-scrubbed animation smooth — going
 * through setState/re-render on every scroll tick would visibly lag.
 */
export default function useScrollTimeline({
  refs,
  partsRef,
  cameraRef,
  controlsRef,
  labelsRef,
  pageRef,
  groupRef,
  ready,
}) {
  useEffect(() => {
    if (!ready) return;
    const parts = partsRef.current;
    if (!parts || !parts.group || !groupRef.current) return;

    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const scrub = prefersReduced ? false : 1;

      // Continuous slow turn across the whole scroll — the single
      // unifying motion that ties every section together.
      if (pageRef.current) {
        gsap.to(groupRef.current.rotation, {
          y: Math.PI * 2.1,
          ease: "none",
          scrollTrigger: {
            trigger: pageRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub,
          },
        });
      }

      // Gentle camera dolly-in through the first sections, then a
      // pull-back for the exploded reveal at the end.
      if (cameraRef.current && refs.chassis.current && refs.exploded.current) {
        gsap.to(cameraRef.current.position, {
          z: 3.35,
          scrollTrigger: {
            trigger: refs.chassis.current,
            start: "top bottom",
            end: "bottom center",
            scrub,
          },
        });
        gsap.to(cameraRef.current.position, {
          z: 5.1,
          y: 0.55,
          scrollTrigger: {
            trigger: refs.exploded.current,
            start: "top bottom",
            end: "top center",
            scrub,
          },
        });
      }

      // MOD-02 — panels hinge open
      if (refs.power.current) {
        gsap.to(parts.panelL.rotation, {
          z: 1.15,
          scrollTrigger: {
            trigger: refs.power.current,
            start: "top bottom",
            end: "center center",
            scrub,
          },
        });
        gsap.to(parts.panelR.rotation, {
          z: -1.15,
          scrollTrigger: {
            trigger: refs.power.current,
            start: "top bottom",
            end: "center center",
            scrub,
          },
        });
        gsap.to(parts.materials.panel, {
          emissiveIntensity: 0.7,
          scrollTrigger: {
            trigger: refs.power.current,
            start: "top bottom",
            end: "center center",
            scrub,
          },
        });
      }

      // MOD-03 — antenna extends
      if (refs.comms.current) {
        gsap.to(parts.antenna.position, {
          y: 0.72,
          scrollTrigger: {
            trigger: refs.comms.current,
            start: "top bottom",
            end: "center center",
            scrub,
          },
        });
        gsap.to(parts.antenna.scale, {
          y: 1.35,
          scrollTrigger: {
            trigger: refs.comms.current,
            start: "top bottom",
            end: "center center",
            scrub,
          },
        });
      }

      // MOD-04 — sensor tray lights up and edges forward
      if (refs.payload.current) {
        gsap.to(parts.materials.sensor, {
          emissiveIntensity: 1.1,
          scrollTrigger: {
            trigger: refs.payload.current,
            start: "top bottom",
            end: "center center",
            scrub,
          },
        });
        gsap.to(parts.sensor.position, {
          z: 0.74,
          scrollTrigger: {
            trigger: refs.payload.current,
            start: "top bottom",
            end: "center center",
            scrub,
          },
        });
      }

      // Exploded view — full breakdown + labels fade in + drag re-enabled
      if (refs.exploded.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: refs.exploded.current,
            start: "top center",
            end: "bottom center",
            scrub,
          },
        });
        tl.to(parts.panelL.position, { x: -1.05 }, 0)
          .to(parts.panelR.position, { x: 1.05 }, 0)
          .to(parts.antenna.position, { y: 1.25 }, 0)
          .to(parts.sensor.position, { z: 1.2 }, 0);

        ScrollTrigger.create({
          trigger: refs.exploded.current,
          start: "top 60%",
          end: "bottom top",
          onEnter: () => setLabelsVisible(labelsRef, true),
          onLeaveBack: () => setLabelsVisible(labelsRef, false),
          onLeave: () => {},
          onToggle: (self) => {
            if (controlsRef.current) controlsRef.current.enabled = self.isActive;
          },
        });
      }

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [ready]);
}

function setLabelsVisible(labelsRef, visible) {
  const labels = labelsRef.current;
  if (!labels) return;
  Object.values(labels).forEach((el) => {
    if (el) el.style.opacity = visible ? "1" : "0";
  });
}
