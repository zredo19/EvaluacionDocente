// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { CourseListComponent } from './components/course-list/course-list.component';
import { EvaluationFormComponent } from './components/evaluation-form/evaluation-form.component';
import { TeacherListComponent } from './components/teacher-list/teacher-list.component';
import { HistoricalEvaluationsComponent } from './components/historical-evaluations/historical-evaluations.component';
import { ChartsComponent } from './components/charts/charts.component';
import { TestComponent } from './test.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth.guard'; // <--- ¡Importa tu guard!

export const routes: Routes = [
  { path: '', redirectTo: '/courses', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'courses', component: CourseListComponent, canActivate: [AuthGuard] }, // <--- Ruta protegida
  { path: 'evaluate/:id', component: EvaluationFormComponent, canActivate: [AuthGuard] }, // <--- Ruta protegida
  { path: 'teachers', component: TeacherListComponent, canActivate: [AuthGuard] }, // <--- Ruta protegida
  { path: 'historical', component: HistoricalEvaluationsComponent, canActivate: [AuthGuard] }, // <--- Ruta protegida
  { path: 'charts', component: ChartsComponent, canActivate: [AuthGuard] }, // <--- Ruta protegida
  { path: 'test', component: TestComponent, canActivate: [AuthGuard] } // <--- Ruta protegida
  // ... otras rutas
];