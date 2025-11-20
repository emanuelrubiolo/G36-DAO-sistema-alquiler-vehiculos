from .base import EntidadBase
from typing import Optional, Dict

class Incidente(EntidadBase):
    """Stub de Incidente"""
    def __init__(self, descripcion: str, monto: float, id: Optional[int] = None):
        super().__init__(id)
        self.descripcion = descripcion
        self.monto = monto
    
    def validar(self) -> bool:
        return bool(self.descripcion and self.monto >= 0)
    
    def to_dict(self) -> Dict:
        return {
            "id": self._id,
            "descripcion": self.descripcion,
            "monto": self.monto
        }
