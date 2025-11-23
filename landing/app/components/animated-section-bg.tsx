"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";

export function AnimatedSectionBg() {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orb'lar - mobilde daha küçük ve daha az animasyon */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            className={`absolute top-0 left-1/4 rounded-full blur-3xl opacity-30 will-change-transform ${
              isMobile ? "w-48 h-48" : "w-96 h-96"
            }`}
            style={{
              background: "radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)",
            }}
            animate={isMobile ? {} : {
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className={`absolute bottom-0 right-1/4 rounded-full blur-3xl opacity-20 will-change-transform ${
              isMobile ? "w-48 h-48" : "w-96 h-96"
            }`}
            style={{
              background: "radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)",
            }}
            animate={isMobile ? {} : {
              x: [0, -50, 0],
              y: [0, -30, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </>
      )}
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
}

