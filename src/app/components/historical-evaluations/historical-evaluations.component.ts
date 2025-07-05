import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Evaluation } from '../../models/evaluation.model';

@Component({
  selector: 'app-historical-evaluations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historical-evaluations.component.html',
  styleUrls: ['./historical-evaluations.component.css']
})
export class HistoricalEvaluationsComponent implements OnInit {
  allEvaluations: Evaluation[] = [];
  filteredEvaluations: Evaluation[] = [];
  
  years: number[] = [];
  semesters: string[] = [];
  
  selectedYear: number | null = null;
  selectedSemester: string | null = null;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    if (!this.apiService.getLoggedInStudentId()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.apiService.getHistoricalEvaluations().subscribe({
      next: (evals) => {
        this.allEvaluations = evals;
        this.filteredEvaluations = evals;
        this.extractFilterOptions();
      },
      error: (err) => console.error('Error al cargar datos históricos:', err)
    });
  }

  extractFilterOptions(): void {
    const uniqueYears = new Set<number>();
    const uniqueSemesters = new Set<string>();

    this.allEvaluations.forEach((e) => {
      if (e.year) uniqueYears.add(e.year);
      if (e.semester) uniqueSemesters.add(e.semester);
    });
    
    this.years = Array.from(uniqueYears).sort((a, b) => b - a);
    this.semesters = Array.from(uniqueSemesters).sort();
  }

  applyFilters(): void {
    let evals = [...this.allEvaluations];

    if (this.selectedYear) {
      // ✅ CORRECCIÓN: Usamos '==' en lugar de '===' para comparar correctamente
      // el número del año con el texto que viene del filtro.
      evals = evals.filter(e => e.year == this.selectedYear);
    }
    if (this.selectedSemester) {
      evals = evals.filter(e => e.semester === this.selectedSemester);
    }

    this.filteredEvaluations = evals;
  }

  resetFilters(): void {
    this.selectedYear = null;
    this.selectedSemester = null;
    this.filteredEvaluations = [...this.allEvaluations];
  }
}