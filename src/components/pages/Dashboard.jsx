import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";
import TodaySchedule from "@/components/organisms/TodaySchedule";
import UpcomingAssignments from "@/components/organisms/UpcomingAssignments";
import QuickAddModal from "@/components/molecules/QuickAddModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import coursesService from "@/services/api/coursesService";
import assignmentsService from "@/services/api/assignmentsService";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

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
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickAdd = async (assignmentData) => {
    const newAssignment = await assignmentsService.create(assignmentData);
    setAssignments(prev => [...prev, newAssignment]);
  };

  // Calculate stats
  const totalCourses = courses.length;
  const pendingAssignments = assignments.filter(a => a.status !== "completed").length;
  const completedThisWeek = assignments.filter(a => {
    const completedDate = new Date(a.updatedAt || a.dueDate);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return a.status === "completed" && completedDate >= weekAgo;
  }).length;
  
  const totalGrades = courses.filter(c => c.currentGrade && c.currentGrade > 0);
  const averageGrade = totalGrades.length > 0 
    ? Math.round(totalGrades.reduce((sum, c) => sum + c.currentGrade, 0) / totalGrades.length)
    : 0;

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
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">Here's your academic overview for today.</p>
        </div>
        <Button
          onClick={() => setShowQuickAdd(true)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={18} />
          Quick Add
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Total Courses"
            value={totalCourses}
            icon="BookOpen"
            color="primary"
            trend={totalCourses > 0 ? 5 : null}
            trendLabel="this semester"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Pending Tasks"
            value={pendingAssignments}
            icon="Clock"
            color="warning"
            trend={pendingAssignments > 0 ? -12 : 0}
            trendLabel="from last week"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Completed This Week"
            value={completedThisWeek}
            icon="CheckCircle"
            color="success"
            trend={completedThisWeek > 0 ? 24 : 0}
            trendLabel="vs last week"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Average Grade"
            value={averageGrade > 0 ? `${averageGrade}%` : "No grades"}
            icon="TrendingUp"
            color="secondary"
            trend={averageGrade > 0 ? 8 : null}
            trendLabel="this semester"
          />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <TodaySchedule courses={courses} assignments={assignments} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <UpcomingAssignments 
            courses={courses} 
            assignments={assignments}
            onQuickAdd={() => setShowQuickAdd(true)}
          />
        </motion.div>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        courses={courses}
        onSubmit={handleQuickAdd}
      />
    </div>
  );
};

export default Dashboard;