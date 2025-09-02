import { motion } from "framer-motion";
import { format, isToday, isTomorrow, isThisWeek, parseISO } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const UpcomingAssignments = ({ assignments, courses, onQuickAdd }) => {
  // Filter upcoming assignments (not completed, due within next 7 days)
  const upcomingAssignments = assignments
    .filter(assignment => {
      if (assignment.status === "completed") return false;
      const dueDate = new Date(assignment.dueDate);
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return dueDate >= now && dueDate <= nextWeek;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5); // Show only next 5

  const formatDueDate = (date) => {
    const dueDate = new Date(date);
    
    if (isToday(dueDate)) return "Today";
    if (isTomorrow(dueDate)) return "Tomorrow";
    return format(dueDate, "MMM dd");
  };

  const getDueDateColor = (date) => {
    const dueDate = new Date(date);
    if (isToday(dueDate)) return "text-error-600";
    if (isTomorrow(dueDate)) return "text-warning-600";
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

  if (upcomingAssignments.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold font-display text-gray-900">Upcoming Assignments</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onQuickAdd}
            className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
          >
            <ApperIcon name="Plus" size={16} />
            <span className="text-sm">Add</span>
          </Button>
        </div>
        <div className="text-center py-8">
          <div className="bg-gradient-to-br from-success-50 to-primary-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="CheckCircle" className="h-8 w-8 text-success-600" />
          </div>
          <p className="text-gray-600">All caught up!</p>
          <p className="text-sm text-gray-500 mt-1">No upcoming assignments due this week.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold font-display text-gray-900">Upcoming Assignments</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onQuickAdd}
          className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
        >
          <ApperIcon name="Plus" size={16} />
          <span className="text-sm">Add</span>
        </Button>
      </div>

      <div className="space-y-3">
        {upcomingAssignments.map((assignment, index) => {
          const course = courses.find(c => c.Id === assignment.courseId);
          
          return (
            <motion.div
              key={assignment.Id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-white to-gray-50/30 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex-shrink-0">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                  style={{ 
                    backgroundColor: course?.color + "20" || "#f3f4f620",
                    color: course?.color || "#6b7280"
                  }}
                >
                  <ApperIcon name="FileText" size={16} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">
                      {assignment.title}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {course?.name || "Unknown Course"}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 text-right">
                    <p className={`text-sm font-medium ${getDueDateColor(assignment.dueDate)}`}>
                      {formatDueDate(assignment.dueDate)}
                    </p>
                    <Badge variant={getPriorityVariant(assignment.priority)} size="sm">
                      {assignment.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

export default UpcomingAssignments;