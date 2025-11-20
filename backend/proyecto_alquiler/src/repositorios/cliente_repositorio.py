from .base import RepositorioBase
from ..modelos.cliente import Cliente
from ..enums.estados import EstadoCliente
from typing import List

class RepositorioClientes(RepositorioBase):
    """
    HERENCIA: Especializa el repositorio para Clientes.
    """
    def filtrar_por_estado(self, estado: EstadoCliente) -> List[Cliente]:
        """Método específico para filtrar clientes por estado"""
        return [c for c in self._datos.values() if c.estado == estado]
