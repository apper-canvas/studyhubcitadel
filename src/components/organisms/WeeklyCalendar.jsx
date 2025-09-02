import { motion } from "framer-motion";
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay,
  isToday,
  addDays
} from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const WeeklyCalendar = ({ courses, assignments }) => {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getEventsForDay = (date) => {
    const dayName = format(date, "EEEE");
    
    // Get classes for this day
    const classes = courses.flatMap(course =>
      course.schedule
        ?.filter(schedule => schedule.dayOfWeek === dayName)
        .map(schedule => ({
          ...schedule,
          course,
          type: "class"
        })) || []
    );

    // Get assignments due this day
    const assignmentsDue = assignments
      .filter(assignment => {
        const dueDate = new Date(assignment.dueDate);
        return isSameDay(dueDate, date) && assignment.status !== "completed";
      })
      .map(assignment => {
        const course = courses.find(c => c.Id === assignment.courseId);
        return {
          ...assignment,
          course,
          type: "assignment",
          time: "23:59"
        };
      });

    return [...classes, ...assignmentsDue].sort((a, b) => {
      const timeA = a.startTime || a.time || "00:00";
      const timeB = b.startTime || b.time || "00:00";
      return timeA.localeCompare(timeB);
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes.padStart(2, "0")} ${period}`;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold font-display text-gray-900">Weekly Schedule</h3>
          <p className="text-sm text-gray-600">
            {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2">
            <ApperIcon name="ChevronLeft" size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <ApperIcon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const events = getEventsForDay(day);
          const dayIsToday = isToday(day);

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-3 bg-gradient-to-br from-white to-gray-50/30 ${
                dayIsToday ? "border-primary-200 bg-gradient-to-br from-primary-50 to-primary-50/30" : "border-gray-200"
              }`}
            >
              <div className="text-center mb-3">
                <p className={`text-sm font-medium ${
                  dayIsToday ? "text-primary-700" : "text-gray-600"
                }`}>
                  {format(day, "EEE")}
                </p>
                <p className={`text-lg font-bold font-display ${
                  dayIsToday ? "text-primary-900" : "text-gray-900"
                }`}>
                  {format(day, "d")}
                </p>
                {dayIsToday && (
                  <div className="w-2 h-2 bg-primary-500 rounded-full mx-auto mt-1" />
                )}
              </div>

              <div className="space-y-2">
                {events.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">No events</p>
                ) : (
                  events.slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={`${event.type}-${event.Id || event.id || eventIndex}`}
                      className={`p-2 rounded-md text-xs border transition-all duration-200 hover:shadow-sm ${
                        event.type === "class"
                          ? "bg-gradient-to-r from-blue-50 to-blue-50/50 border-blue-200 text-blue-800"
                          : "bg-gradient-to-r from-orange-50 to-orange-50/50 border-orange-200 text-orange-800"
                      }`}
                    >
                      <div className="flex items-center space-x-1 mb-1">
                        <ApperIcon 
                          name={event.type === "class" ? "BookOpen" : "FileText"} 
                          size={12} 
                        />
                        <span className="font-medium truncate">
                          {event.type === "class" ? event.course.name : event.title}
                        </span>
                      </div>
                      <p className="truncate opacity-75">
                        {formatTime(event.startTime || event.time)}
                        {event.endTime && ` - ${formatTime(event.endTime)}`}
                      </p>
                    </div>
                  ))
                )}
                {events.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{events.length - 3} more
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

export default WeeklyCalendar;