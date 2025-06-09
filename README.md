# Evaluación Docente en CampusLibre
La Universidad CampusLibre estará implementando un sistema de evaluación docente mediante una plataforma desarrollada en Angular, donde los estudiantes podrán calificar a sus profesores y asignaturas al final de cada semestre. Este repositorio contiene una aplicación web desarrollada con Angular, diseñada para facilitar la evaluación docente. La aplicación está empaquetada y servida utilizando Docker y Nginx, lo que garantiza un despliegue sencillo y consistente en cualquier entorno.

## Caracteristicas principales

- Interfaz de usuario intuitiva para la evaluación.
- Gráficos para visualización de datos (usando Chart.js).
- Despliegue rápido y portable con Docker.

## Tecnologias

- Angular
- Bootstrap
- RxJS
- Typescript

## Instalación con Docker
Con Docker, el proceso de instalación se simplifica enormemente. No necesitas instalar Node.js ni las dependencias del proyecto (npm install) directamente en tu computadora. Docker crea un entorno aislado y se encarga de todo el proceso.

## Prerrequisitos
Tener Docker Desktop instalado y en ejecución en tu sistema. Puedes descargarlo desde el sitio oficial de Docker.
Pasos para Ejecutar

## Dockerfile

Abrir una Terminal
Abre tu terminal o CMD y navega hasta la carpeta donde acabas de guardar el archivo Dockerfile.

- Construir la Imagen de Docker
- Ejecuta el siguiente comando en la terminal para que Docker lea el Dockerfile y construya la imagen de tu aplicación. Este paso clona el repositorio e instala las dependencias dentro de Docker, no en tu PC.

docker build -t evaluacion-docente .
- Ejecutar el Contenedor
- Una vez que la imagen se haya construido, ejecuta el siguiente comando en la terminal para iniciar la aplicación:

docker run -d -p 80:80 evaluacion-docente

## Acceder a la Aplicación
¡Listo! Abre tu navegador web y ve a la siguiente dirección para ver la aplicación funcionando:

http://localhost:80 (o el puerto que hayas elegido, como http://localhost:80).
