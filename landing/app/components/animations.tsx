"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";

interface FadeInUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FadeInUp({ children, delay = 0, className = "" }: FadeInUpProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 10 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
      transition={{ 
        duration: prefersReducedMotion ? 0 : isMobile ? 0.4 : 0.6, 
        delay: prefersReducedMotion ? 0 : delay 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, className = "" }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
}

export function StaggerContainer({ children, className = "" }: StaggerContainerProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
      variants={{
        hidden: { opacity: prefersReducedMotion ? 1 : 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: prefersReducedMotion ? 0 : isMobile ? 0.02 : 0.1,
            delayChildren: prefersReducedMotion ? 0 : isMobile ? 0 : 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <motion.div
      variants={{
        hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : isMobile ? 5 : 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: prefersReducedMotion ? 0 : isMobile ? 0.25 : 0.5,
            ease: isMobile ? "easeOut" : "easeInOut",
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface CounterProps {
  value: string;
  delay?: number;
  className?: string;
}

export function Counter({ value, delay = 0, className = "" }: CounterProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: prefersReducedMotion ? 0 : isMobile ? 0.3 : 0.5, 
        delay: prefersReducedMotion ? 0 : delay, 
        type: prefersReducedMotion ? "tween" : "spring", 
        stiffness: 100 
      }}
      className={className}
    >
      {value}
    </motion.div>
  );
}

interface ScaleOnHoverProps {
  children: ReactNode;
  className?: string;
}

export function ScaleOnHover({ children, className = "" }: ScaleOnHoverProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <motion.div
      whileHover={prefersReducedMotion || isMobile ? {} : { scale: 1.05 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

