"""
Script para probar el entrenamiento del modelo directamente.
"""
import os
import sys
from pathlib import Path

# Configurar encoding
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Agregar directorio al path
sys.path.insert(0, str(Path(__file__).parent))

# Crear .env si no existe
env_path = Path(__file__).parent / '.env'
if not env_path.exists():
    print("[INFO] Creando archivo .env...")
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

# Cargar variables de entorno
from dotenv import load_dotenv
load_dotenv()

print("[INFO] Iniciando prueba de entrenamiento...")
print("[INFO] Conectando a la base de datos...")

try:
    from app.services.recommendation_service import RecommendationService
    
    service = RecommendationService()
    print("[OK] Servicio inicializado")
    
    print("[INFO] Entrenando modelo...")
    service.train()
    
    print("[OK] Modelo entrenado exitosamente!")
    
    # Evaluar precisión
    accuracy = service.evaluate_accuracy()
    accuracy_percent = accuracy * 100
    print(f"[OK] Precisión del modelo: {accuracy_percent:.2f}%")
    print(f"[OK] Objetivo alcanzado (80%): {'SI' if accuracy >= 0.80 else 'NO'}")
    
except Exception as e:
    print(f"[ERROR] Error durante el entrenamiento: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

