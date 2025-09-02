import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ProgressRing from "@/components/molecules/ProgressRing";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Modal from "@/components/atoms/Modal";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import coursesService from "@/services/api/coursesService";
import gradesService from "@/services/api/gradesService";

const Grades = () => {
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    assignmentName: "",
    score: "",
    weight: 100,
    category: "assignment"
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [coursesData, gradesData] = await Promise.all([
        coursesService.getAll(),
        gradesService.getAll()
      ]);
      setCourses(coursesData);
      setGrades(gradesData);
    } catch (err) {
      setError("Failed to load grades data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateCourseGrade = (courseId) => {
    const courseGrades = grades.filter(g => g.courseId === courseId);
    if (courseGrades.length === 0) return 0;

    const totalWeight = courseGrades.reduce((sum, g) => sum + g.weight, 0);
    const weightedScore = courseGrades.reduce((sum, g) => sum + (g.score * g.weight), 0);
    
    return Math.round(weightedScore / totalWeight);
  };

  const getGradeColor = (grade) => {
    if (!grade || grade === 0) return "#6b7280";
    if (grade >= 90) return "#059669";
    if (grade >= 80) return "#2563eb";
    if (grade >= 70) return "#d97706";
    return "#dc2626";
  };

  const getGradeLetter = (grade) => {
    if (!grade || grade === 0) return "N/A";
    if (grade >= 97) return "A+";
    if (grade >= 93) return "A";
    if (grade >= 90) return "A-";
    if (grade >= 87) return "B+";
    if (grade >= 83) return "B";
    if (grade >= 80) return "B-";
    if (grade >= 77) return "C+";
    if (grade >= 73) return "C";
    if (grade >= 70) return "C-";
    if (grade >= 67) return "D+";
    if (grade >= 65) return "D";
    return "F";
  };

  const handleAddGrade = (course) => {
    setSelectedCourse(course);
    setFormData({
      assignmentName: "",
      score: "",
      weight: 100,
      category: "assignment"
    });
    setShowGradeModal(true);
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    
    if (!formData.assignmentName.trim()) {
      toast.error("Assignment name is required");
      return;
    }

    if (!formData.score || formData.score < 0 || formData.score > 100) {
      toast.error("Please enter a valid score (0-100)");
      return;
    }

    setIsSubmitting(true);

    try {
      const gradeData = {
        courseId: selectedCourse.Id,
        assignmentName: formData.assignmentName,
        score: parseFloat(formData.score),
        weight: parseInt(formData.weight),
        category: formData.category
      };

      const newGrade = await gradesService.create(gradeData);
      setGrades(prev => [...prev, newGrade]);
      setShowGradeModal(false);
      toast.success("Grade added successfully!");
    } catch (error) {
      toast.error("Failed to add grade");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGrade = async (gradeId) => {
    if (window.confirm("Are you sure you want to delete this grade?")) {
      try {
        await gradesService.delete(gradeId);
        setGrades(prev => prev.filter(g => g.Id !== gradeId));
        toast.success("Grade deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete grade");
      }
    }
  };

  // Calculate overall GPA
  const coursesWithGrades = courses.filter(course => {
    const grade = calculateCourseGrade(course.Id);
    return grade > 0;
  });

  const overallGPA = coursesWithGrades.length > 0
    ? coursesWithGrades.reduce((sum, course) => {
        const grade = calculateCourseGrade(course.Id);
        const points = grade >= 97 ? 4.0 : grade >= 93 ? 4.0 : grade >= 90 ? 3.7 :
                      grade >= 87 ? 3.3 : grade >= 83 ? 3.0 : grade >= 80 ? 2.7 :
                      grade >= 77 ? 2.3 : grade >= 73 ? 2.0 : grade >= 70 ? 1.7 :
                      grade >= 67 ? 1.3 : grade >= 65 ? 1.0 : 0.0;
        return sum + (points * course.credits);
      }, 0) / coursesWithGrades.reduce((sum, course) => sum + course.credits, 0)
    : 0;

  if (loading) {
    return <Loading type="cards" />;
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
            My Grades
          </h1>
          <p className="text-gray-600">
            Track your academic progress across all courses
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold font-display text-gray-900">
            {overallGPA > 0 ? overallGPA.toFixed(2) : "N/A"}
          </p>
          <p className="text-sm text-gray-600">Overall GPA</p>
        </div>
      </motion.div>

      {/* Grades Overview */}
      {courses.length === 0 ? (
        <Empty
          title="No courses added yet"
          description="Add your courses first to start tracking grades"
          actionLabel="Add Course"
          onAction={() => window.location.href = "/courses"}
          icon="BookOpen"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => {
            const currentGrade = calculateCourseGrade(course.Id);
            const courseGrades = grades.filter(g => g.courseId === course.Id);
            
            return (
              <motion.div
                key={course.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full relative overflow-hidden">
                  {/* Course color indicator */}
                  <div 
                    className="absolute top-0 left-0 w-full h-1.5 rounded-t-xl"
                    style={{ backgroundColor: course.color }}
                  />
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold font-display text-gray-900 mb-1">
                        {course.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
                      <Badge variant="default" size="sm">
                        {course.credits} credits
                      </Badge>
                    </div>
                    
                    <ProgressRing
                      progress={currentGrade}
                      size={64}
                      strokeWidth={6}
                      color={getGradeColor(currentGrade)}
                      showPercentage={false}
                    />
                  </div>

                  <div className="text-center mb-4">
                    <p 
                      className="text-3xl font-bold font-display mb-1"
                      style={{ color: getGradeColor(currentGrade) }}
                    >
                      {currentGrade > 0 ? `${currentGrade}%` : "N/A"}
                    </p>
                    <p className="text-sm font-medium text-gray-600">
                      {getGradeLetter(currentGrade)}
                    </p>
                  </div>

                  {courseGrades.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-medium text-gray-700">Recent Grades:</h4>
                      {courseGrades.slice(-3).map(grade => (
                        <div key={grade.Id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 truncate flex-1">
                            {grade.assignmentName}
                          </span>
                          <span className="font-medium text-gray-900 ml-2">
                            {grade.score}%
                          </span>
                        </div>
                      ))}
                      {courseGrades.length > 3 && (
                        <p className="text-xs text-gray-500">+{courseGrades.length - 3} more</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4 mb-4">
                      <p className="text-sm text-gray-500">No grades yet</p>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddGrade(course)}
                    className="w-full"
                  >
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    Add Grade
                  </Button>

                  {/* Background decoration */}
                  <div 
                    className="absolute -right-6 -bottom-6 opacity-5"
                    style={{ color: course.color }}
                  >
                    <ApperIcon name="TrendingUp" size={60} />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Grade Modal */}
      <Modal isOpen={showGradeModal} onClose={() => setShowGradeModal(false)} size="md">
        <Modal.Header onClose={() => setShowGradeModal(false)}>
          <Modal.Title>
            Add Grade - {selectedCourse?.name}
          </Modal.Title>
        </Modal.Header>

        <form onSubmit={handleSubmitGrade}>
          <Modal.Content>
            <div className="space-y-4">
              <Input
                label="Assignment Name"
                value={formData.assignmentName}
                onChange={(e) => setFormData(prev => ({...prev, assignmentName: e.target.value}))}
                placeholder="e.g., Midterm Exam, Essay #1"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Score (%)"
                  type="number"
                  value={formData.score}
                  onChange={(e) => setFormData(prev => ({...prev, score: e.target.value}))}
                  placeholder="0-100"
                  min="0"
                  max="100"
                  step="0.1"
                  required
                />

                <Input
                  label="Weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({...prev, weight: parseInt(e.target.value) || 100}))}
                  placeholder="100"
                  min="1"
                  max="1000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none shadow-sm transition-all duration-200"
                >
                  <option value="assignment">Assignment</option>
                  <option value="exam">Exam</option>
                  <option value="quiz">Quiz</option>
                  <option value="project">Project</option>
                  <option value="participation">Participation</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </Modal.Content>

          <Modal.Footer>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowGradeModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ApperIcon name="Plus" size={16} />
                  Add Grade
                </>
              )}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default Grades;