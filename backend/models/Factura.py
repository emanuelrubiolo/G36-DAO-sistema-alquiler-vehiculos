from sqlalchemy import Column, Integer, String, Date, Float
from backend.data.database import Base

class Factura(Base):
    __tablename__ = "Facturas"

    id_Factura = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_alquiler = Column(Integer, foreign_key="Alquileres.id_Alquiler")
    fecha_emision = Column(Date)
    total = Column(Float)
    metodo_pago = Column(String)
    estado = Column(String)
    