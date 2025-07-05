// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';

import { Student } from '../models/student.model';
import { Teacher } from '../models/teacher.model';
import { Course } from '../models/course.model';
import { Evaluation } from '../models/evaluation.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000/api/';

  private authToken: string | null = null;
  private currentStudentId: number | null = null;

  constructor(private http: HttpClient) {
    this.authToken = localStorage.getItem('auth_token');
    const storedStudentId = localStorage.getItem('current_student_id');
    if (storedStudentId) {
      this.currentStudentId = parseInt(storedStudentId, 10);
    }
  }

  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (this.authToken) {
      headers = headers.set('Authorization', `Token ${this.authToken}`);
    }
    return headers;
  }

  setAuthToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('auth_token', token);
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  setLoggedInStudentId(studentId: number): void {
    this.currentStudentId = studentId;
    localStorage.setItem('current_student_id', studentId.toString());
  }

  getLoggedInStudentId(): number | null {
    return this.currentStudentId;
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    const loginData = { username: credentials.email, password: credentials.password };
    return this.http.post(`${this.baseUrl}auth/token/login/`, loginData).pipe(
      tap((response: any) => {
        this.setAuthToken(response.auth_token);
      }),
      switchMap(() => this.getMyStudentProfile()),
      tap((studentProfile: Student) => {
        if (studentProfile && studentProfile.user) {
          this.setLoggedInStudentId(studentProfile.user);
        } else {
          this.logout().subscribe();
          throwError(() => new Error('Student profile not found.'));
        }
      }),
      catchError(error => {
        this.logout().subscribe();
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}auth/token/logout/`, {}, { headers }).pipe(
      tap(() => {
        this.authToken = null;
        localStorage.removeItem('auth_token');
        this.currentStudentId = null;
        localStorage.removeItem('current_student_id');
      }),
      catchError(error => {
        console.error('Error during backend logout:', error);
        this.authToken = null;
        localStorage.removeItem('auth_token');
        this.currentStudentId = null;
        localStorage.removeItem('current_student_id');
        return of(null);
      })
    );
  }

  getMyStudentProfile(): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}students/me/`, { headers: this.getAuthHeaders() });
  }

  getMyEnrolledCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}students/enrolled_courses/`, { headers: this.getAuthHeaders() });
  }
  
  getMyUnevaluatedCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}students/unevaluated_courses/`, { headers: this.getAuthHeaders() });
  }

  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.baseUrl}teachers/general_evaluations/`, { headers: this.getAuthHeaders() });
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}courses/`, { headers: this.getAuthHeaders() });
  }

  getCourse(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}courses/${id}/`, { headers: this.getAuthHeaders() });
  }
  
  getEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.baseUrl}evaluations/`, { headers: this.getAuthHeaders() });
  }

  addEvaluation(evaluation: Partial<Evaluation>): Observable<Evaluation> {
    return this.http.post<Evaluation>(`${this.baseUrl}evaluations/`, evaluation, { headers: this.getAuthHeaders() });
  }

  getReportByCareerSemester(career?: string | null, semester?: string | null, year?: number | null): Observable<{ [key: string]: number }> {
    let params = new HttpParams();
    if (career) params = params.set('career', career);
    if (semester) params = params.set('semester', semester);
    if (year) params = params.set('year', year.toString());
    
    return this.http.get<{ [key: string]: number }>(`${this.baseUrl}evaluations/report_by_career_semester/`, { params, headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching report:', error);
        return of({});
      })
    );
  }

  getHistoricalEvaluations(year?: number | null, semester?: string | null): Observable<Evaluation[]> {
    let params = new HttpParams();
    if (year) params = params.set('year', year.toString());
    if (semester) params = params.set('semester', semester);

    return this.http.get<Evaluation[]>(`${this.baseUrl}evaluations/historical_evaluations/`, { params, headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching historical evaluations:', error);
        return of([]);
      })
    );
  }
}