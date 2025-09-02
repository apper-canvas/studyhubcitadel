import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const CourseCard = ({ course, onEdit, onDelete, onView }) => {
  const getNextClass = () => {
    const now = new Date();
    const today = now.toLocaleDateString("en-US", { weekday: "long" });
    
    const todaySchedule = course.schedule?.find(s => s.dayOfWeek === today);
    if (todaySchedule) {
      const classTime = new Date();
      const [hours, minutes] = todaySchedule.startTime.split(":");
      classTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      if (classTime > now) {
        return `Today at ${todaySchedule.startTime}`;
      }
    }
    
    return course.schedule?.[0] ? `${course.schedule[0].dayOfWeek} ${course.schedule[0].startTime}` : "No schedule";
  };

  const getGradeColor = (grade) => {
    if (!grade || grade === 0) return "text-gray-400";
    if (grade >= 90) return "text-success-600";
    if (grade >= 80) return "text-primary-600";
    if (grade >= 70) return "text-warning-600";
    return "text-error-600";
  };

  const currentGrade = course.currentGrade || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 h-full relative overflow-hidden">
        {/* Course color indicator */}
        <div 
          className="absolute top-0 left-0 w-full h-1.5 rounded-t-xl"
          style={{ backgroundColor: course.color }}
        />
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: course.color + "20", color: course.color }}
            >
              <ApperIcon name="BookOpen" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold font-display text-gray-900 mb-1">
                {course.name}
              </h3>
              <p className="text-sm text-gray-600">{course.instructor}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.(course)}
              className="p-2"
            >
              <ApperIcon name="Edit2" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete?.(course)}
              className="p-2 hover:bg-error-50 hover:text-error-600"
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="Clock" size={16} />
              <span>{getNextClass()}</span>
            </div>
            <Badge variant="default" size="sm">
              {course.credits} credits
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="MapPin" size={16} />
              <span>{course.location || "No location"}</span>
            </div>
            <div className={`text-xl font-bold font-display ${getGradeColor(currentGrade)}`}>
              {currentGrade > 0 ? `${currentGrade}%` : "No grade"}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView?.(course)}
              className="w-full"
            >
              View Details
            </Button>
          </div>
        </div>

        {/* Background decoration */}
        <div 
          className="absolute -right-6 -bottom-6 opacity-5"
          style={{ color: course.color }}
        >
          <ApperIcon name="BookOpen" size={60} />
        </div>
      </Card>
    </motion.div>
  );
};

export default CourseCard;