import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

// Page transition animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 10
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.33, 1, 0.68, 1], // easeOutCubic
      staggerChildren: 0.05,
      when: "beforeChildren"
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.33, 1, 0.68, 1]
    }
  }
};

/**
 * PageTransition - Wraps page content with smooth enter/exit animations
 * 
 * @example
 * <PageTransition>
 *   <YourPageContent />
 * </PageTransition>
 */
export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className={`page-transition ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered item animation - Use for list items that should animate in sequence
 */
export function StaggerItem({ children, className = "", delay = 0 }: PageTransitionProps & { delay?: number }) {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 20 },
        enter: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.3,
            ease: [0.33, 1, 0.68, 1],
            delay 
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}