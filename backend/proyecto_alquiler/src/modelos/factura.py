from .base import EntidadBase
from typing import Optional, Dict

class Factura(EntidadBase):
    """Stub de Factura"""
    def __init__(self, alquiler_id: int, monto: float, estado: str = "pendiente", id: Optional[int] = None):
        super().__init__(id)
        self.alquiler_id = alquiler_id
        self.monto = monto
        self.estado = estado
    
    def validar(self) -> bool:
        return self.monto >= 0
    
    def to_dict(self) -> Dict:
        return {
            "id": self._id,
            "alquiler_id": self.alquiler_id,
            "monto": self.monto,
            "estado": self.estado
        }
