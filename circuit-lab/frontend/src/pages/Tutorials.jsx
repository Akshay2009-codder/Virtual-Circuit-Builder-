import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "../components/AppShell";

const TOPICS = [
  {
    title: "Ohm's Law — the one formula everything else builds on",
    tag: "Fundamentals",
    body: `Ohm's Law says V = I × R — voltage equals current times resistance. If you know any two of those, you can find the third.

A 9V battery pushing current through a 220Ω resistor gives I = V / R = 9 / 220 ≈ 41mA. That's the number CircuitLab's simulator is effectively checking for when it decides whether a part is safe to power.

Higher resistance means less current for the same voltage. That's why a resistor in series with an LED protects it — it limits how much current can flow.`,
  },
  {
    title: "Why your LED needs a resistor",
    tag: "Components",
    body: `An LED doesn't limit current on its own — hook one directly across a battery and it'll try to draw as much current as the circuit allows, which is usually way more than the ~20mA it can handle. It'll burn out almost instantly.

A resistor in series fixes this. Pick one large enough to keep current under the LED's rated maximum (check its datasheet — most common LEDs are happy around 15-20mA).

This is exactly what CircuitLab's "Run circuit" suggestions are checking for when they warn you about a bare LED.`,
  },
  {
    title: "Series vs. parallel circuits",
    tag: "Fundamentals",
    body: `Series: components are connected end-to-end in a single loop. The same current flows through all of them, but voltage divides across each one.

Parallel: components are connected across the same two points. Voltage is the same across each branch, but current divides between them.

Most real circuits are a mix of both — a battery might power two parallel branches, each of which has components wired in series.`,
  },
  {
    title: "Open circuits, closed circuits, and short circuits",
    tag: "Fundamentals",
    body: `A closed circuit has a complete loop from the power source, through your components, and back — current can flow, and things work.

An open circuit has a break somewhere in that loop — a disconnected wire, an open switch — so no current flows at all. Nothing lights up, nothing runs.

A short circuit happens when current finds a path with little or no resistance between the two terminals of your source — like a wire connected straight across a battery. Current spikes far beyond what the source or wires are meant to handle. In real electronics this can overheat components, damage the battery, or start a fire. CircuitLab's simulator flags this as a "short" result.`,
  },
  {
    title: "Reading resistor color bands",
    tag: "Components",
    body: `Most resistors use 4 colored bands to encode their value. The first two bands are significant digits, the third is a multiplier, and the fourth is tolerance.

Common colors as digits: black=0, brown=1, red=2, orange=3, yellow=4, green=5, blue=6, violet=7, grey=8, white=9.

Example: red-red-brown-gold reads as 2, 2, ×10 → 220Ω, ±5% tolerance (gold). That's the exact resistor CircuitLab uses as the default value in its catalog.`,
  },
  {
    title: "What a switch actually does",
    tag: "Components",
    body: `A switch is just a controllable break in a wire. Closed (on), it behaves like a plain wire — near-zero resistance, current flows freely. Open (off), it behaves like a total break — infinite resistance, no current at all.

In the Builder, click a placed switch to toggle it — you'll see the lever flip and its color change, and running the circuit again will reflect whether that path is now open or closed.`,
  },
  {
    title: "Using a multimeter (the real-world version of Run circuit)",
    tag: "Tools",
    body: `A multimeter measures voltage, current, or resistance depending on its mode.

Voltage mode: probes go across (in parallel with) the component you're measuring.
Current mode: the meter goes in series, becoming part of the circuit path itself.
Continuity/resistance mode: checks whether two points are electrically connected — this is basically what CircuitLab's "Run circuit" connectivity check is doing in software.

Always start on the highest range if you're unsure, and never measure resistance on a circuit that still has power connected.`,
  },
  {
    title: "Polarity — why + and − matter",
    tag: "Components",
    body: `Some components only work one way round. Batteries, LEDs, electrolytic capacitors, and solar panels are polarized — connect them backwards and at best they won't work, at worst (especially electrolytic capacitors) they can be damaged or dangerous.

In the Builder, polarized parts show a glowing + (red) and − (blue) at their terminals so you can see which way current is meant to flow before you wire them in.`,
  },
];

export default function Tutorials() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <AppShell>
      <div style={{ padding: "36px 6vw", maxWidth: 820 }}>
        <div className="eyebrow">Learn</div>
        <h1 style={{ margin: "6px 0 8px", fontSize: 26, fontFamily: "var(--font-body)" }}>
          Tutorials
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: 14, margin: "0 0 28px" }}>
          The core electronics concepts behind everything CircuitLab checks for you.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {TOPICS.map((topic, i) => {
            const open = openIndex === i;
            return (
              <div key={topic.title} style={styles.card}>
                <button onClick={() => setOpenIndex(open ? -1 : i)} style={styles.header}>
                  <div>
                    <span className="eyebrow" style={{ fontSize: 10 }}>
                      {topic.tag}
                    </span>
                    <div style={styles.title}>{topic.title}</div>
                  </div>
                  <motion.span animate={{ rotate: open ? 45 : 0 }} style={styles.plus}>
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <p style={styles.body}>{topic.body}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

const styles = {
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    overflow: "hidden",
  },
  header: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    padding: "16px 20px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
  },
  title: { fontSize: 14.5, fontWeight: 600, color: "var(--text)", marginTop: 4 },
  plus: {
    fontSize: 20,
    color: "var(--primary)",
    flexShrink: 0,
    fontFamily: "var(--font-display)",
  },
  body: {
    padding: "0 20px 20px",
    margin: 0,
    color: "var(--text-dim)",
    fontSize: 13.5,
    lineHeight: 1.7,
    whiteSpace: "pre-line",
  },
};