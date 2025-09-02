import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/atoms/Modal";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const QuickAddModal = ({ isOpen, onClose, courses, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    dueDate: "",
    priority: "medium",
    description: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const assignment = {
        ...formData,
        status: "todo",
        dueDate: new Date(formData.dueDate).toISOString()
      };

      await onSubmit(assignment);
      
      // Reset form
      setFormData({
        title: "",
        courseId: "",
        dueDate: "",
        priority: "medium",
        description: ""
      });

      onClose();
      toast.success("Assignment added successfully!");
    } catch (error) {
      toast.error("Failed to add assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset form after modal closes
      setTimeout(() => {
        setFormData({
          title: "",
          courseId: "",
          dueDate: "",
          priority: "medium",
          description: ""
        });
      }, 200);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <Modal.Header onClose={handleClose}>
        <Modal.Title>Quick Add Assignment</Modal.Title>
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
            onClick={handleClose}
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
                Add Assignment
              </>
            )}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default QuickAddModal;