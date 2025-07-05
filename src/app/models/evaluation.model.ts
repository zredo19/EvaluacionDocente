// src/app/models/evaluation.model.ts
export interface Evaluation {
  id?: number;
  student: number;
  course: number;
  rating: number;
  comment: string;
  date?: string;
  semester?: string;
  year?: number;
  course_name?: string; // ✅ AÑADIR ESTA LÍNEA
}