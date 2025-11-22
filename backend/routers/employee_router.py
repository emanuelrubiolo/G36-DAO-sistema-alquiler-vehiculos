from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.data.database import get_db
from backend.models.employee import Employee
from backend.schemas.employee_schemas import EmployeeCreate, EmployeeResponse, EmployeeUpdate

router = APIRouter(
    prefix="/employees",
    tags=["employees"],
)

@router.post("/employees", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    db_employee = Employee(**employee.dict()) #** es para desempaquetar los diccionarios(ahorra codigo)

    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

