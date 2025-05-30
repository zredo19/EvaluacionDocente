import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Evaluation } from '../../models/evaluation.model';
import { Course } from '../../models/course.model';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
  imports: [FormsModule]
})
export class ChartsComponent implements OnInit {
  careerChart: any;
  semesterChart: any;
  selectedCareer = '';
  selectedSemester: number | null = null;
  careers: string[] = ['Ingeniería Informática', 'Administración', 'Derecho'];
  semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor(private dataService: DataService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.createCareerChart();
    this.createSemesterChart();
  }

  createCareerChart(): void {
    const evaluations = this.dataService.getEvaluations();
    const courses = this.dataService.getCourses();

    const careerData = this.careers.map(career => {
      const careerCourses = courses.filter(c => c.career === career);
      const careerEvaluations = evaluations.filter(e =>
        careerCourses.some(c => c.id === e.courseId)
      );

      if (careerEvaluations.length === 0) return 0;
      return careerEvaluations.reduce((sum, e) => sum + e.rating, 0) / careerEvaluations.length;
    });

    const ctx = document.getElementById('careerChart') as HTMLCanvasElement;

    if (this.careerChart) {
      this.careerChart.destroy();
    }

    this.careerChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.careers,
        datasets: [{
          label: 'Evaluación Promedio por Carrera',
          data: careerData,
          backgroundColor: [
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(75, 192, 192, 0.5)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 7
          }
        }
      }
    });
  }

  createSemesterChart(): void {
    const evaluations = this.dataService.getEvaluations();
    const courses = this.dataService.getCourses();

    const semesterData = this.semesters.map(sem => {
      const semCourses = courses.filter(c => c.semester === sem);
      const semEvaluations = evaluations.filter(e =>
        semCourses.some(c => c.id === e.courseId)
      );

      if (semEvaluations.length === 0) return 0;
      return semEvaluations.reduce((sum, e) => sum + e.rating, 0) / semEvaluations.length;
    });

    const ctx = document.getElementById('semesterChart') as HTMLCanvasElement;

    if (this.semesterChart) {
      this.semesterChart.destroy();
    }

    this.semesterChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.semesters.map(s => `Semestre ${s}`),
        datasets: [{
          label: 'Evaluación Promedio por Semestre',
          data: semesterData,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 2,
          tension: 0.1,
          fill: true
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 7
          }
        }
      }
    });
  }

  filterCharts(): void {
    // Implementar filtrado si es necesario
    this.createCareerChart();
    this.createSemesterChart();
  }
}
