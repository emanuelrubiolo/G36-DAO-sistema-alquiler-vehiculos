from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from decimal import Decimal


class InvoiceCreate(BaseModel):
    rentalId: int
    paymentMethod: str = Field(..., min_length=1, max_length=255)


class InvoiceResponse(BaseModel):
    id: int
    rentalId: int
    clientName: str
    issuedDate: date
    total: Decimal
    paymentMethod: str
    status: str

    # Additional info from lease
    vehicleInfo: Optional[str] = None  # e.g., "Toyota Corolla - ABC123"
    leaseDates: Optional[str] = None  # e.g., "2024-01-15 to 2024-01-20"

    class Config:
        from_attributes = True


class InvoiceUpdate(BaseModel):
    paymentMethod: Optional[str] = None
    status: Optional[str] = None


class InvoicePay(BaseModel):
    pass  # No additional data needed


class InvoiceCancel(BaseModel):
    pass  # No additional data needed