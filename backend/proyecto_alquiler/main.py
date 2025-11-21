"""
Punto de entrada - Inicializa el sistema de ejemplo.

Ejecutar desde `backend/proyecto_alquiler` con: `python main.py`
"""

if __name__ == "__main__":
    print("=== SISTEMA DE ALQUILER DE VEHÍCULOS ===")
    print("Estructura modular aplicando POO\n")
    
    # Inicializar repositorios
    from src.repositorios.cliente_repositorio import RepositorioClientes
    repo_clientes = RepositorioClientes()
    
    # Inicializar servicios
    from src.servicios.cliente_servicio import ServicioClientes
    servicio_clientes = ServicioClientes(repo_clientes)
    
    # Inicializar controladores
    from src.controladores.cliente_controlador import ControladorClientes
    ctrl_clientes = ControladorClientes(servicio_clientes)
    
    # Simular petición POST /clientes
    print("POST /clientes")
    respuesta = ctrl_clientes.post_cliente({
        "nombre": "Juan",
        "apellido": "Pérez",
        "dni": "12345678",
        "email": "juan@email.com",
        "telefono": "1234567890",
        "direccion": "Calle Falsa 123"
    })
    print(f"Response: {respuesta}\n")
    
    # Simular petición GET /clientes
    print("GET /clientes")
    respuesta = ctrl_clientes.get_clientes()
    print(f"Response: {respuesta}\n")
    
