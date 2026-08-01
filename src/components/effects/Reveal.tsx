import { motion, type Variants, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Fade + rise into view on scroll.
 *
 * Production safety: content is visible by default (opacity: 1). The
 * animation is purely progressive enhancement — if JavaScript fails to
 * hydrate or the IntersectionObserver never fires, the content remains
 * fully readable and accessible. Framer Motion animates the vertical
 * offset on top of the always-visible base state.
 *
 * Accessibility: respects `prefers-reduced-motion` by disabling the
 * animation entirely; content renders as a plain div.
 */
const animatedVariants: Variants = {
  hidden: { opacity: 1, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staticVariants: Variants = {
  hidden: {},
  visible: {},
};

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? staticVariants : animatedVariants;

  if (prefersReducedMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}
