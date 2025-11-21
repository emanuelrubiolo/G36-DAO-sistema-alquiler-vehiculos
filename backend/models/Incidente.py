from sqlalchemy import Column, Integer, String, Float, Date
from backend.data.database import Base

class Incidente(Base):
    __tablename__ = "Incidentes"

    id_Incidente = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_alquiler = Column(Integer, foreign_key="Alquileres.id_Alquiler")
    id_empleado = Column(Integer, foreign_key="Empleados.id_Empleado")
    descripcion = Column(String)
    tipo = Column(String)
    monto = Column(Float)
    fecha_creacion = Column(Date)