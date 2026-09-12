import { useEffect, useState } from "react";

// Isolated in its own component so its per-second tick never re-renders
// the Canvas/Html tree above it (which would otherwise stomp on the
// imperative opacity toggles the scroll timeline applies to part labels).
export default function HudClock() {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => setClock(new Date().toISOString().slice(11, 19) + " UTC");
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hud-readout">
      <div>{clock}</div>
      <div>
        <span>ORBIT</span> 512 km SSO
      </div>
    </div>
  );
}
