import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import WeeklyCalendar from "@/components/organisms/WeeklyCalendar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import coursesService from "@/services/api/coursesService";
import assignmentsService from "@/services/api/assignmentsService";

const Schedule = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [coursesData, assignmentsData] = await Promise.all([
        coursesService.getAll(),
        assignmentsService.getAll()
      ]);
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError("Failed to load schedule data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Check if there are any scheduled events
  const hasScheduledEvents = courses.some(course => 
    course.schedule && course.schedule.length > 0
  ) || assignments.some(assignment => 
    assignment.status !== "completed"
  );

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 mb-2">
            My Schedule
          </h1>
          <p className="text-gray-600">
            Weekly view of your classes and assignment deadlines
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center gap-2">
            <ApperIcon name="Download" size={16} />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <ApperIcon name="Settings" size={16} />
            View Options
          </Button>
        </div>
      </motion.div>

      {/* Schedule Content */}
      {!hasScheduledEvents ? (
        <Empty
          title="No scheduled events"
          description="Add courses with schedules and assignments to see your weekly calendar"
          actionLabel="Add Course"
          onAction={() => window.location.href = "/courses"}
          icon="Calendar"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <WeeklyCalendar courses={courses} assignments={assignments} />
        </motion.div>
      )}

      {/* Quick Stats */}
      {hasScheduledEvents && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-100 p-2 rounded-lg">
                <ApperIcon name="BookOpen" className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-gray-900">
                  {courses.length}
                </p>
                <p className="text-sm text-gray-600">Active Courses</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-warning-100 p-2 rounded-lg">
                <ApperIcon name="Clock" className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-gray-900">
                  {assignments.filter(a => a.status !== "completed").length}
                </p>
                <p className="text-sm text-gray-600">Pending Tasks</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-success-100 p-2 rounded-lg">
                <ApperIcon name="CheckCircle" className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-gray-900">
                  {assignments.filter(a => a.status === "completed").length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-secondary-100 p-2 rounded-lg">
                <ApperIcon name="TrendingUp" className="h-5 w-5 text-secondary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-gray-900">
                  {Math.round((assignments.filter(a => a.status === "completed").length / Math.max(assignments.length, 1)) * 100)}%
                </p>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Schedule;