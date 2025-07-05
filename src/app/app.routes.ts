// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { CourseListComponent } from './components/course-list/course-list.component'; //
import { EvaluationFormComponent } from './components/evaluation-form/evaluation-form.component'; //
import { TeacherListComponent } from './components/teacher-list/teacher-list.component'; //
import { HistoricalEvaluationsComponent } from './components/historical-evaluations/historical-evaluations.component'; //
import { ChartsComponent } from './components/charts/charts.component'; //
import { TestComponent } from './test.component'; //
import { LoginComponent } from './components/login/login.component'; // ¡NUEVO!
// Importa otros componentes necesarios para rutas

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirigir a login al inicio
  { path: 'login', component: LoginComponent }, // Ruta para el login
  { path: 'courses', component: CourseListComponent }, //
  { path: 'evaluate/:id', component: EvaluationFormComponent }, //
  { path: 'teachers', component: TeacherListComponent }, //
  { path: 'historical', component: HistoricalEvaluationsComponent }, //
  { path: 'charts', component: ChartsComponent }, //
  { path: 'test', component: TestComponent } //
  // ... otras rutas
];