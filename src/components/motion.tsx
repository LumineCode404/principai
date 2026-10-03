"use client";

import {
  motion,
  MotionConfig,
  useScroll,
  useSpring,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { type ReactNode } from "react";

/**
 * Principai motion system.
 *
 * Rules of the road (Lighthouse-safe by construction):
 * - transform / opacity only. No layout-affecting animations, ever.
 * - `MotionConfig reducedMotion="user"` — prefers-reduced-motion is respected
 *   globally: users who ask for stillness get stillness.
 * - Viewport entrances fire once; they are decoration, not content.
 * - Springs over easing curves for anything interactive.
 */

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Global defaults: reduced-motion respect + a shared spring. */
export function MotionRoot({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 260, damping: 30 }}>
      {children}
    </MotionConfig>
  );
}

/**
 * Reveal — the workhorse. Fades + rises + un-blurs into view once.
 * Use `delay` sparingly; sequences should use Stagger instead.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children">) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: "spring", stiffness: 200, damping: 28, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Stagger — parent container that orchestrates Item entrances. */
export function Stagger({
  children,
  className,
  gap = 0.07,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Item — child of Stagger. Must be a direct child to inherit variants. */
export function Item({
  children,
  className,
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y, filter: "blur(4px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { type: "spring", stiffness: 220, damping: 27 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Lift — hover micro-interaction for cards and buttons.
 */
export function Lift({
  children,
  className,
  scale = 1.012,
}: {
  children: ReactNode;
  className?: string;
  scale?: number;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -3, scale }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScrollProgress — the thin brand bar that tracks reading position.
 * Pure transform (scaleX), pointer-inert, aria-hidden.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 34, restDelta: 0.001 });
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[#0282D8] via-[#5CB3F2] to-[#0282D8]"
      style={{ scaleX }}
    />
  );
}

/**
 * Spotlight — subtle, GPU-only pointer glow for the hero. Pure CSS (see
 * globals.css .hero-spotlight): paints without waiting for hydration, and
 * holds still for users who prefer reduced motion.
 */
export function HeroSpotlight() {
  return (
    <div aria-hidden className="hero-spotlight pointer-events-none absolute inset-0">
      <div
        className="hero-spotlight-drift absolute h-[560px] w-[560px] rounded-full opacity-[0.07] blur-3xl"
        style={{
          background: "radial-gradient(closest-side, #5CB3F2, transparent)",
        }}
      />
    </div>
  );
}

export { EASE_OUT };
