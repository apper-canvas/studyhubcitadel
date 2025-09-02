import { cn } from "@/utils/cn";

const Badge = ({ children, variant = "default", size = "md", className, ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-secondary-100 text-secondary-800",
    success: "bg-success-100 text-success-800",
    warning: "bg-warning-100 text-warning-800",
    error: "bg-error-100 text-error-800",
    high: "bg-gradient-to-r from-error-100 to-error-200 text-error-800 border border-error-200",
    medium: "bg-gradient-to-r from-warning-100 to-warning-200 text-warning-800 border border-warning-200",
    low: "bg-gradient-to-r from-success-100 to-success-200 text-success-800 border border-success-200",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-sm"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;