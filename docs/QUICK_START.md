# 🚀 Guía de Inicio Rápido

## Instalación y Configuración

### 1. Prerrequisitos

Asegúrate de tener instalado:
- **Node.js 20+** y npm
- **Python 3.11+** y pip
- **Docker** y Docker Compose
- **Git**

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en este ejemplo:

```env
# Database
POSTGRES_USER=ventas_user
POSTGRES_PASSWORD=ventas_password
POSTGRES_DB=ventas_inteligentes
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Backend API
BACKEND_PORT=3001
BACKEND_URL=http://localhost:3001
JWT_SECRET=tu-clave-secreta-super-segura-cambiar-en-produccion
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_PORT=3000
FRONTEND_URL=http://localhost:3000

# AI Service
AI_SERVICE_PORT=8000
AI_SERVICE_URL=http://localhost:8000

# Environment
NODE_ENV=development
```

### 3. Instalar Dependencias

```bash
# Instalar dependencias de todos los servicios
npm run setup

# O manualmente:
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
cd ai-service && pip install -r requirements.txt && cd ..
```

### 4. Iniciar Servicios con Docker

```bash
# Iniciar PostgreSQL y Redis
npm run docker:up

# Ver logs
npm run docker:logs

# Detener servicios
npm run docker:down
```

### 5. Configurar Base de Datos

```bash
cd backend

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) Abrir Prisma Studio para ver datos
npx prisma studio
```

### 6. Iniciar Desarrollo

```bash
# Desde la raíz, iniciar todo
npm run dev

# O por separado:

# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend

# Terminal 3: AI Service
cd ai-service
python -m uvicorn app.main:app --reload --port 8000
```

### 7. Acceder a los Servicios

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **AI Service:** http://localhost:8000
- **API Docs (AI):** http://localhost:8000/docs
- **Prisma Studio:** http://localhost:5555 (si está corriendo)

## Estructura de Desarrollo

### Backend (Node.js + Express)

```
backend/
├── src/
│   ├── controllers/    # Lógica de negocio
│   ├── routes/         # Rutas de API
│   ├── middleware/     # Auth, validación, etc.
│   └── utils/          # Utilidades
└── prisma/
    └── schema.prisma   # Esquema de BD
```

### Frontend (React + TypeScript)

```
frontend/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/          # Páginas principales
│   ├── services/       # Llamadas a API
│   └── store/          # Estado global
```

### AI Service (Python + FastAPI)

```
ai-service/
├── app/
│   ├── main.py                    # Entry point
│   └── services/
│       └── recommendation_service.py
├── data/                          # Datasets
└── trained_models/                # Modelos entrenados
```

## Comandos Útiles

```bash
# Desarrollo
npm run dev              # Inicia frontend + backend
npm run dev:frontend     # Solo frontend
npm run dev:backend      # Solo backend

# Docker
npm run docker:up        # Iniciar servicios
npm run docker:down      # Detener servicios
npm run docker:logs      # Ver logs

# Base de datos
cd backend
npx prisma migrate dev   # Crear migración
npx prisma generate      # Generar cliente
npx prisma studio        # Abrir interfaz visual

# Build
npm run build            # Build de producción
```

## Próximos Pasos

1. ✅ Completar implementación de controladores con Prisma
2. ✅ Conectar frontend con backend API
3. ✅ Implementar modelo de IA real
4. ✅ Agregar autenticación completa
5. ✅ Implementar carrito de compras
6. ✅ Integrar recomendaciones en UI

## Solución de Problemas

### Error: Puerto en uso
```bash
# Cambiar puerto en .env o matar proceso
# Windows: netstat -ano | findstr :3000
# Linux/Mac: lsof -ti:3000 | xargs kill
```

### Error: Prisma no encuentra BD
```bash
# Verificar que Docker esté corriendo
npm run docker:up

# Verificar variables de entorno en .env
# DATABASE_URL debe estar configurado
```

### Error: Módulos no encontrados
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

