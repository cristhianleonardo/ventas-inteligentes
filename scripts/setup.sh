#!/bin/bash

echo "🚀 Configurando proyecto Ventas Inteligentes..."

# Instalar dependencias root
echo "📦 Instalando dependencias root..."
npm install

# Instalar dependencias frontend
echo "📦 Instalando dependencias frontend..."
cd frontend
npm install
cd ..

# Instalar dependencias backend
echo "📦 Instalando dependencias backend..."
cd backend
npm install
cd ..

# Instalar dependencias Python
echo "📦 Instalando dependencias Python..."
cd ai-service
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..

echo "✅ Configuración completada!"
echo ""
echo "Próximos pasos:"
echo "1. Configurar .env con tus variables de entorno"
echo "2. Iniciar Docker: npm run docker:up"
echo "3. Ejecutar migraciones: cd backend && npx prisma migrate dev"
echo "4. Iniciar desarrollo: npm run dev"

