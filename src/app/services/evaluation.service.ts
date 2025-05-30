import { Injectable } from '@angular/core';
import { Evaluation } from '../models/evaluation.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  constructor() { }

  validateEvaluation(rating: number, comment: string): { valid: boolean; message?: string } {
    if (rating < 1 || rating > 7) {
      return { valid: false, message: 'La calificación debe estar entre 1 y 7' };
    }
    if (!comment || comment.trim().length === 0) {
      return { valid: false, message: 'El comentario es obligatorio' };
    }
    return { valid: true };
  }

  calculateCourseAverage(courseId: string, evaluations: Evaluation[]): number {
    const courseEvaluations = evaluations.filter(e => e.courseId === courseId);
    if (courseEvaluations.length === 0) return 0;
    return courseEvaluations.reduce((sum, e) => sum + e.rating, 0) / courseEvaluations.length;
  }
}
