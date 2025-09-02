import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Get started by adding your first item", 
  actionLabel = "Get Started",
  onAction,
  icon = "FileText"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-6 bg-white rounded-xl shadow-sm border"
    >
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6 rounded-full mb-6">
        <ApperIcon name={icon} className="h-12 w-12 text-primary-600" />
      </div>
      <h3 className="text-xl font-semibold font-display text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-8 max-w-md">{description}</p>
      {onAction && (
        <Button onClick={onAction} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;