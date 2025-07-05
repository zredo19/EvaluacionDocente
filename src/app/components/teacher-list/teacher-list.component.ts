// src/app/components/teacher-list/teacher-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Teacher } from '../../models/teacher.model';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.css']
})
export class TeacherListComponent implements OnInit {
  teachers: Teacher[] = [];
  isLoading = true;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.isLoading = true;
    this.apiService.getTeachers().subscribe({
      next: (data) => {
        // Ordena los profesores por calificación de mayor a menor
        this.teachers = data.sort((a, b) => (b.overall_rating ?? 0) - (a.overall_rating ?? 0));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar los profesores:', err);
        this.isLoading = false;
      }
    });
  }

  getRatingColor(rating: number | undefined): string {
    const r = rating ?? 0;
    if (r >= 6) return 'bg-success';
    if (r >= 5) return 'bg-primary';
    if (r >= 4) return 'bg-warning text-dark';
    return 'bg-danger';
  }
}