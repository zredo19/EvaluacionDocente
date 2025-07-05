// src/app/models/teacher.model.ts
export interface Teacher {
  id?: number;
  name: string;
  email: string;
  department: string;
  overall_rating?: number; // Promedio general de calificación del profesor
}