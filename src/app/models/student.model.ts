// src/app/models/student.model.ts
export interface Student {
  user?: number; // <-- CAMBIO: Ahora la PK es el ID del User de Django (number)
  name: string;
  career: string;
  // No hay email aquí, ya que está en el modelo User de Django
}