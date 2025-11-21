from sqlalchemy import Column, Integer, String
from backend.data.database import Base

class Empleado(Base):
    __tablename__ = "Empleados"
    id_Empleado = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String)
    dni = Column(String, unique=True)
    telefono = Column(String)
    email = Column(String)
    cargo = Column(String)