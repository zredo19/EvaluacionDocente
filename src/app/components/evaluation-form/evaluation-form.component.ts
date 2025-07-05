// src/app/components/evaluation-form/evaluation-form.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { EvaluationService } from '../../services/evaluation.service';
import { Course } from '../../models/course.model';
import { Evaluation } from '../../models/evaluation.model';

@Component({
  selector: 'app-evaluation-form',
  templateUrl: './evaluation-form.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EvaluationFormComponent implements OnInit {
  course: Course | null = null;
  rating: number | null = null;
  comment: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  
  // ✅ CORRECCIÓN: Ya no necesitamos las propiedades para el semestre/año actual
  // currentYear: number = new Date().getFullYear();
  // currentSemester: string = '';

  loggedInStudentId: number | null = null;

  constructor(
    private apiService: ApiService,
    private evaluationService: EvaluationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const studentId = this.apiService.getLoggedInStudentId();
    if (!studentId) {
      this.router.navigate(['/login']);
      return;
    }
    this.loggedInStudentId = studentId;

    // ✅ CORRECCIÓN: Eliminamos el cálculo del semestre basado en la fecha actual
    // const month = new Date().getMonth();
    // this.currentSemester = month < 6 ? '1' : '2';

    const courseIdParam = this.route.snapshot.paramMap.get('id');
    if (courseIdParam) {
      const courseId = +courseIdParam;
      this.apiService.getCourse(courseId).subscribe(
        (courseData: Course) => {
          this.course = courseData;
        },
        (error: any) => {
          console.error('Error al cargar el curso:', error);
          this.errorMessage = 'No se pudo cargar la información del curso.';
        }
      );
    }
  }

  submitEvaluation(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const validationResult = this.evaluationService.validateEvaluation(this.rating, this.comment);
    if (!validationResult.valid) {
      this.errorMessage = validationResult.message || 'Datos de evaluación inválidos.';
      return;
    }

    if (this.course && this.loggedInStudentId && this.rating) {
      // ✅ CORRECCIÓN: Usamos el semestre y año del curso, no la fecha actual.
      const newEvaluation: Partial<Evaluation> = {
        student: this.loggedInStudentId,
        course: this.course.id!,
        rating: this.rating,
        comment: this.comment,
        semester: this.course.semester, // Usar el semestre del curso
        year: this.course.year         // Usar el año del curso
      };

      this.apiService.addEvaluation(newEvaluation).subscribe(
        () => {
          this.successMessage = '¡Evaluación enviada con éxito! Serás redirigido en 3 segundos.';
          setTimeout(() => {
            this.router.navigate(['/courses']);
          }, 3000);
        },
        (error: any) => {
          console.error('Error al enviar la evaluación:', error);
          if (error.status === 409) {
             this.errorMessage = 'Ya has evaluado este curso en este período.';
          } else {
             this.errorMessage = 'Ocurrió un error al enviar la evaluación. Por favor, inténtalo de nuevo.';
          }
        }
      );
    }
  }
}