import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { EvaluationService } from '../../services/evaluation.service';
import { Course } from '../../models/course.model';
import { Evaluation } from '../../models/evaluation.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-evaluation-form',
  templateUrl: './evaluation-form.component.html',
  styleUrls: ['./evaluation-form.component.css'],
  imports: [FormsModule, CommonModule]
})
export class EvaluationFormComponent implements OnInit {
  course: Course | undefined;
  rating: number = 5;
  comment: string = '';
  errorMessage: string = '';
  currentDate = new Date();

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private dataService: DataService,
    private evaluationService: EvaluationService
  ) { }

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.course = this.dataService.getCourses().find(c => c.id === courseId);
      if (!this.course) {
        this.router.navigate(['/courses']);
      }
    }
  }

  submitEvaluation(): void {
    if (!this.course) return;

    const validation = this.evaluationService.validateEvaluation(this.rating, this.comment);
    if (!validation.valid) {
      this.errorMessage = validation.message || '';
      return;
    }

    const newEvaluation: Evaluation = {
      id: Date.now().toString(),
      courseId: this.course.id,
      studentId: '1', // Simulamos que el estudiante actual tiene ID '1'
      rating: this.rating,
      comment: this.comment,
      date: new Date(),
      semester: this.course.semester,
      year: this.currentDate.getFullYear()
    };

    this.dataService.addEvaluation(newEvaluation);
    this.router.navigate(['/courses']);
  }
}
