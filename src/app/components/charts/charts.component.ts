// src/app/components/charts/charts.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables, ChartConfiguration, ChartType } from 'chart.js';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit, OnDestroy {
  // Propiedades para los filtros
  selectedCareer: string | null = null;
  selectedSemester: string | null = null;
  selectedYear: number | null = null;

  // Listas para poblar los dropdowns de los filtros
  careers: string[] = [];
  semesters: string[] = [];
  years: number[] = [];
  
  private careerChart: Chart | undefined;
  private semesterChart: Chart | undefined;
  isLoading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadFilterOptions();
    this.loadReportData();
  }

  ngOnDestroy(): void {
    this.careerChart?.destroy();
    this.semesterChart?.destroy();
  }

  loadFilterOptions(): void {
    // Usamos forkJoin para obtener todos los datos necesarios para los filtros
    forkJoin({
      courses: this.apiService.getCourses(),
      evaluations: this.apiService.getEvaluations()
    }).subscribe(({ courses, evaluations }) => {
      // La lista de carreras se sigue obteniendo de los cursos
      this.careers = [...new Set(courses.map(c => c.career))].sort();
      
      // ✅ CORRECCIÓN: Obtenemos los años y semestres desde las evaluaciones existentes
      // para asegurar que los filtros coincidan con los datos a filtrar.
      const uniqueYears = new Set<number>();
      const uniqueSemesters = new Set<string>();

      evaluations.forEach(e => {
        if (e.year) uniqueYears.add(e.year);
        if (e.semester) uniqueSemesters.add(e.semester);
      });

      this.years = Array.from(uniqueYears).sort((a, b) => b - a);
      this.semesters = Array.from(uniqueSemesters).sort();
    });
  }

  loadReportData(): void {
    this.isLoading = true;
    this.apiService.getReportByCareerSemester(
      this.selectedCareer,
      this.selectedSemester,
      this.selectedYear
    ).subscribe(reportData => {
      this.createOrUpdateCharts(reportData);
      this.isLoading = false;
    });
  }

  createOrUpdateCharts(reportData: { [key: string]: number }): void {
    this.careerChart?.destroy();
    this.semesterChart?.destroy();

    const careerData: { [name: string]: { total: number, count: number } } = {};
    const semesterData: { [name: string]: { total: number, count: number } } = {};

    for (const key in reportData) {
      const [career, semester] = key.split(' - ');
      const rating = reportData[key];

      if (!careerData[career]) careerData[career] = { total: 0, count: 0 };
      careerData[career].total += rating;
      careerData[career].count++;

      if (!semesterData[semester]) semesterData[semester] = { total: 0, count: 0 };
      semesterData[semester].total += rating;
      semesterData[semester].count++;
    }

    const careerLabels = Object.keys(careerData);
    const careerAverages = careerLabels.map(label => careerData[label].total / careerData[label].count);

    const semesterLabels = Object.keys(semesterData);
    const semesterAverages = semesterLabels.map(label => semesterData[label].total / semesterData[label].count);

    this.careerChart = this.createChart('careerChartCanvas', 'bar', 'Promedio por Carrera', careerLabels, careerAverages, 'rgba(75, 192, 192, 0.6)');
    this.semesterChart = this.createChart('semesterChartCanvas', 'bar', 'Promedio por Semestre', semesterLabels, semesterAverages, 'rgba(153, 102, 255, 0.6)');
  }

  private createChart(canvasId: string, type: ChartType, label: string, labels: string[], data: number[], color: string): Chart {
    const chartConfig: ChartConfiguration = {
      type: type,
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          backgroundColor: color,
          borderColor: color.replace('0.6', '1'),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 7,
            ticks: { stepSize: 1 }
          }
        }
      }
    };
    return new Chart(canvasId, chartConfig);
  }
}