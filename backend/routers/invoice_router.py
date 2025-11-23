# routers/invoices.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from decimal import Decimal

from backend.data.database import get_db
from backend.models.invoice import Invoice
from backend.models.lease import Lease
from backend.schemas.invoice_schemas import (
    InvoiceCreate, InvoiceResponse, InvoiceUpdate,
    InvoicePay, InvoiceCancel
)

router = APIRouter(
    prefix="/facturas",
    tags=["facturas"],
)


@router.get("/", response_model=list[InvoiceResponse])
def read_invoices(
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = Query(None),
        paymentMethod: Optional[str] = Query(None),
        clientName: Optional[str] = Query(None),
        db: Session = Depends(get_db)
):
    """Lista general o filtrada (estado, método de pago, cliente)."""
    query = db.query(Invoice)

    # Apply filters
    if status:
        query = query.filter(Invoice.status == status)
    if paymentMethod:
        query = query.filter(Invoice.paymentMethod == paymentMethod)
    if clientName:
        query = query.filter(Invoice.clientName.ilike(f"%{clientName}%"))

    invoices = query.offset(skip).limit(limit).all()

    return [
        {
            "id": invoice.id,
            "rentalId": invoice.rentalId,
            "clientName": invoice.clientName,
            "issuedDate": invoice.issuedDate,
            "total": invoice.total,
            "paymentMethod": invoice.paymentMethod,
            "status": invoice.status,
            "vehicleInfo": (
                f"{invoice.lease.vehicle.brand} {invoice.lease.vehicle.model} - {invoice.lease.vehicle.patente}"
                if invoice.lease and invoice.lease.vehicle else None
            ),
            "leaseDates": (
                f"{invoice.lease.date_time_start.strftime('%Y-%m-%d')} to {invoice.lease.date_time_end.strftime('%Y-%m-%d')}"
                if invoice.lease else None
            )
        }
        for invoice in invoices
    ]


@router.get("/{id_factura}", response_model=InvoiceResponse)
def read_invoice(id_factura: int, db: Session = Depends(get_db)):
    """Detalle de la factura."""
    invoice = db.query(Invoice).filter(Invoice.id == id_factura).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    return {
        "id": invoice.id,
        "rentalId": invoice.rentalId,
        "clientName": invoice.clientName,
        "issuedDate": invoice.issuedDate,
        "total": invoice.total,
        "paymentMethod": invoice.paymentMethod,
        "status": invoice.status,
        "vehicleInfo": (
            f"{invoice.lease.vehicle.brand} {invoice.lease.vehicle.model} - {invoice.lease.vehicle.patente}"
            if invoice.lease and invoice.lease.vehicle else None
        ),
        "leaseDates": (
            f"{invoice.lease.date_time_start.strftime('%Y-%m-%d')} to {invoice.lease.date_time_end.strftime('%Y-%m-%d')}"
            if invoice.lease else None
        )
    }


@router.post("/", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
def create_invoice(invoice: InvoiceCreate, db: Session = Depends(get_db)):
    """Genera una factura para un alquiler (1:1). Calcula total = monto alquiler + incidentes."""

    # Validate lease exists
    lease = db.query(Lease).filter(Lease.id == invoice.rentalId).first()
    if not lease:
        raise HTTPException(status_code=404, detail="Lease not found")

    # Check if lease already has an invoice
    existing_invoice = db.query(Invoice).filter(Invoice.rentalId == invoice.rentalId).first()
    if existing_invoice:
        raise HTTPException(
            status_code=400,
            detail=f"Lease already has an invoice (Invoice ID: {existing_invoice.id})"
        )

    # Validate lease is finalized
    if lease.state != "finalizado":
        raise HTTPException(
            status_code=400,
            detail=f"Cannot create invoice for lease in state '{lease.state}'. Lease must be 'finalizado'."
        )

    # Calculate total: lease amount + incidents
    total = lease.amount if lease.amount else Decimal(0)

    # TODO: Add incidents/charges calculation here
    # Example: Query incidents table and add extra charges
    # incidents = db.query(Incident).filter(Incident.leaseId == lease.id).all()
    # for incident in incidents:
    #     total += incident.cost

    # Create invoice
    db_invoice = Invoice(
        rentalId=invoice.rentalId,
        clientName=lease.client.name if lease.client else "Unknown",
        issuedDate=date.today(),
        total=total,
        paymentMethod=invoice.paymentMethod,
        status="pendiente"
    )

    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)

    return {
        "id": db_invoice.id,
        "rentalId": db_invoice.rentalId,
        "clientName": db_invoice.clientName,
        "issuedDate": db_invoice.issuedDate,
        "total": db_invoice.total,
        "paymentMethod": db_invoice.paymentMethod,
        "status": db_invoice.status,
        "vehicleInfo": (
            f"{db_invoice.lease.vehicle.brand} {db_invoice.lease.vehicle.model} - {db_invoice.lease.vehicle.patente}"
            if db_invoice.lease and db_invoice.lease.vehicle else None
        ),
        "leaseDates": (
            f"{db_invoice.lease.date_time_start.strftime('%Y-%m-%d')} to {db_invoice.lease.date_time_end.strftime('%Y-%m-%d')}"
            if db_invoice.lease else None
        )
    }


@router.patch("/{id_factura}/pagar", response_model=InvoiceResponse)
def pay_invoice(id_factura: int, db: Session = Depends(get_db)):
    """Cambia estado a 'Pagada'."""
    db_invoice = db.query(Invoice).filter(Invoice.id == id_factura).first()
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if db_invoice.status == "anulada":
        raise HTTPException(
            status_code=400,
            detail="Cannot pay a cancelled invoice"
        )

    if db_invoice.status == "pagada":
        raise HTTPException(
            status_code=400,
            detail="Invoice is already paid"
        )

    db_invoice.status = "pagada"
    db.commit()
    db.refresh(db_invoice)

    return {
        "id": db_invoice.id,
        "rentalId": db_invoice.rentalId,
        "clientName": db_invoice.clientName,
        "issuedDate": db_invoice.issuedDate,
        "total": db_invoice.total,
        "paymentMethod": db_invoice.paymentMethod,
        "status": db_invoice.status,
        "vehicleInfo": (
            f"{db_invoice.lease.vehicle.brand} {db_invoice.lease.vehicle.model} - {db_invoice.lease.vehicle.patente}"
            if db_invoice.lease and db_invoice.lease.vehicle else None
        ),
        "leaseDates": (
            f"{db_invoice.lease.date_time_start.strftime('%Y-%m-%d')} to {db_invoice.lease.date_time_end.strftime('%Y-%m-%d')}"
            if db_invoice.lease else None
        )
    }


@router.patch("/{id_factura}/anular", response_model=InvoiceResponse)
def cancel_invoice(id_factura: int, db: Session = Depends(get_db)):
    """Cambia a 'Anulada'."""
    db_invoice = db.query(Invoice).filter(Invoice.id == id_factura).first()
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if db_invoice.status == "pagada":
        raise HTTPException(
            status_code=400,
            detail="Cannot cancel a paid invoice. Issue a refund instead."
        )

    if db_invoice.status == "anulada":
        raise HTTPException(
            status_code=400,
            detail="Invoice is already cancelled"
        )

    db_invoice.status = "anulada"
    db.commit()
    db.refresh(db_invoice)

    return {
        "id": db_invoice.id,
        "rentalId": db_invoice.rentalId,
        "clientName": db_invoice.clientName,
        "issuedDate": db_invoice.issuedDate,
        "total": db_invoice.total,
        "paymentMethod": db_invoice.paymentMethod,
        "status": db_invoice.status,
        "vehicleInfo": (
            f"{db_invoice.lease.vehicle.brand} {db_invoice.lease.vehicle.model} - {db_invoice.lease.vehicle.patente}"
            if db_invoice.lease and db_invoice.lease.vehicle else None
        ),
        "leaseDates": (
            f"{db_invoice.lease.date_time_start.strftime('%Y-%m-%d')} to {db_invoice.lease.date_time_end.strftime('%Y-%m-%d')}"
            if db_invoice.lease else None
        )
    }