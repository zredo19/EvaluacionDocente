import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Course } from '../../models/course.model';
import { EvaluationService } from '../../services/evaluation.service';
import { Evaluation } from '../../models/evaluation.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css'],
  imports: [CommonModule, FormsModule]
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  unevaluatedCourses: Course[] = [];
  searchQuery = '';
  filters = {
    career: '',
    semester: undefined as number | undefined,
    minRating: undefined as number | undefined
  };
  careers: string[] = ['Ingeniería Informática', 'Administración', 'Derecho'];
  semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor(
    private dataService: DataService,
    private evaluationService: EvaluationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    // Simulamos que el estudiante actual tiene ID '1'
    this.courses = this.dataService.getStudentCourses('1');
    this.checkUnevaluatedCourses();
  }

  getTeacherName(teacherId: string): string {
    const teacher = this.dataService.getTeachers().find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Docente no encontrado';
  }

  checkUnevaluatedCourses(): void {
    const evaluations = this.dataService.getEvaluations();
    this.unevaluatedCourses = this.courses.filter(course =>
      !evaluations.some(e => e.courseId === course.id && e.studentId === '1')
    );
  }

  search(): void {
    if (this.searchQuery) {
      this.courses = this.dataService.searchCourses(this.searchQuery);
    } else {
      this.loadCourses();
    }
  }

  applyFilters(): void {
    this.courses = this.dataService.filterCourses({
      career: this.filters.career || undefined,
      semester: this.filters.semester,
      minRating: this.filters.minRating
    });
  }

  resetFilters(): void {
    this.filters = {
      career: '',
      semester: undefined,
      minRating: undefined
    };
    this.loadCourses();
  }

  getCourseAverage(courseId: string): number {
    const evaluations = this.dataService.getEvaluations();
    return this.evaluationService.calculateCourseAverage(courseId, evaluations);
  }

  navigateToEvaluation(courseId: string): void {
    this.router.navigate(['/evaluate', courseId]);
  }
}
