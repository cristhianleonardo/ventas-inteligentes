"""
Script para iniciar el servicio de IA con verificación de configuración.
"""
import os
import sys
from pathlib import Path

# Agregar el directorio actual al path
sys.path.insert(0, str(Path(__file__).parent))

# Configurar encoding UTF-8 para Windows
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Verificar que existe .env
env_path = Path(__file__).parent / '.env'
if not env_path.exists():
    print("[!] Archivo .env no encontrado. Creando...")
    env_content = """# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=ventas_user
POSTGRES_PASSWORD=ventas_password
POSTGRES_DB=ventas_inteligentes
DATABASE_URL=postgresql://ventas_user:ventas_password@localhost:5432/ventas_inteligentes

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AI Service
AI_SERVICE_PORT=8000

# Environment
ENVIRONMENT=development
"""
    with open(env_path, 'w', encoding='utf-8') as f:
        f.write(env_content)
    print("[OK] Archivo .env creado")

# Cargar variables de entorno
from dotenv import load_dotenv
load_dotenv()

# Verificar dependencias
try:
    import psycopg2
    import pandas
    import numpy
    import sklearn
    print("[OK] Dependencias verificadas")
except ImportError as e:
    print(f"[ERROR] Falta la dependencia: {e}")
    print("[INFO] Ejecuta: pip install -r requirements.txt")
    sys.exit(1)

# Iniciar servidor
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AI_SERVICE_PORT", 8000))
    print(f"[INFO] Iniciando servicio de IA en puerto {port}...")
    print(f"[INFO] Health check: http://localhost:{port}/health")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)

