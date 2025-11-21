from fastapi import FastAPI
from src.repositorios.cliente_repositorio import RepositorioClientes
from src.servicios.cliente_servicio import ServicioClientes
from src.controladores.cliente_controlador import ControladorClientes

repo_clientes = RepositorioClientes()
servicio_clientes = ServicioClientes(repo_clientes)
ctrl_clientes = ControladorClientes(servicio_clientes)

app = FastAPI(title="Sistema de Alquiler de Vehículos")

@app.get("/")
async def root():
    return {"msg": "API running"}

@app.get("/clientes")
async def get_clientes():
    return ctrl_clientes.get_clientes()

@app.post("/clientes")
async def post_cliente(cliente: dict):
    return ctrl_clientes.post_cliente(cliente)