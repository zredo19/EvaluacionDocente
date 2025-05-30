import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Evaluation } from '../../models/evaluation.model';
import { Course } from '../../models/course.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historical-evaluations',
  templateUrl: './historical-evaluations.component.html',
  styleUrls: ['./historical-evaluations.component.css'],
  imports: [FormsModule, CommonModule]
})
export class HistoricalEvaluationsComponent implements OnInit {
  evaluations: Evaluation[] = [];
  years: number[] = [];
  selectedYear: number | null = null;
  selectedSemester: number | null = null;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadEvaluations();
    this.extractYears();
  }

  loadEvaluations(): void {
    // Simulamos que el estudiante actual tiene ID '1'
    this.evaluations = this.dataService.getHistoricalEvaluations('1');
  }

  extractYears(): void {
    const uniqueYears = new Set<number>();
    this.evaluations.forEach(e => uniqueYears.add(e.year));
    this.years = Array.from(uniqueYears).sort((a, b) => b - a);
  }

  filterEvaluations(): void {
    let filtered = this.dataService.getHistoricalEvaluations('1');

    if (this.selectedYear) {
      filtered = filtered.filter(e => e.year === this.selectedYear);
    }

    if (this.selectedSemester) {
      filtered = filtered.filter(e => e.semester === this.selectedSemester);
    }

    this.evaluations = filtered;
  }

  resetFilters(): void {
    this.selectedYear = null;
    this.selectedSemester = null;
    this.loadEvaluations();
  }

  getCourseName(courseId: string): string {
    const course = this.dataService.getCourses().find(c => c.id === courseId);
    return course ? course.name : 'Curso desconocido';
  }
}
