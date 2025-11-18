"use client";

import { motion } from "framer-motion";

interface HealthLifestyleCardProps {
  emoji: string;
  title: string;
  description: string;
  index?: number;
}

export function HealthLifestyleCard({ emoji, title, description, index = 0 }: HealthLifestyleCardProps) {
  // Her kart için sabit ama farklı bir rotation değeri
  const rotations = [-1.2, 1.0, -0.9, 1.3];
  const rotation = rotations[index % rotations.length] || 0;
  
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 20, rotate: rotation }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true }}
      whileHover={{ y: -5, rotate: rotation + (rotation > 0 ? 2 : -2), scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Defter/Kağıt görünümü */}
      <div className="relative bg-linear-to-br from-background via-background to-muted/30 p-6 shadow-lg border-l-4 border-primary/30">
        {/* Kağıt dokusu */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0,0,0,0.03) 2px,
                rgba(0,0,0,0.03) 4px
              )
            `,
          }}
        />
        
        {/* Sol kenarda spiral delikler */}
        <div className="absolute left-0 top-0 bottom-0 w-1 flex flex-col items-center justify-start gap-2 pt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full border-2 border-primary/20 bg-background"
            />
          ))}
        </div>
        
        {/* İçerik */}
        <div className="relative pl-4">
          <motion.div
            className="text-4xl mb-4 inline-block"
            whileHover={{ scale: 1.15, rotate: 8 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {emoji}
          </motion.div>
          <h3 className="text-lg font-semibold mb-2 relative">
            {title}
            {/* Altı çizili gibi */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-primary/30 w-0 group-hover:w-full transition-all duration-300"
              initial={false}
            />
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed relative">
            {description}
          </p>
        </div>
        
        {/* Kağıt gölgesi */}
        <div className="absolute -bottom-1 left-2 right-2 h-1 bg-black/5 blur-sm rounded-full" />
      </div>
    </motion.div>
  );
}

