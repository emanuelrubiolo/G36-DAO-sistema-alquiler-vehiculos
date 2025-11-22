from backend.data.database import Base
from sqlalchemy import Integer, String, Column, ForeignKey


class user(Base):
    __tablename__ = 'Users'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_employee = Column(Integer, ForeignKey('Employees.id'), nullable=True)
    user_name = Column(String(255))
    password = Column(String(255))