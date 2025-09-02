import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({ title, value, icon, trend, trendLabel, color = "primary", gradient = true }) => {
  const colorClasses = {
    primary: "from-primary-500 to-primary-600",
    secondary: "from-secondary-500 to-secondary-600",
    success: "from-success-500 to-success-600",
    warning: "from-warning-500 to-warning-600",
    error: "from-error-500 to-error-600"
  };

  return (
    <Card gradient={gradient} className="p-6 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold font-display text-gray-900 mb-2">{value}</p>
          {trend && (
            <div className="flex items-center text-sm">
              <ApperIcon 
                name={trend > 0 ? "TrendingUp" : "TrendingDown"} 
                size={16} 
                className={trend > 0 ? "text-success-600" : "text-error-600 mr-1"} 
              />
              <span className={trend > 0 ? "text-success-600" : "text-error-600"}>
                {Math.abs(trend)}%
              </span>
              {trendLabel && <span className="text-gray-500 ml-1">{trendLabel}</span>}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
          <ApperIcon name={icon} className="h-6 w-6 text-white" />
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute -right-6 -top-6 opacity-5">
        <ApperIcon name={icon} size={80} />
      </div>
    </Card>
  );
};

export default StatCard;