"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

interface Meteor {
  id: number;
  x: number;
  delay: number;
  duration: number;
}

export function MeteorRain() {
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    // Mobilde daha az meteor
    const meteorCount = isMobile ? 3 : prefersReducedMotion ? 0 : 8;
    const newMeteors: Meteor[] = Array.from({ length: meteorCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 1 + 1.5,
    }));
    setMeteors(newMeteors);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion || meteors.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {meteors.map((meteor) => (
        <motion.div
          key={meteor.id}
          className="absolute w-0.5 h-24 bg-gradient-to-b from-primary/80 via-primary/40 to-transparent will-change-transform"
          style={{
            left: `${meteor.x}%`,
            top: "-24px",
            transform: "rotate(45deg)",
          }}
          animate={{
            y: ["0vh", "120vh"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: meteor.duration,
            delay: meteor.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

