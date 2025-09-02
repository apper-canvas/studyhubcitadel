import { motion } from "framer-motion";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const AssignmentRow = ({ assignment, course, onEdit, onDelete, onToggleComplete }) => {
  const formatDueDate = (date) => {
    const dueDate = new Date(date);
    
    if (isToday(dueDate)) return "Today";
    if (isTomorrow(dueDate)) return "Tomorrow";
    return format(dueDate, "MMM dd");
  };

  const getDueDateColor = (date, status) => {
    if (status === "completed") return "text-gray-500";
    
    const dueDate = new Date(date);
    if (isPast(dueDate)) return "text-error-600 font-medium";
    if (isToday(dueDate)) return "text-warning-600 font-medium";
    if (isTomorrow(dueDate)) return "text-warning-500 font-medium";
    return "text-gray-700";
  };

  const getPriorityVariant = (priority) => {
    const variants = {
      high: "high",
      medium: "medium",
      low: "low"
    };
    return variants[priority] || "default";
  };

  const getStatusVariant = (status) => {
    const variants = {
      completed: "success",
      "in-progress": "primary",
      todo: "default"
    };
    return variants[status] || "default";
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: "rgba(248, 250, 252, 0.5)" }}
      className={`border-b transition-colors ${
        assignment.status === "completed" ? "opacity-60" : ""
      }`}
    >
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onToggleComplete?.(assignment)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              assignment.status === "completed"
                ? "bg-success-500 border-success-500"
                : "border-gray-300 hover:border-primary-500"
            }`}
          >
            {assignment.status === "completed" && (
              <ApperIcon name="Check" size={12} className="text-white" />
            )}
          </button>
          <div>
            <p className={`font-medium ${
              assignment.status === "completed" 
                ? "line-through text-gray-500" 
                : "text-gray-900"
            }`}>
              {assignment.title}
            </p>
            {assignment.description && (
              <p className="text-sm text-gray-500 mt-1">
                {assignment.description}
              </p>
            )}
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: course?.color || "#6b7280" }}
          />
          <span className="text-sm font-medium text-gray-700">
            {course?.name || "Unknown Course"}
          </span>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className={getDueDateColor(assignment.dueDate, assignment.status)}>
          {formatDueDate(assignment.dueDate)}
        </span>
      </td>

      <td className="px-6 py-4">
        <Badge variant={getPriorityVariant(assignment.priority)} size="sm">
          {assignment.priority}
        </Badge>
      </td>

      <td className="px-6 py-4">
        <Badge variant={getStatusVariant(assignment.status)} size="sm">
          {assignment.status}
        </Badge>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(assignment)}
            className="p-1.5"
          >
            <ApperIcon name="Edit2" size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(assignment)}
            className="p-1.5 hover:bg-error-50 hover:text-error-600"
          >
            <ApperIcon name="Trash2" size={14} />
          </Button>
        </div>
      </td>
    </motion.tr>
  );
};

export default AssignmentRow;