import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import AssignmentRow from "@/components/molecules/AssignmentRow";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import assignmentsService from "@/services/api/assignmentsService";
import coursesService from "@/services/api/coursesService";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    dueDate: "",
    priority: "medium",
    status: "todo",
    description: ""
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentsService.getAll(),
        coursesService.getAll()
      ]);
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      setError("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    if (statusFilter !== "all" && assignment.status !== statusFilter) return false;
    if (courseFilter !== "all" && assignment.courseId !== courseFilter) return false;
    if (priorityFilter !== "all" && assignment.priority !== priorityFilter) return false;
    return true;
  });

  const resetForm = () => {
    setFormData({
      title: "",
      courseId: "",
      dueDate: "",
      priority: "medium",
      status: "todo",
      description: ""
    });
    setEditingAssignment(null);
  };

  const handleOpenModal = (assignment = null) => {
    if (assignment) {
      const dueDate = new Date(assignment.dueDate);
      const dateString = dueDate.toISOString().split("T")[0];
      
      setFormData({
        title: assignment.title,
        courseId: assignment.courseId,
        dueDate: dateString,
        priority: assignment.priority,
        status: assignment.status,
        description: assignment.description || ""
      });
      setEditingAssignment(assignment);
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
    
    if (!formData.title.trim()) {
      toast.error("Assignment title is required");
      return;
    }

    if (!formData.courseId) {
      toast.error("Please select a course");
      return;
    }

    if (!formData.dueDate) {
      toast.error("Due date is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const assignmentData = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString()
      };

      if (editingAssignment) {
        const updatedAssignment = await assignmentsService.update(editingAssignment.Id, assignmentData);
        setAssignments(prev => prev.map(a => a.Id === editingAssignment.Id ? updatedAssignment : a));
        toast.success("Assignment updated successfully!");
      } else {
        const newAssignment = await assignmentsService.create(assignmentData);
        setAssignments(prev => [...prev, newAssignment]);
        toast.success("Assignment added successfully!");
      }
      handleCloseModal();
    } catch (error) {
      toast.error(editingAssignment ? "Failed to update assignment" : "Failed to add assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async (assignment) => {
    const newStatus = assignment.status === "completed" ? "todo" : "completed";
    try {
      const updatedAssignment = await assignmentsService.update(assignment.Id, { 
        ...assignment,
        status: newStatus 
      });
      setAssignments(prev => prev.map(a => a.Id === assignment.Id ? updatedAssignment : a));
      toast.success(`Assignment marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update assignment status");
    }
  };

  const handleDelete = async (assignment) => {
    if (window.confirm(`Are you sure you want to delete "${assignment.title}"?`)) {
      try {
        await assignmentsService.delete(assignment.Id);
        setAssignments(prev => prev.filter(a => a.Id !== assignment.Id));
        toast.success("Assignment deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete assignment");
      }
    }
  };

  if (loading) {
    return <Loading type="table" />;
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
            Assignments
          </h1>
          <p className="text-gray-600">
            {assignments.length} assignment{assignments.length !== 1 ? "s" : ""} total, {" "}
            {assignments.filter(a => a.status !== "completed").length} pending
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={18} />
          Add Assignment
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-4 p-4 bg-white rounded-xl border shadow-sm"
      >
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-40"
        >
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>

        <Select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="w-48"
        >
          <option value="all">All Courses</option>
          {courses.map(course => (
            <option key={course.Id} value={course.Id}>
              {course.name}
            </option>
          ))}
        </Select>

        <Select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="w-40"
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-600">
            Showing {filteredAssignments.length} of {assignments.length}
          </span>
        </div>
      </motion.div>

      {/* Assignments Table */}
      {filteredAssignments.length === 0 ? (
        <Empty
          title={assignments.length === 0 ? "No assignments yet" : "No assignments match your filters"}
          description={assignments.length === 0 
            ? "Add your first assignment to start tracking your coursework" 
            : "Try adjusting your filters to see more assignments"
          }
          actionLabel="Add Assignment"
          onAction={() => handleOpenModal()}
          icon="FileText"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Assignment</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Course</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Due Date</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Priority</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((assignment, index) => {
                  const course = courses.find(c => c.Id === assignment.courseId);
                  return (
                    <AssignmentRow
                      key={assignment.Id}
                      assignment={assignment}
                      course={course}
                      onEdit={handleOpenModal}
                      onDelete={handleDelete}
                      onToggleComplete={handleToggleComplete}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Add/Edit Assignment Modal */}
      <Modal isOpen={showModal} onClose={handleCloseModal} size="md">
        <Modal.Header onClose={handleCloseModal}>
          <Modal.Title>
            {editingAssignment ? "Edit Assignment" : "Add New Assignment"}
          </Modal.Title>
        </Modal.Header>

        <form onSubmit={handleSubmit}>
          <Modal.Content>
            <div className="space-y-4">
              <Input
                label="Assignment Title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                placeholder="e.g., Essay on Shakespeare"
                required
              />

              <Select
                label="Course"
                value={formData.courseId}
                onChange={(e) => setFormData(prev => ({...prev, courseId: e.target.value}))}
                required
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.Id} value={course.Id}>
                    {course.name}
                  </option>
                ))}
              </Select>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Due Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({...prev, dueDate: e.target.value}))}
                  required
                />

                <Select
                  label="Priority"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({...prev, priority: e.target.value}))}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </div>

              {editingAssignment && (
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Select>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  placeholder="Additional details about the assignment..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none shadow-sm transition-all duration-200 resize-none"
                />
              </div>
            </div>
          </Modal.Content>

          <Modal.Footer>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
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
                  {editingAssignment ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  <ApperIcon name={editingAssignment ? "Save" : "Plus"} size={16} />
                  {editingAssignment ? "Update Assignment" : "Add Assignment"}
                </>
              )}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default Assignments;