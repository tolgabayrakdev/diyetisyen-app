"use client";

import { motion } from "framer-motion";

interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
  index?: number;
}

export function FeatureCard({ emoji, title, description, index = 0 }: FeatureCardProps) {
  return (
    <motion.div
      className="group relative h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Modern glassmorphism kart */}
      <div className="relative h-full p-6 rounded-2xl bg-linear-to-br from-card via-card to-card/80 border border-border/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all group-hover:border-primary/30">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Icon badge */}
        <div className="relative mb-4">
          <motion.div
            className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors"
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-2xl">{emoji}</span>
          </motion.div>
        </div>
        
        {/* İçerik */}
        <div className="relative">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Hover efekti - glow */}
        <div className="absolute inset-0 rounded-2xl bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500 pointer-events-none" />
        
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </motion.div>
  );
}

