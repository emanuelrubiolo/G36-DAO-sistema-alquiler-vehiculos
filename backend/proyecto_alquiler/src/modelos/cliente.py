from .base import EntidadBase
from ..enums.estados import EstadoCliente
from typing import Optional, Dict

class Cliente(EntidadBase):
    """
    Representa un cliente del sistema.
    ENCAPSULAMIENTO: Atributos privados con acceso controlado mediante propiedades.
    HERENCIA: Hereda de EntidadBase.
    """
    def __init__(self, nombre: str, apellido: str, dni: str, 
                 email: str, telefono: str, direccion: str,
                 id: Optional[int] = None):
        super().__init__(id)  # HERENCIA: llama al constructor de la clase padre
        self._nombre = nombre
        self._apellido = apellido
        self._dni = dni
        self._email = email
        self._telefono = telefono
        self._direccion = direccion
        self._estado = EstadoCliente.ACTIVO
    
    # ENCAPSULAMIENTO: Propiedades para acceso controlado
    @property
    def nombre(self) -> str:
        return self._nombre
    
    @nombre.setter
    def nombre(self, valor: str):
        if not valor or len(valor) < 2:
            raise ValueError("El nombre debe tener al menos 2 caracteres")
        self._nombre = valor
    
    @property
    def estado(self) -> EstadoCliente:
        return self._estado
    
    def activar(self):
        """Método que encapsula la lógica de activación"""
        self._estado = EstadoCliente.ACTIVO
    
    def desactivar(self):
        """Método que encapsula la lógica de desactivación"""
        self._estado = EstadoCliente.INACTIVO
    
    def validar(self) -> bool:
        """Valida los datos del cliente"""
        return (self._nombre and self._apellido and 
                self._dni and self._email and self._telefono)
    
    def to_dict(self) -> Dict:
        """Convierte el objeto a diccionario para API REST"""
        return {
            "id": self._id,
            "nombre": self._nombre,
            "apellido": self._apellido,
            "dni": self._dni,
            "email": self._email,
            "telefono": self._telefono,
            "direccion": self._direccion,
            "estado": self._estado.value,
            "fecha_creacion": self._fecha_creacion.isoformat()
        }
