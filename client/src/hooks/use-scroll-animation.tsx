import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

interface ScrollAnimationOptions {
  /**
   * Threshold for when the animation should trigger
   * - 0 to 1 value where 1 means the element must be fully in view
   */
  threshold?: number;
  
  /**
   * Once the element has animated, should it stay visible?
   */
  once?: boolean;
  
  /**
   * Delay before the animation starts (in milliseconds)
   */
  delay?: number;
}

/**
 * Custom hook for scroll-based animations
 * 
 * @example
 * function MyComponent() {
 *   const { ref, inView } = useScrollAnimation();
 *   return (
 *     <motion.div
 *       ref={ref}
 *       variants={{
 *         hidden: { opacity: 0, y: 75 },
 *         visible: { opacity: 1, y: 0 }
 *       }}
 *       initial="hidden"
 *       animate={inView ? "visible" : "hidden"}
 *       transition={{ duration: 0.5, ease: "easeOut" }}
 *     >
 *       Content that animates on scroll
 *     </motion.div>
 *   );
 * }
 */
export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const { threshold = 0.1, once = true, delay = 0 } = options;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { 
    once, 
    amount: threshold 
  });
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      
      return () => clearTimeout(timer);
    }
    
    if (!once) {
      setIsVisible(false);
    }
  }, [inView, delay, once]);
  
  return { ref, inView: isVisible };
}

/**
 * Higher order component to add scroll animation to any component
 */
export function withScrollAnimation<P>(
  Component: React.ComponentType<P>, 
  options?: ScrollAnimationOptions
) {
  return function WithScrollAnimation(props: P) {
    const { ref, inView } = useScrollAnimation(options);
    
    return (
      <div ref={ref} className={`scroll-animation ${inView ? 'animate-in' : 'animate-out'}`}>
        <Component {...props} />
      </div>
    );
  };
}