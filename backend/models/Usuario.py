from sqlalchemy import Column, Integer, String, ForeignKey
from backend.data.database import Base

class Usuario(Base):
    __tablename__ = "Usuarios"

    id_Usuario = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_Empleado = Column(Integer, ForeignKey("Empleados.id_Empleado"), nullable=True)
    nombre_usuario = Column(String(255))
    contrasenia = Column(String(255))