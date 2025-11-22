from typing import Optional

from pydantic import BaseModel

class Usuario_Schema(BaseModel):
    id_Empleado: Optional[int] = None
    nombre_usuario: str
    contrasenia: str