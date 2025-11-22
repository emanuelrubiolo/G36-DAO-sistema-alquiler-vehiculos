from decimal import Decimal

from backend.data.database import Base
from sqlalchemy import Integer, String, Column, ForeignKey

class Vehicle(Base):
    __tablename__ = 'Vehicles'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    brand = Column(String(255))
    model = Column(String(255))
    patente = Column(String(255), unique=True)
    year = Column(Integer)
    pricePerDay = Column(Decimal(10,2))
    thumbnail = Column(String(255))
    seats = Column(Integer)
    transmission = Column(String(45))
    fuel = Column(String(45))
    kilometraje_actual = Column(Integer) #todo: traducir aca y en bd
    estado = Column(String(255)) #todo: traducir aca y en bd
