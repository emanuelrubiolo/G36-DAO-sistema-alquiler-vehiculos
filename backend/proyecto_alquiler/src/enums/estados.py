from enum import Enum

class EstadoCliente(Enum):
    """Enumeración para estados de cliente"""
    ACTIVO = "activo"
    INACTIVO = "inactivo"


class EstadoVehiculo(Enum):
    """Enumeración para estados de vehículo"""
    DISPONIBLE = "disponible"
    ALQUILADO = "alquilado"
    MANTENIMIENTO = "mantenimiento"


class EstadoAlquiler(Enum):
    """Enumeración para estados de alquiler"""
    PENDIENTE = "pendiente"
    CONFIRMADO = "confirmado"
    FINALIZADO = "finalizado"
    CANCELADO = "cancelado"


class EstadoFactura(Enum):
    """Enumeración para estados de factura"""
    PENDIENTE = "pendiente"
    PAGADA = "pagada"
    ANULADA = "anulada"


class TipoMantenimiento(Enum):
    """Enumeración para tipos de mantenimiento"""
    PREVENTIVO = "preventivo"
    CORRECTIVO = "correctivo"
