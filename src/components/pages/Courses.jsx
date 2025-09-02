import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import CourseCard from "@/components/molecules/CourseCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import coursesService from "@/services/api/coursesService";

const COURSE_COLORS = [
  "#2563eb", "#7c3aed", "#dc2626", "#059669", "#d97706",
  "#be123c", "#0891b2", "#7c2d12", "#4338ca", "#16a34a"
];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    instructor: "",
    location: "",
    credits: 3,
    color: COURSE_COLORS[0],
    semester: "Fall 2024"
  });

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await coursesService.getAll();
      setCourses(data);
    } catch (err) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      instructor: "",
      location: "",
      credits: 3,
      color: COURSE_COLORS[0],
      semester: "Fall 2024"
    });
    setEditingCourse(null);
  };

  const handleOpenModal = (course = null) => {
    if (course) {
      setFormData({
        name: course.name,
        instructor: course.instructor,
        location: course.location || "",
        credits: course.credits,
        color: course.color,
        semester: course.semester
      });
      setEditingCourse(course);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setShowModal(false);
      setTimeout(resetForm, 200);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Course name is required");
      return;
    }

    if (!formData.instructor.trim()) {
      toast.error("Instructor name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingCourse) {
        const updatedCourse = await coursesService.update(editingCourse.Id, formData);
        setCourses(prev => prev.map(c => c.Id === editingCourse.Id ? updatedCourse : c));
        toast.success("Course updated successfully!");
      } else {
        const newCourse = await coursesService.create({
          ...formData,
          schedule: [], // Start with empty schedule
          currentGrade: 0
        });
        setCourses(prev => [...prev, newCourse]);
        toast.success("Course added successfully!");
      }
      handleCloseModal();
    } catch (error) {
      toast.error(editingCourse ? "Failed to update course" : "Failed to add course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (course) => {
    if (window.confirm(`Are you sure you want to delete ${course.name}?`)) {
      try {
        await coursesService.delete(course.Id);
        setCourses(prev => prev.filter(c => c.Id !== course.Id));
        toast.success("Course deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete course");
      }
    }
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCourses} />;
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
            My Courses
          </h1>
          <p className="text-gray-600">
            {courses.length} course{courses.length !== 1 ? "s" : ""} this semester
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={18} />
          Add Course
        </Button>
      </motion.div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <Empty
          title="No courses yet"
          description="Add your first course to start organizing your academic life"
          actionLabel="Add Course"
          onAction={() => handleOpenModal()}
          icon="BookOpen"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CourseCard
                course={course}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
                onView={(course) => console.log("View course:", course)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Course Modal */}
      <Modal isOpen={showModal} onClose={handleCloseModal} size="md">
        <Modal.Header onClose={handleCloseModal}>
          <Modal.Title>
            {editingCourse ? "Edit Course" : "Add New Course"}
          </Modal.Title>
        </Modal.Header>

        <form onSubmit={handleSubmit}>
          <Modal.Content>
            <div className="space-y-4">
              <Input
                label="Course Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                placeholder="e.g., Introduction to Psychology"
                required
              />

              <Input
                label="Instructor"
                value={formData.instructor}
                onChange={(e) => setFormData(prev => ({...prev, instructor: e.target.value}))}
                placeholder="e.g., Dr. Smith"
                required
              />

              <Input
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                placeholder="e.g., Room 101, Science Building"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Credits"
                  type="number"
                  value={formData.credits}
                  onChange={(e) => setFormData(prev => ({...prev, credits: parseInt(e.target.value) || 3}))}
                  min="1"
                  max="6"
                  required
                />

                <Select
                  label="Semester"
                  value={formData.semester}
                  onChange={(e) => setFormData(prev => ({...prev, semester: e.target.value}))}
                >
                  <option value="Fall 2024">Fall 2024</option>
                  <option value="Spring 2024">Spring 2024</option>
                  <option value="Summer 2024">Summer 2024</option>
                  <option value="Winter 2024">Winter 2024</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Color
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {COURSE_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({...prev, color}))}
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        formData.color === color 
                          ? "border-gray-900 scale-110 shadow-md" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Modal.Content>
<Modal.Footer className="flex items-center justify-end gap-3 p-6 bg-white border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 min-w-[140px] bg-primary-600 hover:bg-primary-700"
            >
              {isSubmitting ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  {editingCourse ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  <ApperIcon name={editingCourse ? "Save" : "Plus"} size={16} />
                  {editingCourse ? "Update Course" : "Add Course"}
                </>
              )}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default Courses;