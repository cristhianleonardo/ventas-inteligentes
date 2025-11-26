#!/bin/sh
set -e

echo "⏳ Esperando a que PostgreSQL esté listo..."

# Esperar hasta que PostgreSQL esté listo
MAX_ATTEMPTS=30
ATTEMPT=0
until pg_isready -h "${POSTGRES_HOST:-postgres}" -p "${POSTGRES_PORT:-5432}" -U "${POSTGRES_USER:-ventas_user}" 2>/dev/null; do
  ATTEMPT=$((ATTEMPT + 1))
  if [ $ATTEMPT -ge $MAX_ATTEMPTS ]; then
    echo "❌ PostgreSQL no está disponible después de $MAX_ATTEMPTS intentos"
    exit 1
  fi
  echo "PostgreSQL no está listo aún, esperando... (intento $ATTEMPT/$MAX_ATTEMPTS)"
  sleep 2
done

echo "✅ PostgreSQL está listo"

echo "🔄 Generando Prisma Client..."
npx prisma generate

echo "🔄 Ejecutando migraciones de Prisma..."
npx prisma migrate deploy || echo "⚠️  Las migraciones ya están aplicadas o hubo un error"

echo "🚀 Iniciando servidor backend..."
exec "$@"

