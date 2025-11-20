from abc import ABC
from typing import Dict, List, Optional
from ..modelos.base import EntidadBase

class RepositorioBase(ABC):
    """
    ABSTRACCIÓN: Define el contrato para todos los repositorios.
    Patrón Repository para separar lógica de negocio de acceso a datos.
    """
    def __init__(self):
        self._datos: Dict[int, EntidadBase] = {}
        self._id_actual = 1
    
    def obtener_por_id(self, id: int) -> Optional[EntidadBase]:
        """ENCAPSULAMIENTO: Método para obtener por ID"""
        return self._datos.get(id)
    
    def listar_todos(self) -> List[EntidadBase]:
        """Retorna todos los elementos"""
        return list(self._datos.values())
    
    def crear(self, entidad: EntidadBase) -> EntidadBase:
        """ENCAPSULAMIENTO: Crea y asigna ID automáticamente"""
        if not entidad.validar():
            raise ValueError("Entidad inválida")
        
        entidad.id = self._id_actual
        self._datos[self._id_actual] = entidad
        self._id_actual += 1
        return entidad
    
    def actualizar(self, id: int, entidad: EntidadBase) -> Optional[EntidadBase]:
        """Actualiza una entidad existente"""
        if id not in self._datos:
            return None
        
        if not entidad.validar():
            raise ValueError("Entidad inválida")
        
        entidad.id = id
        self._datos[id] = entidad
        return entidad
    
    def eliminar(self, id: int) -> bool:
        """Elimina una entidad"""
        if id in self._datos:
            del self._datos[id]
            return True
        return False
