from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import employee_router
import backend
from backend.data.database import engine, Base


#todo: from routers import

app = FastAPI(
    title="Sistema de Alquiler de Vehículos",
    description="API para gestión de alquileres",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#todo: modelos según bd
#todo: crear routers
#todo: crear esquemas

app.include_router(employee_router.router)

@app.get("/")
def root():
    return {"message": "ALQUILER DE AUTOS"}
