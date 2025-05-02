import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { forwardRef } from "react";

// Animation variant
const tapAnimation = {
  tap: {
    scale: 0.98,
    y: 2,
    transition: {
      duration: 0.1,
    }
  }
};

const hoverAnimation = {
  rest: {
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      type: "tween",
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    y: -2,
    transition: {
      duration: 0.2,
      type: "tween",
      ease: "easeOut"
    }
  }
};

interface AnimatedButtonProps extends ButtonProps {
  hoverEffect?: "lift" | "scale" | "glow" | "none";
  glowColor?: string;
}

/**
 * AnimatedButton - A button with animation effects
 * 
 * @example
 * <AnimatedButton hoverEffect="lift">
 *   Click Me
 * </AnimatedButton>
 */
export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(({
  children,
  className,
  hoverEffect = "lift",
  glowColor = "rgba(var(--color-primary-rgb), 0.5)",
  ...props
}, ref) => {
  // Different animations for different hover effects
  const getVariants = () => {
    switch (hoverEffect) {
      case "lift":
        return {
          rest: { y: 0 },
          hover: { y: -2, transition: { duration: 0.2 } }
        };
      case "scale":
        return {
          rest: { scale: 1 },
          hover: { scale: 1.05, transition: { duration: 0.2 } }
        };
      case "glow":
        return {
          rest: { boxShadow: "0 0 0px transparent" },
          hover: { boxShadow: `0 0 10px ${glowColor}`, transition: { duration: 0.3 } }
        };
      default:
        return {};
    }
  };

  // No animation if hoverEffect is "none"
  if (hoverEffect === "none") {
    return (
      <Button
        ref={ref}
        className={className}
        {...props}
      >
        {children}
      </Button>
    );
  }

  return (
    <motion.div
      whileTap="tap"
      whileHover="hover"
      variants={{
        tap: tapAnimation.tap,
        rest: {
          ...hoverAnimation.rest,
          ...(getVariants().rest || {})
        },
        hover: {
          ...hoverAnimation.hover,
          ...(getVariants().hover || {})
        }
      }}
      initial="rest"
      animate="rest"
      className="inline-block"
    >
      <Button
        ref={ref}
        className={cn("transform-gpu will-change-transform", className)}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
});