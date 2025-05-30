import { Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { Teacher } from '../models/teacher.model';
import { Student } from '../models/student.model';
import { Evaluation } from '../models/evaluation.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private students: Student[] = [
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      career: 'Ingeniería Informática',
      currentSemester: 5
    }
  ];

  private courses: Course[] = [
    {
      id: '1',
      code: 'INF-101',
      name: 'Programación I',
      teacher: '1',
      career: 'Ingeniería Informática',
      semester: 1,
      credits: 4
    },
    {
      id: '2',
      code: 'INF-201',
      name: 'Estructuras de Datos',
      teacher: '2',
      career: 'Ingeniería Informática',
      semester: 3,
      credits: 5
    }
  ];

  private teachers: Teacher[] = [
    {
      id: '1',
      name: 'María García',
      email: 'maria@example.com',
      department: 'Informática',
      overallRating: 0
    },
    {
      id: '2',
      name: 'Carlos López',
      email: 'carlos@example.com',
      department: 'Informática',
      overallRating: 0
    }
  ];

  private evaluations: Evaluation[] = [];

  constructor() { }

  getStudentCourses(studentId: string): Course[] {
  const student = this.students.find(s => s.id === studentId);
  const currentSemester = student?.currentSemester ?? 1; // Nullish coalescing
  return this.courses.filter(c => c.semester <= currentSemester);
}

  getTeachers(): Teacher[] {
    return this.teachers;
  }

  getCourses(): Course[] {
    return this.courses;
  }

  getEvaluations(): Evaluation[] {
    return this.evaluations;
  }

  addEvaluation(evaluation: Evaluation): void {
    this.evaluations.push(evaluation);
    this.updateTeacherRating(evaluation);
  }

  private updateTeacherRating(evaluation: Evaluation): void {
    const course = this.courses.find(c => c.id === evaluation.courseId);
    if (!course) return;

    const teacher = this.teachers.find(t => t.id === course.teacher);
    if (!teacher) return;

    const teacherCourses = this.courses.filter(c => c.teacher === teacher.id).map(c => c.id);
    const teacherEvaluations = this.evaluations.filter(e => teacherCourses.includes(e.courseId));

    if (teacherEvaluations.length > 0) {
      teacher.overallRating = teacherEvaluations.reduce(
        (sum, e) => sum + e.rating,
        0
      ) / teacherEvaluations.length;
    }
  }


  getHistoricalEvaluations(studentId: string): Evaluation[] {
    return this.evaluations.filter(e => e.studentId === studentId);
  }

  searchCourses(query: string): Course[] {
    if (!query) return this.courses;
    query = query.toLowerCase();
    return this.courses.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.code.toLowerCase().includes(query) ||
      this.teachers.find(t => t.id === c.teacher)?.name.toLowerCase().includes(query)
    );
  }

  filterCourses(filters: { career?: string; semester?: number; minRating?: number }): Course[] {
    return this.courses.filter(c => {
      let match = true;
      if (filters.career) match = match && c.career === filters.career;
      if (filters.semester) match = match && c.semester === filters.semester;
      if (filters.minRating) {
        const courseEvals = this.evaluations.filter(e => e.courseId === c.id);
        const avgRating = courseEvals.length > 0 ?
          courseEvals.reduce((sum, e) => sum + e.rating, 0) / courseEvals.length : 0;
        match = match && avgRating >= filters.minRating;
      }
      return match;
    });
  }
}
