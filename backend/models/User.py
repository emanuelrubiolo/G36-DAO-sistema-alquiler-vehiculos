from sqlalchemy import Column, Integer, String
from backend.data.database import Base

class User(Base):
    __tablename__ = "Usuarios"

    id_User = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_Empleado = Column(Integer, foreign_key="Empleados.id_Empleado")
    nombre_usuario = Column(String)
    contrasenia = Column(String)