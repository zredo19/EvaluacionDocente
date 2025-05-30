import { Routes } from '@angular/router';
import { CourseListComponent } from './components/course-list/course-list.component';
import { EvaluationFormComponent } from './components/evaluation-form/evaluation-form.component';
import { TeacherListComponent } from './components/teacher-list/teacher-list.component';
import { HistoricalEvaluationsComponent } from './components/historical-evaluations/historical-evaluations.component';
import { ChartsComponent } from './components/charts/charts.component';

export const routes: Routes = [
  { path: '', component: CourseListComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'evaluate/:id', component: EvaluationFormComponent },
  { path: 'teachers', component: TeacherListComponent },
  { path: 'historical', component: HistoricalEvaluationsComponent },
  { path: 'charts', component: ChartsComponent },
];
