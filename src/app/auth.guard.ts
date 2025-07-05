// src/app/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs'; // Asegura 'of' esté importado
import { ApiService } from './services/api.service';
import { map, catchError, switchMap } from 'rxjs/operators'; // Asegura 'switchMap' esté importado

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private apiService: ApiService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const authToken = this.apiService.getAuthToken();
    const studentId = this.apiService.getLoggedInStudentId();

    // Caso 1: Hay token y studentId (usuario autenticado y perfil cargado)
    if (authToken && studentId !== null) {
      return true;
    }

    // Caso 2: Hay token, pero no studentId (posiblemente la página se refrescó)
    if (authToken && studentId === null) {
      console.log('AuthGuard: Token found, but student ID is null. Attempting to fetch student profile.');
      // Intentar obtener el perfil del estudiante
      return this.apiService.getMyStudentProfile().pipe(
        map(studentProfile => {
          if (studentProfile && studentProfile.user) {
            this.apiService.setLoggedInStudentId(studentProfile.user);
            console.log('AuthGuard: Student profile fetched. Access granted.');
            return true;
          } else {
            console.warn('AuthGuard: Student profile not found for authenticated user. Redirecting to login.');
            this.apiService.logout().subscribe(); // Limpiar token si no hay perfil
            return this.router.createUrlTree(['/login']);
          }
        }),
        catchError(error => {
          console.error('AuthGuard: Error fetching student profile. Redirecting to login.', error);
          this.apiService.logout().subscribe(); // Limpiar token si falla la API
          return of(this.router.createUrlTree(['/login']));
        })
      );
    }

    // Caso 3: No hay token (ni studentId), usuario no autenticado
    console.warn('AuthGuard: No token found. Redirecting to login.');
    return this.router.createUrlTree(['/login']);
  }
}