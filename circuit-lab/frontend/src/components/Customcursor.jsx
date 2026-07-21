import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
  AnimatePresence,
} from "framer-motion";

const INTERACTIVE_SELECTOR = "a, button, [draggable='true'], input, .cursor-hover";
let sparkId = 0;

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [sparks, setSparks] = useState([]);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Comet trail: unchanged - each dot chases the one before it.
  const t1x = useSpring(mouseX, { damping: 18, stiffness: 260, mass: 0.4 });
  const t1y = useSpring(mouseY, { damping: 18, stiffness: 260, mass: 0.4 });
  const t2x = useSpring(t1x, { damping: 20, stiffness: 180, mass: 0.5 });
  const t2y = useSpring(t1y, { damping: 20, stiffness: 180, mass: 0.5 });

  // --- Magnetic blob ring -------------------------------------------------
  // Target position the blob is chasing. Normally it's the raw pointer, but
  // while hovering an interactive element it's pulled part-way toward that
  // element's center, producing the "magnetic" snap.
  const blobTargetX = useMotionValue(-100);
  const blobTargetY = useMotionValue(-100);
  const hoverFactor = useMotionValue(1); // dials down stretch while magnetically locked

  // Elastic spring with a bit of overshoot = the "snap" feel of magnetism.
  const ringX = useSpring(blobTargetX, { damping: 14, stiffness: 260, mass: 0.5 });
  const ringY = useSpring(blobTargetY, { damping: 14, stiffness: 260, mass: 0.5 });

  // Raw pointer velocity drives the squash/stretch, independent of the
  // (possibly magnetically-offset) blob position.
  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);

  const rawSpeed = useTransform(
    () => Math.hypot(velocityX.get(), velocityY.get()),
    [velocityX, velocityY]
  );
  const smoothSpeed = useSpring(rawSpeed, { damping: 22, stiffness: 200, mass: 0.4 });
  const intensity = useTransform(
    () => clamp(smoothSpeed.get() / 1600, 0, 1) * hoverFactor.get(),
    [smoothSpeed, hoverFactor]
  );

  const angle = useTransform(
    () => (Math.atan2(velocityY.get(), velocityX.get()) * 180) / Math.PI,
    [velocityX, velocityY]
  );

  // Scale is applied before rotate by default, so stretching along the
  // local x-axis and then rotating the whole shape aligns the long axis
  // of the blob with the direction of travel.
  const scaleX = useTransform(intensity, (v) => 1 + v * 1.15);
  const scaleY = useTransform(intensity, (v) => 1 - v * 0.45);

  const hoveredRectRef = useRef(null);

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

      const target = e.target.closest(INTERACTIVE_SELECTOR);
      const hovering = Boolean(target);
      setIsHovering(hovering);

      if (hovering) {
        const rect = target.getBoundingClientRect();
        hoveredRectRef.current = rect;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        // Pull the blob 55% of the way toward the element's center instead
        // of snapping fully - keeps it feeling magnetic rather than teleported.
        blobTargetX.set(e.clientX + (cx - e.clientX) * 0.55);
        blobTargetY.set(e.clientY + (cy - e.clientY) * 0.55);
        hoverFactor.set(0.2);
      } else {
        hoveredRectRef.current = null;
        blobTargetX.set(e.clientX);
        blobTargetY.set(e.clientY);
        hoverFactor.set(1);
      }
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
  }, [mouseX, mouseY, blobTargetX, blobTargetY, hoverFactor, spawnSpark]);

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

      {/* magnetic blob - stretches along travel direction, and while
          hovering an interactive element, pulls toward it and breathes */}
      <motion.div
        className={`cursor-ring${isHovering ? " cursor-ring--magnetic" : ""}`}
        style={{ x: ringX, y: ringY, scaleX, scaleY, rotate: angle }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 1.6 : 1,
        }}
        transition={{ opacity: { duration: 0.2 }, scale: { type: "spring", stiffness: 300, damping: 16 } }}
      >
        {isHovering && (
          <motion.div
            className="cursor-ring-pulse"
            animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.15, 0.5] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.div>

      <AnimatePresence>
        {sparks.map((s) =>
          Array.from({ length: 6 }).map((_, i) => {
            const sparkAngle = (i / 6) * Math.PI * 2;
            return (
              <motion.div
                key={`${s.id}-${i}`}
                className="cursor-spark"
                style={{ left: s.x, top: s.y }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: Math.cos(sparkAngle) * 22, y: Math.sin(sparkAngle) * 22, opacity: 0, scale: 0.3 }}
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