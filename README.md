# Evaluación Docente en CampusLibre
La Universidad CampusLibre estará implementando un sistema de evaluación docente mediante una plataforma desarrollada en Angular, donde los estudiantes podrán calificar a sus profesores y asignaturas al final de cada semestre.

## Caracteristicas principales

- Permite ver los cursos con su codigo, nombre del curso, docente que imparte el curso, y al semestre que pertenece
- Permite ver los docentes con sus respectivos datos, nombre, apellido, correo, y carrera en la que se desempeña
- Posee un historial de las evaluaciones
- Tiene un seccion con graficos para indicar los promedios de las evaluciones realizadas

## Tecnologias

- Angular
- Bootstrap
- RxJS
- Typescript

## Instalacion

- Una vez descargado o clonado el proyecto, hay que entrar en el directorio desde el CMD "cd Ruta donde este guardado el proyecto" o con "git clone https://github.com/tuusuario/proyecto-aplicaciones.git" en caso de querer clonar el proyecto

- Luego hay que instalar las dependencias con el comando "npm install"

- Una vez instalado las dependencias hay que iniciar hay que usar el comando "ng serve" para hostear la aplicacion web

- Cuando se haya iniciado el servidor este se abrira en el puerto 4200 por lo que hay que entrar a "http://localhost:4200" o simplemente ingresar una "O" en el CMD y luego enter.

## Estructura del proyecto

proyecto-aplicaciones/
├── src/
│   ├── app/
│   ├── assets/
│   ├── index
├── angular.json
├── package.json
└── tsconfig.json

## En caso de error

- En caso de que se presente un error al ejecutar el servidor, concretamente con chart.js, bastara con usar el comando "npm instal chart.js" en el CMD y luego simplemente iniciar con "ng serve"
