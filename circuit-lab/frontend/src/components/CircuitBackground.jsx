// Ambient background: PCB-style traces with a light "current" pulse
// traveling along them. Kept subtle (low opacity) so it reads as
// atmosphere, not decoration competing with the form.
export default function CircuitBackground() {
  const traces = [
    "M -20 120 H 220 V 40 H 460 V 260 H 900",
    "M -20 420 H 160 V 520 H 520 V 340 H 1000",
    "M 1200 80 H 940 V 220 H 700",
    "M 1200 600 H 980 V 460 H 640 V 560 H 300",
  ];

  return (
    <svg
      className="circuit-bg"
      viewBox="0 0 1200 680"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <style>{`
          .circuit-bg {
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            opacity: 0.5;
          }
          .trace {
            fill: none;
            stroke: var(--border-bright);
            stroke-width: 1.5;
            stroke-linecap: round;
          }
          .pulse {
            fill: none;
            stroke: var(--teal);
            stroke-width: 2;
            stroke-linecap: round;
            stroke-dasharray: 6 240;
            filter: drop-shadow(0 0 4px var(--teal));
            animation: flow 5s linear infinite;
          }
          .pulse.copper {
            stroke: var(--copper);
            filter: drop-shadow(0 0 4px var(--copper));
            animation-duration: 6.5s;
          }
          .node {
            fill: var(--surface-2);
            stroke: var(--border-bright);
            stroke-width: 1.5;
          }
          @keyframes flow {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: -1000; }
          }
        `}</style>
      </defs>

      {traces.map((d, i) => (
        <path key={`base-${i}`} className="trace" d={d} />
      ))}
      {traces.map((d, i) => (
        <path
          key={`pulse-${i}`}
          className={`pulse ${i % 2 === 1 ? "copper" : ""}`}
          d={d}
          style={{ animationDelay: `${i * 1.1}s` }}
        />
      ))}

      {[
        [220, 120], [460, 40], [900, 260],
        [160, 420], [520, 340], [980, 460],
      ].map(([cx, cy], i) => (
        <circle key={i} className="node" cx={cx} cy={cy} r="4" />
      ))}
    </svg>
  );
}
