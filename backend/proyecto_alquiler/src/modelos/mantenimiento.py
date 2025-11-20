from .base import EntidadBase
from typing import Optional, Dict

class Mantenimiento(EntidadBase):
    """Stub de Mantenimiento"""
    def __init__(self, descripcion: str, fecha: str, costo: float, id: Optional[int] = None):
        super().__init__(id)
        self.descripcion = descripcion
        self.fecha = fecha
        self.costo = costo
    
    def validar(self) -> bool:
        return bool(self.descripcion and self.fecha and self.costo >= 0)
    
    def to_dict(self) -> Dict:
        return {
            "id": self._id,
            "descripcion": self.descripcion,
            "fecha": self.fecha,
            "costo": self.costo
        }
