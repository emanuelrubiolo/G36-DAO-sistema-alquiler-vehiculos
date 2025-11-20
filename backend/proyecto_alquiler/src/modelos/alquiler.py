from .base import EntidadBase
from .cliente import Cliente
from .vehiculo import Vehiculo
from .empleado import Empleado
from ..enums.estados import EstadoAlquiler, EstadoVehiculo
from datetime import datetime
from typing import Optional, Dict, List

class Alquiler(EntidadBase):
    """
    Representa un alquiler de vehículo.
    COMPOSICIÓN: Contiene referencias a Cliente, Vehículo y Empleado.
    """
    def __init__(self, cliente: Cliente, vehiculo: Vehiculo,
                 empleado: Empleado, fecha_inicio: datetime,
                 fecha_fin: datetime, id: Optional[int] = None):
        super().__init__(id)
        # COMPOSICIÓN: El alquiler depende de estos objetos
        self._cliente = cliente
        self._vehiculo = vehiculo
        self._empleado = empleado
        self._fecha_inicio = fecha_inicio
        self._fecha_fin = fecha_fin
        self._kilometraje_inicio = vehiculo._kilometraje
        self._kilometraje_fin: Optional[float] = None
        self._monto_total: Optional[float] = None
        self._estado = EstadoAlquiler.PENDIENTE
        self._fecha_confirmacion: Optional[datetime] = None
        self._fecha_cancelacion: Optional[datetime] = None
    
    @property
    def estado(self) -> EstadoAlquiler:
        return self._estado
    
    def confirmar(self):
        """Encapsula la lógica de confirmación"""
        if self._estado != EstadoAlquiler.PENDIENTE:
            raise ValueError("Solo se pueden confirmar alquileres pendientes")
        
        if not self._vehiculo.esta_disponible():
            raise ValueError("El vehículo no está disponible")
        
        self._estado = EstadoAlquiler.CONFIRMADO
        self._fecha_confirmacion = datetime.now()
        self._vehiculo.cambiar_estado(EstadoVehiculo.ALQUILADO)
    
    def cancelar(self):
        """Encapsula la lógica de cancelación"""
        if self._estado == EstadoAlquiler.FINALIZADO:
            raise ValueError("No se puede cancelar un alquiler finalizado")
        
        self._estado = EstadoAlquiler.CANCELADO
        self._fecha_cancelacion = datetime.now()
        
        if self._vehiculo.estado == EstadoVehiculo.ALQUILADO:
            self._vehiculo.cambiar_estado(EstadoVehiculo.DISPONIBLE)
    
    def finalizar(self, kilometraje_fin: float, incidentes: List = None):
        """
        Finaliza el alquiler calculando el monto total.
        POLIMORFISMO: Usa el método calcular_costo_alquiler del vehículo.
        """
        if self._estado != EstadoAlquiler.CONFIRMADO:
            raise ValueError("Solo se pueden finalizar alquileres confirmados")
        
        self._kilometraje_fin = kilometraje_fin
        dias = (self._fecha_fin - self._fecha_inicio).days
        
        # POLIMORFISMO: Llama al método del vehículo
        self._monto_total = self._vehiculo.calcular_costo_alquiler(dias)
        
        if incidentes:
            for incidente in incidentes:
                self._monto_total += incidente.monto
        
        self._estado = EstadoAlquiler.FINALIZADO
        self._vehiculo.cambiar_estado(EstadoVehiculo.DISPONIBLE)
    
    def validar(self) -> bool:
        return (self._cliente and self._vehiculo and 
                self._empleado and self._fecha_inicio and self._fecha_fin)
    
    def to_dict(self) -> Dict:
        return {
            "id": self._id,
            "cliente_id": self._cliente.id,
            "vehiculo_id": self._vehiculo.id,
            "empleado_id": self._empleado.id,
            "fecha_inicio": self._fecha_inicio.isoformat(),
            "fecha_fin": self._fecha_fin.isoformat(),
            "kilometraje_inicio": self._kilometraje_inicio,
            "kilometraje_fin": self._kilometraje_fin,
            "monto_total": self._monto_total,
            "estado": self._estado.value
        }
