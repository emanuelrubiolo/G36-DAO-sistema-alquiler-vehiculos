from ..servicios.cliente_servicio import ServicioClientes
from typing import Dict

class ControladorClientes:
    """
    ENCAPSULAMIENTO: Maneja las peticiones HTTP para clientes.
    Patrón MVC: Este es el Controlador.
    """
    def __init__(self, servicio: ServicioClientes):
        self._servicio = servicio
    
    def get_clientes(self, query_params: Dict = None) -> Dict:
        """GET /clientes"""
        estado = query_params.get('estado') if query_params else None
        clientes = self._servicio.listar_clientes(estado)
        
        return {
            "status": 200,
            "data": [c.to_dict() for c in clientes],
            "total": len(clientes)
        }
    
    def get_cliente(self, id: int) -> Dict:
        """GET /clientes/{id}"""
        cliente = self._servicio.obtener_cliente(id)
        
        if not cliente:
            return {"status": 404, "error": "Cliente no encontrado"}
        
        return {"status": 200, "data": cliente.to_dict()}
    
    def post_cliente(self, body: Dict) -> Dict:
        """POST /clientes"""
        try:
            cliente = self._servicio.crear_cliente(body)
            return {"status": 201, "data": cliente.to_dict()}
        except Exception as e:
            return {"status": 400, "error": str(e)}
    
    def patch_estado_cliente(self, id: int, body: Dict) -> Dict:
        """PATCH /clientes/{id}/estado"""
        activar = body.get('estado') == 'activo'
        cliente = self._servicio.cambiar_estado_cliente(id, activar)
        
        if not cliente:
            return {"status": 404, "error": "Cliente no encontrado"}
        
        return {"status": 200, "data": cliente.to_dict()}
