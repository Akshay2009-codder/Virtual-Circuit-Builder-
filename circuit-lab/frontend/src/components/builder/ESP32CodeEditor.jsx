import { useEffect, useRef, useState } from "react";
import { ArduinoRuntime } from "../utils/arduinoRuntime";

const DEFAULT_SKETCH = `void setup() {
  pinMode(2, OUTPUT);
}

void loop() {
  digitalWrite(2, HIGH);
  delay(500);
  digitalWrite(2, LOW);
  delay(500);
}
`;

const TICK_MS = 150; // how often we re-solve the circuit against the backend while code is running

export default function ESP32CodeEditor({ node, onClose, onSaveCode, onLivePinsChange, getLivePinVoltage }) {
  const [code, setCode] = useState(node.code || DEFAULT_SKETCH);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);
  const [serialLines, setSerialLines] = useState([]);

  const runtimeRef = useRef(null);
  const pinStatesRef = useRef({});
  const tickIntervalRef = useRef(null);
  const serialBufRef = useRef("");

  useEffect(() => {
    return () => {
      runtimeRef.current?.stop();
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, []);

  function appendSerial(text) {
    serialBufRef.current += text;
    const parts = serialBufRef.current.split("\n");
    serialBufRef.current = parts.pop();
    if (parts.length === 0) return;
    setSerialLines((lines) => [...lines, ...parts].slice(-200));
  }

  function handleRun() {
    onSaveCode(node.id, code);
    setError(null);
    setSerialLines([]);
    pinStatesRef.current = {};

    const runtime = new ArduinoRuntime(node, {
      onPinWrite: (terminal, volts) => {
        pinStatesRef.current = { ...pinStatesRef.current, [terminal]: volts };
      },
      getPinVoltage: (terminal) => getLivePinVoltage(node.id, terminal),
      onSerial: appendSerial,
      onStatus: ({ running: r, error: e }) => {
        setRunning(r);
        if (e) setError(e);
      },
    });
    runtimeRef.current = runtime;
    runtime.start(code);

    tickIntervalRef.current = setInterval(() => {
      onLivePinsChange(node.id, pinStatesRef.current);
    }, TICK_MS);
  }

  function handleStop() {
    runtimeRef.current?.stop();
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    tickIntervalRef.current = null;
    setRunning(false);
  }

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{"</>"} {node.name} code</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {!running ? (
              <button onClick={handleRun} style={styles.runBtn}>▶ Run</button>
            ) : (
              <button onClick={handleStop} style={styles.stopBtn}>■ Stop</button>
            )}
            <button onClick={onClose} style={styles.closeBtn}>✕</button>
          </div>
        </div>

        {error && <div style={styles.errorBar}>⚠ {error}</div>}

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          style={styles.textarea}
        />

        <div style={styles.serialHeader}>Serial monitor</div>
        <div style={styles.serial}>
          {serialLines.length === 0 && <span style={{ color: "var(--text-faint)" }}>No output yet.</span>}
          {serialLines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
  },
  panel: {
    width: "min(720px, 92vw)",
    maxHeight: "86vh",
    background: "var(--surface)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius)",
    padding: 18,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    boxShadow: "0 24px 70px rgba(0,0,0,0.5)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  runBtn: {
    background: "var(--primary)",
    color: "#062011",
    border: "none",
    borderRadius: "var(--radius-sm)",
    padding: "6px 14px",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  stopBtn: {
    background: "var(--danger)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius-sm)",
    padding: "6px 14px",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  closeBtn: {
    background: "transparent",
    border: "1px solid var(--border-bright)",
    color: "var(--text-dim)",
    borderRadius: "var(--radius-sm)",
    width: 28,
    height: 28,
    cursor: "pointer",
  },
  errorBar: {
    background: "rgba(255,71,87,0.12)",
    border: "1px solid var(--danger)",
    color: "var(--danger)",
    borderRadius: "var(--radius-sm)",
    padding: "6px 10px",
    fontSize: 12,
  },
  textarea: {
    width: "100%",
    height: 320,
    background: "#0a0e13",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "#d6ffe8",
    fontFamily: "monospace",
    fontSize: 13,
    padding: 12,
    outline: "none",
    resize: "vertical",
    tabSize: 2,
  },
  serialHeader: {
    fontSize: 11,
    fontFamily: "var(--font-display)",
    color: "var(--text-faint)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  serial: {
    background: "#0a0e13",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: 10,
    height: 100,
    overflowY: "auto",
    fontFamily: "monospace",
    fontSize: 12,
    color: "#8fe6b0",
  },
};