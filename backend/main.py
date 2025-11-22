from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from backend.data.database import get_db
from backend.models.Usuario import Usuario
from backend.models.Empleado import Empleado
from backend.schemas.usuario_create import Usuario_Schema

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello World!!!"}

@app.post("/adduser")
async def adduser(request:Usuario_Schema, db: Session = Depends(get_db)):
    usuario = Usuario(
        id_Empleado=request.id_Empleado,
        nombre_usuario=request.nombre_usuario,
        contrasenia=request.contrasenia
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario

