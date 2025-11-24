"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function LightStarsBackground() {
  const [stars, setStars] = useState<Star[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    // Hafif arka plan için daha az ve küçük yıldızlar
    const starCount = isMobile ? 40 : prefersReducedMotion ? 25 : 100;
    const newStars: Star[] = Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1.5,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 3,
    }));
    setStars(newStars);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full will-change-transform"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: "rgba(59, 130, 246, 0.4)",
            boxShadow: "0 0 4px rgba(59, 130, 246, 0.3)",
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

