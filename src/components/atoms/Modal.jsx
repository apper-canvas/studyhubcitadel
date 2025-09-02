import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Modal = ({ isOpen, onClose, children, className, size = "md" }) => {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl"
  };

  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "relative bg-white rounded-xl shadow-xl w-full",
              sizes[size],
              className
            )}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ModalHeader = ({ children, className, onClose, ...props }) => {
  return (
    <div
      className={cn("flex items-center justify-between p-6 border-b", className)}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ApperIcon name="X" size={20} />
        </button>
      )}
    </div>
  );
};

const ModalTitle = ({ children, className, ...props }) => {
  return (
    <h2
      className={cn("text-lg font-semibold font-display text-gray-900", className)}
      {...props}
    >
      {children}
    </h2>
  );
};

const ModalContent = ({ children, className, ...props }) => {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
};

const ModalFooter = ({ children, className, ...props }) => {
  return (
    <div
      className={cn("flex items-center justify-end gap-3 p-6 border-t bg-gray-50/50 rounded-b-xl", className)}
      {...props}
    >
      {children}
    </div>
  );
};

Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

export default Modal;