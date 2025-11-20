from ..repositorios.cliente_repositorio import RepositorioClientes
from ..modelos.cliente import Cliente
from ..enums.estados import EstadoCliente
from typing import Dict, Optional, List

class ServicioClientes:
    """
    ENCAPSULAMIENTO: Encapsula toda la lógica de negocio de clientes.
    COMPOSICIÓN: Contiene un repositorio.
    """
    def __init__(self, repositorio: RepositorioClientes):
        self._repositorio = repositorio
    
    def crear_cliente(self, datos: Dict) -> Cliente:
        """Valida y crea un cliente"""
        cliente = Cliente(
            nombre=datos['nombre'],
            apellido=datos['apellido'],
            dni=datos['dni'],
            email=datos['email'],
            telefono=datos['telefono'],
            direccion=datos['direccion']
        )
        return self._repositorio.crear(cliente)
    
    def obtener_cliente(self, id: int) -> Optional[Cliente]:
        return self._repositorio.obtener_por_id(id)
    
    def listar_clientes(self, estado: Optional[str] = None) -> List[Cliente]:
        if estado:
            return self._repositorio.filtrar_por_estado(EstadoCliente(estado))
        return self._repositorio.listar_todos()
    
    def cambiar_estado_cliente(self, id: int, activar: bool) -> Optional[Cliente]:
        """ENCAPSULAMIENTO: Lógica de cambio de estado"""
        cliente = self._repositorio.obtener_por_id(id)
        if not cliente:
            return None
        
        if activar:
            cliente.activar()
        else:
            cliente.desactivar()
        
        return cliente
