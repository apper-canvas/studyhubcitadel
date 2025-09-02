import { motion } from "framer-motion";
import { format, isToday, parseISO } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const TodaySchedule = ({ courses, assignments }) => {
  const today = new Date();
  const todayDay = format(today, "EEEE");

  // Get today's classes
  const todayClasses = courses.flatMap(course => 
    course.schedule
      ?.filter(schedule => schedule.dayOfWeek === todayDay)
      .map(schedule => ({
        ...schedule,
        course,
        type: "class"
      })) || []
  );

  // Get assignments due today
  const assignmentsDueToday = assignments
    .filter(assignment => {
      const dueDate = new Date(assignment.dueDate);
      return isToday(dueDate) && assignment.status !== "completed";
    })
    .map(assignment => {
      const course = courses.find(c => c.Id === assignment.courseId);
      return {
        ...assignment,
        course,
        type: "assignment",
        time: "23:59" // Default end of day
      };
    });

  // Combine and sort by time
  const todayEvents = [...todayClasses, ...assignmentsDueToday]
    .sort((a, b) => {
      const timeA = a.startTime || a.time || "00:00";
      const timeB = b.startTime || b.time || "00:00";
      return timeA.localeCompare(timeB);
    });

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  if (todayEvents.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold font-display text-gray-900">Today's Schedule</h3>
          <ApperIcon name="Calendar" className="h-5 w-5 text-primary-600" />
        </div>
        <div className="text-center py-8">
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="Coffee" className="h-8 w-8 text-primary-600" />
          </div>
          <p className="text-gray-600">No classes or assignments due today!</p>
          <p className="text-sm text-gray-500 mt-1">Perfect time to catch up or get ahead.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold font-display text-gray-900">Today's Schedule</h3>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Calendar" className="h-5 w-5 text-primary-600" />
          <span className="text-sm font-medium text-primary-600">
            {format(today, "EEEE, MMM d")}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {todayEvents.map((event, index) => (
          <motion.div
            key={`${event.type}-${event.Id || event.id || index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-50/50 border border-gray-100 hover:border-gray-200 transition-colors"
          >
            <div className="flex-shrink-0">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
                style={{ 
                  backgroundColor: event.course?.color + "20" || "#f3f4f620",
                  color: event.course?.color || "#6b7280"
                }}
              >
                <ApperIcon 
                  name={event.type === "class" ? "BookOpen" : "FileText"} 
                  size={18} 
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {event.type === "class" ? event.course.name : event.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {event.type === "class" 
                      ? event.location || "No location"
                      : `Due: ${event.course?.name || "Unknown Course"}`
                    }
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatTime(event.startTime || event.time)}
                    {event.endTime && ` - ${formatTime(event.endTime)}`}
                  </p>
                  <Badge 
                    variant={event.type === "class" ? "primary" : "warning"} 
                    size="sm"
                  >
                    {event.type === "class" ? "Class" : event.priority}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default TodaySchedule;