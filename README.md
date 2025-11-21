# Proyecto: Sistema de Alquiler de Vehículos

Este README explica cómo preparar e iniciar el proyecto (backend y frontend) en Windows.

## Requisitos
- Python 3.8+ instalado
- Node.js 14+ y npm/yarn (si hay frontend basado en Node)
- Git (opcional)
- PowerShell (instrucciones para Windows)

## Estructura relevante
- Backend: `backend\proyecto_alquiler`
  - Aplicación FastAPI ejecutable con: `src.app:app`
  - Archivo de dependencias: `requirements.txt` (dentro del backend)
- Frontend: carpeta `frontend` (si existe). Si tu frontend está en otra ruta, sustituye `frontend` por la carpeta correcta.

## Crear y activar entorno virtual (PowerShell)
Desde la raíz del repositorio:
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```
Para CMD:
```cmd
python -m venv .venv
.\.venv\Scripts\activate.bat
```

## Instalar dependencias (backend)
Desde la raíz del repo o directamente dentro de la carpeta backend:
```powershell
cd backend\proyecto_alquiler
python -m pip install --upgrade pip
pip install -r requirements.txt
```

## Ejecutar la API (backend)
Desde `backend\proyecto_alquiler` (PowerShell):
```powershell
cd backend\proyecto_alquiler
python -m uvicorn src.app:app --reload --host 127.0.0.1 --port 8000
```
La API quedará disponible en: http://127.0.0.1:8000

Si necesitas usar otra IP/puerto, ajusta `--host` y `--port`.

## Ejecutar tests (pytest)
Asegúrate de tener instaladas las dependencias del backend (incluyendo pytest). Desde `backend\proyecto_alquiler`:
```powershell
cd backend\proyecto_alquiler
pytest
```
O desde la raíz si prefieres:
```powershell
pytest backend\proyecto_alquiler
```

## Frontend (si aplica)
Si tu frontend es una aplicación Node (React/Vue/etc.) y está en `frontend`:
```powershell
cd frontend
npm install    # o yarn
npm run dev    # o npm start / npm run serve según el proyecto
```
Si la carpeta o comandos son distintos, reemplaza por los correctos.

## Variables de entorno / configuración
Si la aplicación requiere variables de entorno (DB, credenciales, etc.), crea un archivo `.env` en la carpeta correspondiente (`backend\proyecto_alquiler`) con las variables necesarias antes de arrancar la API. Consulta la documentación del código o pregunta si necesitas que te indique las variables esperadas.

## Notas útiles
- Siempre activar el entorno virtual antes de instalar o ejecutar Python.
- Si hay problemas con dependencias, borrar y recrear el venv suele ayudar:
  ```powershell
  Remove-Item -Recurse -Force .venv
  python -m venv .venv
  .\.venv\Scripts\Activate.ps1
  pip install -r backend\proyecto_alquiler\requirements.txt
  ```

## Si falta información
Si tu frontend está en otra ruta o el backend requiere pasos adicionales (migraciones, base de datos, variables específicas), proporciona la ruta o los detalles y actualizo el README con los pasos exactos.

