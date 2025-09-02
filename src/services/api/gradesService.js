import gradesData from "@/services/mockData/grades.json";

class GradesService {
  constructor() {
    this.grades = [...gradesData];
  }

  async getAll() {
    await this.delay();
    return [...this.grades];
  }

  async getById(id) {
    await this.delay();
    const grade = this.grades.find(g => g.Id === id);
    if (!grade) {
      throw new Error("Grade not found");
    }
    return { ...grade };
  }

  async getByCourse(courseId) {
    await this.delay();
    return this.grades.filter(g => g.courseId === courseId).map(g => ({ ...g }));
  }

  async create(gradeData) {
    await this.delay();
    const newGrade = {
      ...gradeData,
      Id: Math.max(...this.grades.map(g => g.Id)) + 1
    };
    this.grades.push(newGrade);
    return { ...newGrade };
  }

  async update(id, gradeData) {
    await this.delay();
    const index = this.grades.findIndex(g => g.Id === id);
    if (index === -1) {
      throw new Error("Grade not found");
    }
    this.grades[index] = { ...this.grades[index], ...gradeData };
    return { ...this.grades[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.grades.findIndex(g => g.Id === id);
    if (index === -1) {
      throw new Error("Grade not found");
    }
    this.grades.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export default new GradesService();