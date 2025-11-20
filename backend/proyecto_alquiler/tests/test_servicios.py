from src.repositorios.cliente_repositorio import RepositorioClientes
from src.servicios.cliente_servicio import ServicioClientes
from src.enums.estados import EstadoCliente


def test_servicio_clientes_create_get_and_change_state():
    repo = RepositorioClientes()
    servicio = ServicioClientes(repo)

    datos = {
        "nombre": "María",
        "apellido": "Lopez",
        "dni": "55667788",
        "email": "maria@example.com",
        "telefono": "666777888",
        "direccion": "Paseo 9"
    }

    creado = servicio.crear_cliente(datos)
    assert creado.id == 1

    obtenido = servicio.obtener_cliente(1)
    assert obtenido is not None
    assert obtenido.to_dict()["nombre"] == "María"

    servicio.cambiar_estado_cliente(1, activar=False)
    assert obtenido.estado.value == "inactivo"
