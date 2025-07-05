// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Importa esto

import { routes } from './app.routes';
import { ApiService } from './services/api.service'; // <--- ¡IMPORTA TU API SERVICE!

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(), // Añade esto para habilitar HttpClient
    ApiService           // <--- ¡AÑADE ESTA LÍNEA PARA PROVEER TU API SERVICE!
  ]
};