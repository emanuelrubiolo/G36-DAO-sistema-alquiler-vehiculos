from .base import EntidadBase
from typing import Optional, Dict

class Empleado(EntidadBase):
    """
    Representa un empleado del sistema.
    HERENCIA: Hereda de EntidadBase.
    """
    def __init__(self, nombre: str, apellido: str, dni: str,
                 cargo: str, email: str, telefono: str,
                 id: Optional[int] = None):
        super().__init__(id)
        self._nombre = nombre
        self._apellido = apellido
        self._dni = dni
        self._cargo = cargo
        self._email = email
        self._telefono = telefono
    
    @property
    def nombre_completo(self) -> str:
        """Método calculado que encapsula lógica"""
        return f"{self._nombre} {self._apellido}"
    
    def validar(self) -> bool:
        return self._nombre and self._apellido and self._dni and self._cargo
    
    def to_dict(self) -> Dict:
        return {
            "id": self._id,
            "nombre": self._nombre,
            "apellido": self._apellido,
            "dni": self._dni,
            "cargo": self._cargo,
            "email": self._email,
            "telefono": self._telefono
        }
