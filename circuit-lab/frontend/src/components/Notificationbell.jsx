import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import client from "../api/client";

const POLL_MS = 30000;

export default function NotificationBell() {
  const [invites, setInvites] = useState([]);
  const [open, setOpen] = useState(false);
  const [respondingId, setRespondingId] = useState(null);

  function load() {
    client.get("/invites").then((res) => setInvites(res.data.invites));
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_MS);
    return () => clearInterval(interval);
  }, []);

  async function respond(inviteId, action) {
    setRespondingId(inviteId);
    try {
      await client.post(`/invites/${inviteId}/${action}`);
      setInvites((inv) => inv.filter((i) => i.id !== inviteId));
    } finally {
      setRespondingId(null);
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen((o) => !o)} style={styles.bellBtn} title="Share requests">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6Z" />
          <path d="M10 20a2 2 0 0 0 4 0" />
        </svg>
        {invites.length > 0 && <span style={styles.badge}>{invites.length}</span>}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div style={styles.clickCatcher} onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              style={styles.panel}
            >
              <div className="eyebrow" style={{ marginBottom: 10 }}>
                Share requests
              </div>

              {invites.length === 0 && (
                <p style={{ color: "var(--text-faint)", fontSize: 12.5 }}>No pending requests.</p>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {invites.map((inv) => (
                  <div key={inv.id} style={styles.inviteRow}>
                    <div style={{ fontSize: 12.5, color: "var(--text)", lineHeight: 1.5 }}>
                      <strong>{inv.from_name}</strong> wants to share{" "}
                      <strong style={{ color: "var(--primary)" }}>{inv.project_name}</strong> with you
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button
                        onClick={() => respond(inv.id, "accept")}
                        disabled={respondingId === inv.id}
                        style={styles.acceptBtn}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => respond(inv.id, "decline")}
                        disabled={respondingId === inv.id}
                        style={styles.declineBtn}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  bellBtn: {
    position: "relative",
    background: "transparent",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-dim)",
    width: 34,
    height: 34,
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    background: "var(--danger)",
    color: "#fff",
    fontSize: 10,
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    display: "grid",
    placeItems: "center",
    padding: "0 3px",
  },
  clickCatcher: {
    position: "fixed",
    inset: 0,
    zIndex: 90,
  },
  panel: {
    position: "absolute",
    top: "calc(100% + 10px)",
    right: 0,
    width: 300,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "16px 16px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
    zIndex: 91,
  },
  inviteRow: {
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "10px 12px",
  },
  acceptBtn: {
    background: "var(--primary)",
    color: "#062011",
    border: "none",
    borderRadius: "var(--radius-sm)",
    padding: "5px 12px",
    fontSize: 11.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  declineBtn: {
    background: "transparent",
    border: "1px solid var(--border-bright)",
    color: "var(--text-dim)",
    borderRadius: "var(--radius-sm)",
    padding: "5px 12px",
    fontSize: 11.5,
    cursor: "pointer",
  },
};