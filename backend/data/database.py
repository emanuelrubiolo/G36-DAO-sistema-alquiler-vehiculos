import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from .config import settings

#Certificados
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CERTS_DIR = os.path.join(BASE_DIR, "certificados")

ssl_args = {
    "ssl": {
        "ca": os.path.join(CERTS_DIR, "server-ca.pem"),
        "cert": os.path.join(CERTS_DIR, "client-cert.pem"),
        "key": os.path.join(CERTS_DIR, "client-key.pem")
    }
}

# CONEXIÓN SEGURA SSL
engine = create_engine(
    settings.DATABASE_URL,
    connect_args=ssl_args,
    pool_pre_ping=True
)

# --- OPCIÓN B: CONEXIÓN ESTÁNDAR
# engine = create_engine(
#     settings.DATABASE_URL,
#     pool_pre_ping=True
# )

# 4. Crear la Sesión (SessionLocal)
# Esta es la fábrica que creará sesiones para cada petición
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 5. Crear la Clase Base
# Todos tus modelos (Usuario, Vehiculo, etc.) heredarán de esta clase
Base = DeclarativeBase()
#https://medium.com/towards-data-engineering/fastapi-with-sql-1c7852ccbf21

# 6. Dependencia para obtener la DB (Para usar en los Routers)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()