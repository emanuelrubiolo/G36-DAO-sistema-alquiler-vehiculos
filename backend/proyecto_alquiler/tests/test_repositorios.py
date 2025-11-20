from src.repositorios.cliente_repositorio import RepositorioClientes
from src.modelos.cliente import Cliente
from src.enums.estados import EstadoCliente


def test_repositorio_clientes_create_and_filter():
    repo = RepositorioClientes()
    cliente = Cliente(
        nombre="Luis",
        apellido="Martínez",
        dni="11223344",
        email="luis@example.com",
        telefono="5551234",
        direccion="Calle 1"
    )

    creado = repo.crear(cliente)
    assert creado.id == 1

    todos = repo.listar_todos()
    assert len(todos) == 1

    activos = repo.filtrar_por_estado(EstadoCliente.ACTIVO)
    assert len(activos) == 1

    # Cambiar estado y volver a filtrar
    creado.desactivar()
    inactivos = repo.filtrar_por_estado(EstadoCliente.INACTIVO)
    assert len(inactivos) == 1
