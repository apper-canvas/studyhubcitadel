import coursesData from "@/services/mockData/courses.json";

class CoursesService {
  constructor() {
    this.courses = [...coursesData];
  }

  async getAll() {
    await this.delay();
    return [...this.courses];
  }

  async getById(id) {
    await this.delay();
    const course = this.courses.find(c => c.Id === id);
    if (!course) {
      throw new Error("Course not found");
    }
    return { ...course };
  }

  async create(courseData) {
    await this.delay();
    const newCourse = {
      ...courseData,
      Id: Math.max(...this.courses.map(c => c.Id)) + 1
    };
    this.courses.push(newCourse);
    return { ...newCourse };
  }

  async update(id, courseData) {
    await this.delay();
    const index = this.courses.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Course not found");
    }
    this.courses[index] = { ...this.courses[index], ...courseData };
    return { ...this.courses[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.courses.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Course not found");
    }
    this.courses.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export default new CoursesService();