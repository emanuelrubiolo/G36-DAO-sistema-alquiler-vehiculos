from .base import EntidadBase
from ..enums.estados import EstadoVehiculo
from typing import Optional, Dict

class Vehiculo(EntidadBase):
    """
    Clase base para vehículos.
    Demuestra HERENCIA y POLIMORFISMO.
    """
    def __init__(self, marca: str, modelo: str, anio: int,
                 patente: str, tipo_combustible: str, 
                 kilometraje: float, precio_dia: float,
                 id: Optional[int] = None):
        super().__init__(id)
        self._marca = marca
        self._modelo = modelo
        self._anio = anio
        self._patente = patente
        self._tipo_combustible = tipo_combustible
        self._kilometraje = kilometraje
        self._precio_dia = precio_dia
        self._estado = EstadoVehiculo.DISPONIBLE
    
    @property
    def estado(self) -> EstadoVehiculo:
        return self._estado
    
    @property
    def precio_dia(self) -> float:
        return self._precio_dia
    
    def cambiar_estado(self, nuevo_estado: EstadoVehiculo):
        """Encapsula la lógica de cambio de estado"""
        self._estado = nuevo_estado
    
    def esta_disponible(self) -> bool:
        """Método de consulta encapsulado"""
        return self._estado == EstadoVehiculo.DISPONIBLE
    
    def validar(self) -> bool:
        return (self._marca and self._modelo and 
                self._patente and self._precio_dia > 0)
    
    # POLIMORFISMO: Este método puede ser sobrescrito por subclases
    def calcular_costo_alquiler(self, dias: int) -> float:
        """Calcula el costo base del alquiler"""
        return self._precio_dia * dias
    
    def to_dict(self) -> Dict:
        return {
            "id": self._id,
            "marca": self._marca,
            "modelo": self._modelo,
            "anio": self._anio,
            "patente": self._patente,
            "tipo_combustible": self._tipo_combustible,
            "kilometraje": self._kilometraje,
            "precio_dia": self._precio_dia,
            "estado": self._estado.value
        }


class VehiculoLujo(Vehiculo):
    """
    HERENCIA: Especialización de Vehículo para autos de lujo.
    POLIMORFISMO: Sobrescribe el cálculo de costo.
    """
    def __init__(self, *args, incluye_chofer: bool = False, **kwargs):
        super().__init__(*args, **kwargs)
        self._incluye_chofer = incluye_chofer
    
    # POLIMORFISMO: Implementación específica del método heredado
    def calcular_costo_alquiler(self, dias: int) -> float:
        """Vehículos de lujo tienen un recargo del 50%"""
        costo_base = super().calcular_costo_alquiler(dias)
        recargo = costo_base * 0.5
        if self._incluye_chofer:
            recargo += 5000 * dias
        return costo_base + recargo


class VehiculoUtilitario(Vehiculo):
    """
    HERENCIA: Especialización para vehículos utilitarios.
    """
    def __init__(self, *args, capacidad_carga: float, **kwargs):
        super().__init__(*args, **kwargs)
        self._capacidad_carga = capacidad_carga
    
    # POLIMORFISMO: Implementación específica
    def calcular_costo_alquiler(self, dias: int) -> float:
        """Vehículos utilitarios cobran por capacidad de carga"""
        costo_base = super().calcular_costo_alquiler(dias)
        if self._capacidad_carga > 1000:
            costo_base *= 1.3
        return costo_base
