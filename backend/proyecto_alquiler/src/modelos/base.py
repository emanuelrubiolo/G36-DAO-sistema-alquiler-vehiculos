from abc import ABC, abstractmethod
from datetime import datetime
from typing import Optional, Dict

class EntidadBase(ABC):
    """
    Clase abstracta que representa una entidad base del sistema.
    ABSTRACCIÓN: Define métodos que todas las entidades deben implementar.
    """
    def __init__(self, id: Optional[int] = None):
        self._id = id  # ENCAPSULAMIENTO: atributo privado
        self._fecha_creacion = datetime.now()
    
    @property  # ENCAPSULAMIENTO: getter para acceso controlado
    def id(self) -> Optional[int]:
        return self._id
    
    @id.setter
    def id(self, valor: int):
        self._id = valor
    
    @abstractmethod
    def to_dict(self) -> Dict:
        """Método abstracto que cada clase debe implementar"""
        pass
    
    @abstractmethod
    def validar(self) -> bool:
        """Valida los datos de la entidad"""
        pass
