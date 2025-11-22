from sqlalchemy.dialects.mysql import DATETIME

from backend.data.database import Base
from sqlalchemy import Integer, String, Column, ForeignKey, DECIMAL, DATE


class Lease(Base):
    __tablename__ = 'Leases'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    clientName = Column(String(255))
    vehicleId = Column(Integer, ForeignKey('Vehicles.id'), nullable=True)
    employeeId = Column(Integer, ForeignKey('Employees.id'), nullable=True)
    date_time_start = Column(DATETIME)
    date_time_end = Column(DATETIME)
    amount = Column(DECIMAL(10,2))
    state = Column(String(255))
    date_create = Column(DATE)
    date_confirm = Column(DATE)
    date_cancel = Column(DATE)
    start_kilometers = Column(Integer)
    end_kilometers = Column(Integer)
