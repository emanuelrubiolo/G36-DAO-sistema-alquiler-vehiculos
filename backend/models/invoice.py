from backend.data.database import Base
from sqlalchemy import Integer, String, Column, ForeignKey, DATE, DECIMAL


class Invoice(Base):
    __tablename__ = 'Invoices'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    rentalId = Column(Integer, ForeignKey('Leases.id'), nullable=True)
    clientName = Column(String(255))
    issuedDate = Column(DATE)
    total = Column(DECIMAL(10,2))
    paymentMethod = Column(String(255))
    status = Column(String(255))
