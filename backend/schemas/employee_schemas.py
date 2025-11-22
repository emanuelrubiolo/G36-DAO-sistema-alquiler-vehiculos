from pydantic import BaseModel


class EmployeeCreate(BaseModel):
    name: str
    dni: str
    email: str
    phone: str
    cargo: str

class EmployeeResponse(BaseModel):
    pass


class EmployeeUpdate(BaseModel):
    pass

