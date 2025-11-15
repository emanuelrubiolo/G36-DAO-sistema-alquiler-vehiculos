# 1. Usar una imagen base oficial de Python
FROM python:3.11-slim

# 2. Establecer el directorio de trabajo DENTRO del contenedor
WORKDIR /app

# 3. Copiar el archivo de requisitos
COPY requirements.txt .

# 4. Instalar las dependencias
#    Docker ejecuta este comando "pip install" dentro de la imagen.
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copiar el resto del código del backend al contenedor
#    (El volumen lo mantendrá sincronizado después)
COPY .. .

# 6. Comando para EJECUTAR la aplicación
#    --reload: Magia de "hot-reloading". Reinicia el server si cambiás el código.
#    --host 0.0.0.0: Requerido para exponer la app fuera de Docker.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]