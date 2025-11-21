from sqlalchemy import Column, Integer, String, DATETIME, Float, DATE
from backend.data.database import Base

class Alquiler(Base):
    __tablename__ = "Alquileres"

    id_Alquiler = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_cliente  = Column(Integer, foreign_key="Clientes.id_Empleado")
    id_vehiculo = Column(Integer, foreign_key="Vehiculos.id_Vehiculo")
    id_empleado = Column(Integer, foreign_key="Empleados.id_Empleado")
    fecha_hora_inicio = Column(DATETIME)
    monto = Column(Float)
    estado = Column(String)
    fecha_creacion = Column(DATE)
    fecha_confirmacion = Column(DATE)
