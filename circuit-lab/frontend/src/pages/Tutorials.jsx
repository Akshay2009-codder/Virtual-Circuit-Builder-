import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "../components/AppShell";

/* ---------------- Category styling ---------------- */
const TAG_COLOR = {
  Fundamentals: "var(--primary)",
  Components: "var(--accent)",
  Tools: "var(--gold)",
  Troubleshooting: "var(--danger)",
  Digital: "#5b8dee",
  "Using CircuitLab": "#b98aff",
};

const DIFFICULTY_COLOR = {
  Beginner: "var(--primary)",
  Intermediate: "var(--gold)",
  Advanced: "var(--danger)",
};

/* ---------------- Lesson icons - small, self-contained glyph set ---------------- */
const ICONS = {
  bolt: (c) => <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill={c} />,
  bulb: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.45 1 1.2 1 2.1h5c0-.9.4-1.65 1-2.1A6 6 0 0 0 12 3z" />
    </g>
  ),
  branch: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <path d="M4 12h4M20 6h-4M20 18h-4M8 12 16 6M8 12l8 6" />
    </g>
  ),
  loop: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <path d="M4 8V6a2 2 0 0 1 2-2h5" />
      <path d="M20 16v2a2 2 0 0 1-2 2h-5" />
      <path d="M4 12h5m6 0h5" strokeDasharray="2 2.5" />
    </g>
  ),
  bands: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none">
      <rect x="4" y="9" width="16" height="6" rx="2" />
      <path d="M8 9v6M11 9v6M14.5 9v6" stroke="#0a0e13" strokeWidth="2" />
    </g>
  ),
  toggle: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="4" y="8" width="16" height="8" rx="4" />
      <circle cx="15" cy="12" r="2.6" fill={c} stroke="none" />
    </g>
  ),
  gauge: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <path d="M4 15a8 8 0 0 1 16 0" />
      <path d="M12 15 16 9" />
      <circle cx="12" cy="15" r="1.4" fill={c} stroke="none" />
    </g>
  ),
  plusMinus: (c) => (
    <g stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round">
      <path d="M7 8v6M4 11h6" />
      <path d="M14 11h6" />
    </g>
  ),
  diode: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinejoin="round">
      <path d="M4 12h6" strokeLinecap="round" />
      <path d="M10 7v10l7-5-7-5z" />
      <path d="M17 7v10" strokeLinecap="round" />
      <path d="M17 12h3" strokeLinecap="round" />
    </g>
  ),
  capacitor: (c) => (
    <g stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round">
      <path d="M4 12h6" />
      <path d="M10 6v12M14 6v12" />
      <path d="M14 12h6" />
    </g>
  ),
  coil: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <path d="M3 12h2" />
      <circle cx="8" cy="12" r="2.6" />
      <circle cx="12.5" cy="12" r="2.6" />
      <circle cx="17" cy="12" r="2.6" />
      <path d="M19.5 12h2" />
    </g>
  ),
  transistor: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M9 8v8M9 12h4M13 12l4-4M13 12l4 4" />
    </g>
  ),
  radar: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <path d="M12 12 20 8" />
      <path d="M15 5.5a8 8 0 0 1 0 13" />
      <path d="M12.5 8.7a4 4 0 0 1 0 6.6" />
      <circle cx="12" cy="12" r="1.6" fill={c} stroke="none" />
    </g>
  ),
  gate: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 6v12h4a6 6 0 0 0 0-12H5z" />
      <path d="M2 9h3M2 15h3M19 12h3" />
    </g>
  ),
  chip: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
      <path d="M9 6V3M15 6V3M9 21v-3M15 21v-3M6 9H3M6 15H3M21 9h-3M21 15h-3" />
      <path d="M16.5 7.5c1.6-1.6 1.6-1.6 3-.2" />
    </g>
  ),
  document: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M9.5 12h5M9.5 15h5M9.5 9h2" />
    </g>
  ),
  grid: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="4" y="5" width="16" height="14" rx="1.5" />
      {[7, 10.5, 14, 17].map((x) => (
        <line key={x} x1={x} y1="7" x2={x} y2="17" strokeDasharray="0.1 3" />
      ))}
    </g>
  ),
  wrench: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5l-6 6 2.4 2.4 6-6a4 4 0 0 0 5-5.4l-2.6 2.6-2-2 2.6-2.6z" />
    </g>
  ),
  people: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="2.6" />
      <path d="M4 19c0-3 2.2-5 5-5s5 2 5 5" />
      <circle cx="17" cy="9" r="2.2" />
      <path d="M15 19c.2-2.3 1.7-4 3.8-4.3" />
    </g>
  ),
};

function LessonIcon({ id, color, size = 40 }) {
  const glyph = ICONS[id] || ICONS.bulb;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        background: `color-mix(in srgb, ${color} 16%, var(--surface-2))`,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24">
        {glyph(color)}
      </svg>
    </div>
  );
}

/* ---------------- Lesson content ---------------- */
const TOPICS = [
  {
    icon: "bolt", tag: "Fundamentals", difficulty: "Beginner",
    title: "Ohm's Law — the one formula everything else builds on",
    summary: "V = I × R. Know any two, find the third.",
    body: `Ohm's Law says V = I × R — voltage equals current times resistance. If you know any two of those, you can find the third.

A 9V battery pushing current through a 220Ω resistor gives I = V / R = 9 / 220 ≈ 41mA. That's the same math CircuitLab's simulator runs to give you real voltage/current/power numbers when you hit "Run circuit."

Higher resistance means less current for the same voltage. That's why a resistor in series with an LED protects it — it limits how much current can flow.`,
  },
  {
    icon: "bulb", tag: "Components", difficulty: "Beginner",
    title: "Why your LED needs a resistor",
    summary: "LEDs don't limit their own current — they'll happily burn out.",
    body: `An LED doesn't limit current on its own — hook one directly across a battery and it'll try to draw as much current as the circuit allows, which is usually way more than the ~20mA it can handle. It burns out almost instantly.

A resistor in series fixes this. Pick one large enough to keep current under the LED's rated maximum (check its datasheet — most common LEDs are happy around 15-20mA).

This is exactly what CircuitLab's simulator checks: run a bare LED across a battery and you'll get a real calculated current figure, flagged the moment it exceeds ~20mA.`,
  },
  {
    icon: "branch", tag: "Fundamentals", difficulty: "Beginner",
    title: "Series vs. parallel circuits",
    summary: "Same current, divided voltage — or the reverse.",
    body: `Series: components are connected end-to-end in a single loop. The same current flows through all of them, but voltage divides across each one.

Parallel: components are connected across the same two points. Voltage is the same across each branch, but current divides between them.

Most real circuits are a mix of both — a battery might power two parallel branches, each of which has components wired in series. Try building a two-resistor voltage divider in the Builder and watch the voltages split exactly according to their ratio.`,
  },
  {
    icon: "loop", tag: "Fundamentals", difficulty: "Beginner",
    title: "Open circuits, closed circuits, and short circuits",
    summary: "The three states every circuit you build can be in.",
    body: `A closed circuit has a complete loop from the power source, through your components, and back — current can flow, and things work.

An open circuit has a break somewhere in that loop — a disconnected wire, an open switch — so no current flows at all. Nothing lights up, nothing runs.

A short circuit happens when current finds a path with little or no resistance between the two terminals of your source — like a wire connected straight across a battery. Current spikes far beyond what the source or wires are meant to handle. In real electronics this can overheat components, damage the battery, or start a fire. CircuitLab's simulator flags this explicitly as a "short" result with a dangerously high current reading.`,
  },
  {
    icon: "bands", tag: "Components", difficulty: "Beginner",
    title: "Reading resistor color bands",
    summary: "Four stripes, one number.",
    body: `Most resistors use 4 colored bands to encode their value. The first two bands are significant digits, the third is a multiplier, and the fourth is tolerance.

Common colors as digits: black=0, brown=1, red=2, orange=3, yellow=4, green=5, blue=6, violet=7, grey=8, white=9.

Example: red-red-brown-gold reads as 2, 2, ×10 → 220Ω, ±5% tolerance (gold). That's the exact resistor CircuitLab uses as its default catalog value.`,
  },
  {
    icon: "toggle", tag: "Components", difficulty: "Beginner",
    title: "What a switch actually does",
    summary: "A controllable break in a wire — nothing more.",
    body: `A switch is just a controllable break in a wire. Closed (on), it behaves like a plain wire — near-zero resistance, current flows freely. Open (off), it behaves like a total break — infinite resistance, no current at all.

In the Builder, click a placed switch (or the ON/OFF pill on its label) to toggle it — you'll see the lever flip and its color change, and running the circuit again will reflect whether that path is now open or closed. Rocker and slide switches work exactly the same way, just with a different real-world form factor.`,
  },
  {
    icon: "gauge", tag: "Tools", difficulty: "Intermediate",
    title: "Using a multimeter (the real-world version of Run circuit)",
    summary: "Voltage, current, and continuity — one tool, three modes.",
    body: `A multimeter measures voltage, current, or resistance depending on its mode.

Voltage mode: probes go across (in parallel with) the component you're measuring.
Current mode: the meter goes in series, becoming part of the circuit path itself.
Continuity/resistance mode: checks whether two points are electrically connected — this is basically what CircuitLab's connectivity check is doing in software, and what the live Readings panel is doing when it shows you real voltage/current per part.

Always start on the highest range if you're unsure, and never measure resistance on a circuit that still has power connected.`,
  },
  {
    icon: "plusMinus", tag: "Components", difficulty: "Beginner",
    title: "Polarity — why + and − matter",
    summary: "Some parts only work one way round.",
    body: `Some components only work one way round. Batteries, LEDs, electrolytic capacitors, solar panels, and coin cells are polarized — connect them backwards and at best they won't work, at worst (especially electrolytic capacitors) they can be damaged or dangerous.

In the Builder, polarized parts show a glowing + (red) and − (blue) at their terminals so you can see which way current is meant to flow before you wire them in.`,
  },
  {
    icon: "diode", tag: "Components", difficulty: "Intermediate",
    title: "Diodes and rectification",
    summary: "One-way valves for current.",
    body: `A diode only conducts in one direction — forward bias, from anode to cathode — and blocks current the other way (reverse bias). Real diodes have a small forward voltage drop, typically around 0.7V for silicon diodes.

Zener diodes are a special case: they're designed to conduct in reverse once a specific breakdown voltage is reached, which makes them useful as voltage references. Schottky diodes have a lower forward drop, which matters in power-efficient designs.

A bridge rectifier is four diodes arranged to convert AC (which alternates direction) into pulsing DC (which only flows one way) — the basis of nearly every mains power adapter.

CircuitLab's simulator models diodes with a real forward-voltage drop, and figures out which direction current actually wants to flow rather than just assuming.`,
  },
  {
    icon: "capacitor", tag: "Components", difficulty: "Intermediate",
    title: "Capacitors: storing charge, blocking DC",
    summary: "They charge up, then stop conducting.",
    body: `A capacitor stores energy as an electric field between two plates. When you first apply voltage, current flows to charge it up — but once it's fully charged, no more current flows through it in steady-state DC.

This is why capacitors are described as "blocking DC" — in a circuit that's been powered for a while, a capacitor branch simply stops carrying current. CircuitLab's simulator applies exactly this rule: capacitors are treated as an open circuit in the DC steady-state analysis, which is the physically correct behavior.

Where capacitors matter is in filtering and smoothing — evening out ripples in a power supply — and in timing circuits, where the charge/discharge rate sets a delay.`,
  },
  {
    icon: "coil", tag: "Components", difficulty: "Advanced",
    title: "Inductors and why they're a dead short in DC",
    summary: "The mirror image of a capacitor.",
    body: `An inductor is a coil of wire that resists changes in current by storing energy in a magnetic field. When current is changing (like in AC), it pushes back. But once current has settled into a steady DC flow, an ideal inductor behaves like a plain wire — zero resistance.

That's the opposite of a capacitor, which is open in steady-state DC. CircuitLab's simulator applies this correctly: inductors are merged into the circuit as a zero-resistance connection, same as a wire.

In practice, inductors show up in filters, chokes, and switching power converters — anywhere you need to smooth out rapid current changes.`,
  },
  {
    icon: "transistor", tag: "Components", difficulty: "Advanced",
    title: "Transistors as switches",
    summary: "A small current controlling a much bigger one.",
    body: `A transistor is a three-terminal device. In an NPN transistor, a small current flowing into the base lets a much larger current flow from collector to emitter — effectively using a weak signal to control a strong one. That's the basis of both amplification and digital switching.

MOSFETs work on a similar principle but are voltage-controlled rather than current-controlled, and can switch much higher power efficiently — they're the backbone of modern power electronics.

Because real transistor behavior depends on three terminals and nonlinear equations, CircuitLab's simplified two-terminal simulation doesn't calculate exact currents through them yet — they're a known, documented limitation rather than a hidden gap. They still work great as visual/logical placeholders in a design.`,
  },
  {
    icon: "radar", tag: "Components", difficulty: "Intermediate",
    title: "How sensors turn the world into resistance",
    summary: "Light, heat, and motion — measured as changing resistance.",
    body: `Many simple sensors work by changing their resistance in response to something physical. A photoresistor (LDR) drops in resistance as more light hits it. A thermistor's resistance shifts predictably with temperature. Pair either with a fixed resistor and you get a voltage divider whose output voltage reveals the reading.

Other sensors — PIR motion, ultrasonic distance, gas, humidity, touch — work on different physical principles entirely (infrared, sound reflection, chemical reactions, capacitance) and typically output a digital or analog signal rather than a simple resistance.

CircuitLab's catalog includes both types. LDRs and thermistors participate in the live simulation as resistive elements; the more specialized sensors are represented visually and functionally in the Builder, without a simplified electrical model behind them yet.`,
  },
  {
    icon: "gate", tag: "Digital", difficulty: "Intermediate",
    title: "Logic gates: the building blocks of digital circuits",
    summary: "AND, OR, NOT — and everything built from them.",
    body: `A logic gate takes one or more digital inputs (each either HIGH or LOW) and produces a single digital output based on a fixed rule.

AND outputs HIGH only if every input is HIGH. OR outputs HIGH if any input is HIGH. NOT simply flips its single input. NAND and NOR are AND/OR with the output inverted — and are actually "universal" gates, meaning any other gate can be built from enough of just one of them. XOR outputs HIGH only when its inputs differ.

A flip-flop goes a step further: it's a gate arrangement that can hold (remember) a single bit of state, which is the foundation of registers, counters, and memory.

All of these ship in CircuitLab's catalog as realistic DIP-package chips, ready to drop into a design.`,
  },
  {
    icon: "chip", tag: "Using CircuitLab", difficulty: "Beginner",
    title: "Microcontrollers vs. batteries — what ESP32/Arduino actually add",
    summary: "A power source that can also think.",
    body: `In CircuitLab, boards like the ESP32, Arduino Uno, Arduino Nano, and Raspberry Pi Pico behave as power sources in the simulation, the same way a battery does — they output a fixed voltage (3.3V or 5V depending on the board).

What makes them different in real life is that they're programmable: instead of just supplying power, they can read sensors, make decisions, and switch outputs on and off in code — a battery can't decide anything. An ESP32 specifically adds built-in Wi-Fi and Bluetooth, which is why it's the default choice for IoT projects.

Treating them as sources in the simplified model is a deliberate simplification — it lets you power a circuit realistically without needing to simulate actual firmware.`,
  },
  {
    icon: "document", tag: "Tools", difficulty: "Intermediate",
    title: "Reading a datasheet: the numbers that actually matter",
    summary: "Four ratings to check before you trust a part.",
    body: `Every real component has a datasheet, and most of what you need from it boils down to a handful of numbers: the rated voltage or forward voltage, the maximum current, the power rating (for resistors, in watts), and the tolerance (how far the real part can vary from its labeled value).

Exceed the current or power rating and a part can overheat or fail — this is exactly what CircuitLab's "Run circuit" warnings are checking for, using the same ratings shown in each part's spec panel on the Components page.

Tolerance matters more in precision circuits than beginner ones — a ±5% resistor is fine for an LED current limiter, but not for a precise timing circuit.`,
  },
  {
    icon: "grid", tag: "Tools", difficulty: "Beginner",
    title: "Prototyping on a breadboard",
    summary: "Solderless connections for fast iteration.",
    body: `A breadboard is a reusable prototyping surface — rows of holes connected internally so you can plug components in and wire them together without soldering. Rows in the middle section are typically connected in short groups (for placing components across the center gap), while the outer rows form long power rails for shared +V and ground connections.

Terminal blocks serve a related purpose in permanent installations — screw-down connectors for joining wires securely, often used for shared power distribution rather than fast iteration.

Both are included in CircuitLab's catalog under Tools/Misc, mainly as a way to visually represent a real prototyping setup alongside your simulated components.`,
  },
  {
    icon: "wrench", tag: "Troubleshooting", difficulty: "Beginner",
    title: "Troubleshooting checklist: my circuit isn't working",
    summary: "Work through these before assuming something's broken.",
    body: `1. Is there a power source on the board at all? No battery/board means nothing can ever run — CircuitLab will tell you this directly.

2. Is the loop actually closed? Trace the path with your eyes from the source's + terminal, through every part, back to its − terminal. A single missing wire breaks everything downstream of it.

3. Is a switch in the "off" position? Easy to forget — check the label pill on any switches in the path.

4. Is a polarized part backwards? LEDs, batteries, and electrolytic capacitors care which way round they're connected.

5. Check the suggestions panel after running — it's specifically looking for the most common mistakes (missing resistors, unconnected parts, open loops) and will usually point you straight at the fix.`,
  },
  {
    icon: "people", tag: "Using CircuitLab", difficulty: "Beginner",
    title: "Working with teammates: sharing a circuit",
    summary: "One circuit, edited from more than one account.",
    body: `For group projects, open a circuit in the Builder and click the Share button to invite a teammate by the email they registered with. Once invited, they can open the exact same project from their own account on their own device and see (and edit) the same layout.

This works on a "whoever saves last wins" basis rather than live, cursor-by-cursor syncing — closer to a shared document than a real-time collaborative canvas. It's enough for splitting up a group project (one person handles the sensor section, another the power supply) as long as you're not editing at the exact same moment.

Shared projects show up on both people's dashboards, tagged so you can tell it's a team circuit rather than a personal one.`,
  },
];

const ALL_TAGS = ["All", ...Object.keys(TAG_COLOR)];

const gridVariants = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function Tutorials() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [openIndex, setOpenIndex] = useState(null);

  const filtered = useMemo(() => {
    return TOPICS.filter((t) => {
      const matchesTag = activeTag === "All" || t.tag === activeTag;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q || t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q) || t.body.toLowerCase().includes(q);
      return matchesTag && matchesQuery;
    });
  }, [query, activeTag]);

  return (
    <AppShell>
      <div style={{ padding: "40px 6vw 60px" }}>
        {/* Hero */}
        <div style={{ maxWidth: 680, marginBottom: 30 }}>
          <div className="eyebrow">Learn</div>
          <h1 style={styles.heroTitle}>
            Master <span className="gradient-text">circuit design</span>
          </h1>
          <p style={{ color: "var(--text-dim)", fontSize: 14.5, lineHeight: 1.6, margin: "10px 0 0" }}>
            {TOPICS.length} short, practical lessons — the exact concepts behind everything CircuitLab
            checks for you when you hit Run.
          </p>
        </div>

        {/* Search + filters */}
        <div style={{ marginBottom: 26 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons… e.g. 'resistor', 'short circuit', 'LED'"
            style={styles.search}
          />
          <div style={styles.chipRow}>
            {ALL_TAGS.map((tag) => {
              const active = activeTag === tag;
              const color = TAG_COLOR[tag] || "var(--text-dim)";
              const count = tag === "All" ? TOPICS.length : TOPICS.filter((t) => t.tag === tag).length;
              return (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  style={{
                    ...styles.chip,
                    borderColor: active ? color : "var(--border)",
                    color: active ? color : "var(--text-dim)",
                    background: active ? `color-mix(in srgb, ${color} 12%, var(--surface))` : "var(--surface)",
                  }}
                >
                  {tag} <span style={{ opacity: 0.6 }}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lessons */}
        {filtered.length === 0 ? (
          <p style={{ color: "var(--text-faint)", fontSize: 13.5 }}>No lessons match "{query}".</p>
        ) : (
          <motion.div style={styles.list} variants={gridVariants} initial="hidden" animate="show">
            {filtered.map((topic) => {
              const globalIndex = TOPICS.indexOf(topic);
              const open = openIndex === globalIndex;
              const tagColor = TAG_COLOR[topic.tag] || "var(--primary)";
              return (
                <motion.div key={topic.title} variants={cardVariants} style={styles.card} layout="position">
                  <button onClick={() => setOpenIndex(open ? null : globalIndex)} style={styles.header}>
                    <LessonIcon id={topic.icon} color={tagColor} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={styles.metaRow}>
                        <span style={{ ...styles.tagPill, color: tagColor, borderColor: tagColor }}>{topic.tag}</span>
                        <span style={{ ...styles.diffPill, color: DIFFICULTY_COLOR[topic.difficulty] }}>
                          {topic.difficulty}
                        </span>
                      </div>
                      <div style={styles.title}>{topic.title}</div>
                      {!open && <div style={styles.summary}>{topic.summary}</div>}
                    </div>
                    <motion.span animate={{ rotate: open ? 45 : 0 }} style={{ ...styles.plus, color: tagColor }}>
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
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}

const styles = {
  heroTitle: {
    margin: "6px 0 0",
    fontSize: "clamp(26px, 3.2vw, 36px)",
    fontWeight: 700,
    fontFamily: "var(--font-body)",
    lineHeight: 1.15,
  },
  search: {
    width: "100%",
    maxWidth: 480,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "10px 14px",
    color: "var(--text)",
    fontSize: 13.5,
    outline: "none",
    marginBottom: 14,
    display: "block",
  },
  chipRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    fontFamily: "var(--font-display)",
    fontSize: 11.5,
    padding: "6px 12px",
    borderRadius: 20,
    border: "1px solid",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    maxWidth: 820,
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    overflow: "hidden",
  },
  header: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    padding: "16px 18px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  tagPill: {
    fontFamily: "var(--font-display)",
    fontSize: 9.5,
    letterSpacing: "0.04em",
    padding: "2px 9px",
    borderRadius: 20,
    border: "1px solid",
  },
  diffPill: {
    fontFamily: "var(--font-display)",
    fontSize: 9.5,
    letterSpacing: "0.04em",
    opacity: 0.85,
  },
  title: { fontSize: 14.5, fontWeight: 600, color: "var(--text)", lineHeight: 1.35 },
  summary: { fontSize: 12.5, color: "var(--text-faint)", marginTop: 4 },
  plus: {
    fontSize: 20,
    flexShrink: 0,
    fontFamily: "var(--font-display)",
  },
  body: {
    padding: "0 18px 20px 72px",
    margin: 0,
    color: "var(--text-dim)",
    fontSize: 13.5,
    lineHeight: 1.75,
    whiteSpace: "pre-line",
  },
};