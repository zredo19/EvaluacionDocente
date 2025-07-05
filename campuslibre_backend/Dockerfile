# /campuslibre_backend/Dockerfile
# Usar una versión específica y reciente de Python sobre Debian "Bookworm"
FROM python:3.10-slim-bookworm

# Variables de entorno para Python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# ⬆️ PASO DE ACTUALIZACIÓN: Actualiza los paquetes del sistema operativo
# Esto corrige las vulnerabilidades conocidas en la imagen base.
RUN apt-get update && apt-get upgrade -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias de Python
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del proyecto
COPY . /app/

# Exponer el puerto
EXPOSE 8000

# Comando para aplicar migraciones y correr el servidor
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]