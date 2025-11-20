import sys
import os

# Asegurar que el paquete `src` del proyecto está en sys.path para las pruebas
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SRC = os.path.join(ROOT, "src")
if SRC not in sys.path:
    sys.path.insert(0, SRC)
