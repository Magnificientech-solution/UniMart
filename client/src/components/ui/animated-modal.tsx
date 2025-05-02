import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

// Overlay animation
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.2,
      ease: "easeOut" 
    } 
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.2,
      ease: "easeIn" 
    } 
  }
};

// Modal content animation
const modalVariants = {
  hidden: { 
    opacity: 0,
    y: 10,
    scale: 0.98
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.3 
    } 
  },
  exit: { 
    opacity: 0,
    scale: 0.96,
    transition: { 
      duration: 0.2,
      ease: "easeIn" 
    } 
  }
};

interface AnimatedModalProps {
  trigger: ReactNode;
  children: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/**
 * AnimatedModal - A modal dialog with smooth animations
 * 
 * @example
 * <AnimatedModal trigger={<Button>Open Modal</Button>}>
 *   <div>Modal content goes here</div>
 * </AnimatedModal>
 */
export function AnimatedModal({ 
  trigger, 
  children, 
  isOpen, 
  onOpenChange,
  className 
}: AnimatedModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      
      <AnimatePresence>
        {isOpen && (
          <DialogContent className={cn("p-0 border-none bg-transparent shadow-none", className)} forceMount>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[var(--z-overlay)]"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />
            
            <motion.div
              className="relative bg-background rounded-xl border border-primary/10 shadow-lg max-w-md mx-auto w-full overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {children}
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}