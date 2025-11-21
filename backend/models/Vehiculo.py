from sqlalchemy import Column, Integer, String
from backend.data.database import Base

class Vehiculo(Base):
    __tablename__ = "Vehiculos"

    id_Vehiculo = Column(Integer, primary_key=True, index=True, autoincrement=True)
    marca = Column(String)
    modelo = Column(String)
    patente = Column(String, unique=True)
    anio = Column(Integer)
    kilometraje_actual = Column(Integer)
    estado = Column(String)
    precio_por_dia = Column(Integer)
    url_imagen = Column(String)
    asientos = Column(Integer)
    transmision = Column(String)
    tipo_combustible = Column(String)