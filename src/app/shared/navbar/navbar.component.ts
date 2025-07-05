import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  title = "CampusLibre";

  constructor(private apiService: ApiService, private router: Router) { }

  logout(): void {
    this.apiService.logout().subscribe(
      () => {
        console.log('Sesión cerrada exitosamente');
        this.router.navigate(['/login']); // Redirigir al login después del logout
      },
      error => {
        console.error('Error al cerrar sesión:', error);
        // Aunque haya error en el backend, si se elimina el token local, se considera logout
        this.router.navigate(['/login']);
      }
    );
  }
}