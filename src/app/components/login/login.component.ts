import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password = '';
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) { }

  login(): void {
    this.errorMessage = '';
    this.apiService.login({ email: this.email, password: this.password }).pipe(
      catchError(error => {
        // El error ya es propagado por apiService.login, solo lo manejamos aquí
        console.error('Error during login in component:', error);
        if (error.status === 400 || error.status === 401) {
          this.errorMessage = 'Correo o contraseña incorrectos.';
        } else {
          this.errorMessage = 'Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.';
        }
        return of(null); // Retorna un observable nulo para detener la cadena de suscripción
      })
    ).subscribe(
      (success: any) => { // 'success' puede ser cualquier valor si el proceso fue exitoso, o null si hubo error
        if (success) { // Solo si el proceso de login fue completamente exitoso (token + studentId)
          this.router.navigate(['/courses']); // Redirigir al listado de cursos después del login
        }
        // Si success es null, significa que catchError actuó y ya mostró un mensaje de error
      }
    );
  }
}