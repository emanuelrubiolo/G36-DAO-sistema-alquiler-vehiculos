from sqlalchemy.orm import relationship

from backend.data.database import Base
from sqlalchemy import Integer, String, Column

class Employee(Base):
    __tablename__ = 'Employees'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255))
    dni = Column(String(255), unique=True)
    email = Column(String(255))
    phone = Column(String(255))
    cargo = Column(String(255))

    #todo: agregar restricción para evitar borrar el usuario o para dejar al usuario sin empleado
    users = relationship("User", back_populates="employee", passive_deletes=True)