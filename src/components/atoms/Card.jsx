import { cn } from "@/utils/cn";

const Card = ({ children, className, gradient = false, hover = true, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border shadow-sm transition-all duration-200",
        gradient && "bg-gradient-to-br from-white to-gray-50/50",
        hover && "hover:shadow-md hover:scale-[1.01]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className, ...props }) => {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardTitle = ({ children, className, ...props }) => {
  return (
    <h3
      className={cn("text-lg font-semibold font-display leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
};

const CardContent = ({ children, className, ...props }) => {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;

export default Card;