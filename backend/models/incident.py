from backend.data.database import Base
from sqlalchemy import Integer, String, Column, ForeignKey, DATE, DECIMAL

class Incident(Base):
    __tablename__ = 'Incidents'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    rentalId = Column(Integer, ForeignKey('Leases.id'), nullable=True)
    employeeId = Column(Integer, ForeignKey('Employees.id'), nullable=True)
    clientName = Column(String(255))
    vehicleName = Column(String(255))
    type = Column(String(255))
    description = Column(String(255))
    cost = Column(DECIMAL(10,2))
    state = Column(DATE)