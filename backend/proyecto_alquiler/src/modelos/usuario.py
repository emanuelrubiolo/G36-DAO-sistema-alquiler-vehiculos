from .base import EntidadBase
from typing import Optional, Dict

class Usuario(EntidadBase):
    """Stub de Usuario"""
    def __init__(self, username: str, password_hash: str, rol: str = "usuario", id: Optional[int] = None):
        super().__init__(id)
        self.username = username
        self.password_hash = password_hash
        self.rol = rol
    
    def validar(self) -> bool:
        return bool(self.username and self.password_hash)
    
    def to_dict(self) -> Dict:
        return {
            "id": self._id,
            "username": self.username,
            "rol": self.rol
        }
