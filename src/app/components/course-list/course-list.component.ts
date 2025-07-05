// src/app/components/course-list/course-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  allEnrolledCourses: Course[] = [];
  filteredCourses: Course[] = [];
  unevaluatedCount = 0;
  
  searchQuery = '';
  searchType: 'name' | 'teacher' | 'code' = 'name';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.apiService.getLoggedInStudentId()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadCourseData();
  }

  loadCourseData(): void {
    // Usamos forkJoin para obtener ambas listas de forma paralela y más eficiente
    forkJoin({
      enrolled: this.apiService.getMyEnrolledCourses(),
      unevaluated: this.apiService.getMyUnevaluatedCourses()
    }).subscribe({
      next: ({ enrolled, unevaluated }) => {
        const unevaluatedIds = new Set(unevaluated.map(c => c.id));
        this.unevaluatedCount = unevaluated.length;

        this.allEnrolledCourses = enrolled.map(course => ({
          ...course,
          isEvaluated: !unevaluatedIds.has(course.id)
        }));
        
        this.applyFilter(); // Aplicar filtro inicial (mostrar todos)
      },
      error: (err) => {
        console.error('Error al cargar los cursos del estudiante:', err);
      }
    });
  }

  applyFilter(): void {
    if (!this.searchQuery) {
      this.filteredCourses = this.allEnrolledCourses;
      return;
    }
    
    const query = this.searchQuery.toLowerCase();
    this.filteredCourses = this.allEnrolledCourses.filter(course => {
      if (this.searchType === 'name') {
        return course.name.toLowerCase().includes(query);
      }
      if (this.searchType === 'code') {
        return course.code.toLowerCase().includes(query);
      }
      if (this.searchType === 'teacher' && course.teacher_name) {
        return course.teacher_name.toLowerCase().includes(query);
      }
      return false;
    });
  }

  evaluateCourse(courseId: number | undefined): void {
    if (courseId) {
      this.router.navigate(['/evaluate', courseId]);
    }
  }
}