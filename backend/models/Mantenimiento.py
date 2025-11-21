from sqlalchemy import Column, Integer, String, Float, Date
from backend.data.database import Base

class Mantenimiento(Base):
    __tablename__ = "Mantenimientos"
    id_Mantenimiento = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_vehiculo = Column(Integer, foreign_key="Vehiculos.id_Vehiculo")
    id_empleado = Column(Integer, foreign_key="Empleados.id_Empleado")
    fecha_inicio = Column(Date)
    fecha_fin = Column(Date)
    tipo = Column(String)
    costo = Column(Float)
    fecha_creacion = Column(Date)
    descripcion = Column(String)