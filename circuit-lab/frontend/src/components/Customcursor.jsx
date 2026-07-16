import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

const INTERACTIVE_SELECTOR = "a, button, [draggable='true'], input, .cursor-hover";
let sparkId = 0;

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [sparks, setSparks] = useState([]);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Comet trail: each dot chases the one before it, with looser springs
  // the further back it is - that's what produces the trailing tail.
  const t1x = useSpring(mouseX, { damping: 18, stiffness: 260, mass: 0.4 });
  const t1y = useSpring(mouseY, { damping: 18, stiffness: 260, mass: 0.4 });
  const t2x = useSpring(t1x, { damping: 20, stiffness: 180, mass: 0.5 });
  const t2y = useSpring(t1y, { damping: 20, stiffness: 180, mass: 0.5 });
  const ringX = useSpring(mouseX, { damping: 24, stiffness: 220, mass: 0.4 });
  const ringY = useSpring(mouseY, { damping: 24, stiffness: 220, mass: 0.4 });

  const spawnSpark = useCallback((x, y) => {
    const id = sparkId++;
    setSparks((s) => [...s, { id, x, y }]);
    setTimeout(() => setSparks((s) => s.filter((sp) => sp.id !== id)), 420);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return; // skip on touch devices
    setEnabled(true);
    document.body.classList.add("custom-cursor-active");

    function handleMove(e) {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
      setIsHovering(Boolean(e.target.closest(INTERACTIVE_SELECTOR)));
    }
    function handleDown(e) {
      spawnSpark(e.clientX, e.clientY);
    }
    function handleLeaveWindow() {
      setIsVisible(false);
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleDown);
    document.documentElement.addEventListener("mouseleave", handleLeaveWindow);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      document.documentElement.removeEventListener("mouseleave", handleLeaveWindow);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [mouseX, mouseY, spawnSpark]);

  if (!enabled) return null;

  return (
    <>
      {/* comet trail, drawn first so the core sits on top */}
      <motion.div className="cursor-trail" style={{ translateX: t2x, translateY: t2y }} animate={{ opacity: isVisible ? 0.35 : 0 }} />
      <motion.div className="cursor-trail" style={{ translateX: t1x, translateY: t1y }} animate={{ opacity: isVisible ? 0.6 : 0 }} />

      <motion.div
        className="cursor-core"
        style={{ translateX: mouseX, translateY: mouseY }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isHovering ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />

      <motion.div
        className="cursor-ring"
        style={{ translateX: ringX, translateY: ringY }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 1 : 0.4,
          rotate: isHovering ? 360 : 0,
        }}
        transition={
          isHovering
            ? { rotate: { duration: 3, repeat: Infinity, ease: "linear" }, scale: { duration: 0.25 }, opacity: { duration: 0.2 } }
            : { duration: 0.2 }
        }
      />

      <AnimatePresence>
        {sparks.map((s) =>
          Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            return (
              <motion.div
                key={`${s.id}-${i}`}
                className="cursor-spark"
                style={{ left: s.x, top: s.y }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: Math.cos(angle) * 22, y: Math.sin(angle) * 22, opacity: 0, scale: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            );
          })
        )}
      </AnimatePresence>
    </>
  );
}