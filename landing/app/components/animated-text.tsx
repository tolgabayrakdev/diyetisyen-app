"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const texts = [
  "Modern Çözüm",
  "Akıllı Platform",
  "Profesyonel Araç",
  "Güvenilir Sistem",
];

export function AnimatedText() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="block mt-2 text-primary relative inline-block min-h-[1.2em]">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="inline-block"
        >
          {texts[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

