"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";

interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
  index?: number;
}

export function FeatureCard({ emoji, title, description, index = 0 }: FeatureCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <motion.div
      className="group relative h-full"
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 10 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
      transition={{ 
        duration: prefersReducedMotion ? 0 : isMobile ? 0.2 : 0.3,
        ease: "easeOut"
      }}
      style={{ willChange: prefersReducedMotion ? "auto" : "transform, opacity" }}
    >
      {/* Modern glassmorphism kart */}
      <div className="relative h-full p-6 rounded-2xl bg-linear-to-br from-card via-card to-card/80 border border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-200 group-hover:border-primary/30">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        
        {/* Icon badge */}
        <div className="relative mb-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors duration-200">
            <span className="text-2xl">{emoji}</span>
          </div>
        </div>
        
        {/* İçerik */}
        <div className="relative">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Hover efekti - glow */}
        <div className="absolute inset-0 rounded-2xl bg-primary/0 group-hover:bg-primary/5 transition-colors duration-200 pointer-events-none" />
        
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </div>
    </motion.div>
  );
}

