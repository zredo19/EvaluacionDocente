// src/app/models/course.model.ts
export interface Course {
  id?: number;
  name: string;
  code: string;
  teacher: number;
  teacher_name?: string;
  career: string;
  semester: string;
  year: number;
  average_rating?: number;
  isEvaluated?: boolean;
}