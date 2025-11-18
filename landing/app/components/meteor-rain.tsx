"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Meteor {
  id: number;
  x: number;
  delay: number;
  duration: number;
}

export function MeteorRain() {
  const [meteors, setMeteors] = useState<Meteor[]>([]);

  useEffect(() => {
    const meteorCount = 8;
    const newMeteors: Meteor[] = Array.from({ length: meteorCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 1 + 1.5,
    }));
    setMeteors(newMeteors);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {meteors.map((meteor) => (
        <motion.div
          key={meteor.id}
          className="absolute w-0.5 h-24 bg-gradient-to-b from-primary/80 via-primary/40 to-transparent"
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

