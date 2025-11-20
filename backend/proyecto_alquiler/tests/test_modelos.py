from src.modelos.cliente import Cliente


def test_cliente_validacion_y_estado():
    c = Cliente(
        nombre="Ana",
        apellido="Gómez",
        dni="87654321",
        email="ana@example.com",
        telefono="0987654321",
        direccion="Av. Siempre Viva 742"
    )

    assert c.validar() is True
    d = c.to_dict()
    assert d["nombre"] == "Ana"
    assert d["estado"] == "activo"

    c.desactivar()
    assert c.estado.value == "inactivo"
    assert c.to_dict()["estado"] == "inactivo"
