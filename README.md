# 🛒 Ventas Inteligentes

Sistema de recomendación inteligente para e-commerce con agente IA que predice productos de interés para consumidores con al menos 80% de efectividad.

## 📋 Descripción del Proyecto

**Problema:** La indecisión sobre productos de interés para los usuarios que impiden concretar una venta de forma sencilla.

**Solución:** Sistema completo de e-commerce con:
- 🤖 Agente inteligente de recomendaciones (80%+ precisión)
- 🎨 UI intuitiva y responsiva
- 🛒 Carrito de compras inteligente
- 💬 Chatbot asistente
- 📊 Panel de analítica

## 🏗️ Arquitectura

Este proyecto utiliza una arquitectura **monorepo** con tres servicios principales:

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend API:** Node.js + Express + TypeScript + Prisma
- **Servicio IA:** Python + FastAPI + Scikit-learn
- **Base de Datos:** PostgreSQL + Redis

## 🚀 Inicio Rápido

### Prerrequisitos

- **Docker y Docker Compose** (solo necesitas esto)
- Node.js 20+ y Python 3.11+ (solo si desarrollas localmente sin Docker)

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd ventas-inteligentes
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. **Instalar dependencias**
```bash
npm run setup
```

4. **Iniciar TODO con Docker Compose** ⭐ (Forma estándar en empresas)
```bash
# Un solo comando inicia TODO: PostgreSQL, Redis, Backend, Frontend y AI Service
npm run docker:up:all

# O en segundo plano:
npm run docker:up
```

**¡Eso es todo!** El proyecto estará disponible en:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- AI Service: http://localhost:8000

5. **Configuración inicial** (solo primera vez, después de que los servicios estén corriendo)
```bash
# Ejecutar migraciones de base de datos
cd backend
npx prisma migrate dev
npx prisma generate
cd ..

# Crear usuario admin y productos de ejemplo
npm run create-admin
npm run import-products -- 6
```

---

### Alternativa: Desarrollo Local (solo si prefieres ejecutar Node/Python localmente)

```bash
# 1. Solo infraestructura con Docker (PostgreSQL y Redis)
npm run docker:up

# 2. Servicios de aplicación localmente
npm run dev  # Inicia frontend, backend y AI service
```

## 📁 Estructura del Proyecto

```
ventas-inteligentes/
├── frontend/          # Aplicación React
├── backend/           # API Node.js
├── ai-service/        # Servicio de IA Python
├── docker/            # Configuración Docker
├── docs/              # Documentación
└── scripts/           # Scripts de utilidad
```

Ver [ESTRUCTURA_PROYECTO.md](./ESTRUCTURA_PROYECTO.md) para detalles completos.

## 🛠️ Scripts Disponibles

### ⭐ Docker Compose (Forma Estándar en Empresas)
- `npm run docker:up:all` - **Inicia TODO** (PostgreSQL, Redis, Backend, Frontend, AI) - **UN SOLO COMANDO**
- `npm run docker:up` - Inicia servicios en segundo plano
- `npm run docker:down` - Detiene todos los servicios
- `npm run docker:logs` - Ver logs de todos los servicios
- `npm run docker:build` - Reconstruir imágenes Docker

### Desarrollo Local (Alternativa)
- `npm run docker:up` - Solo infraestructura (PostgreSQL y Redis)
- `npm run dev` - Inicia frontend, backend y servicio de IA localmente
- `npm run dev:frontend` - Solo frontend
- `npm run dev:backend` - Solo backend
- `npm run dev:ai` - Solo servicio de IA

### Utilidades
- `npm run create-admin` - Crea usuario admin por defecto
- `npm run import-products` - Importa productos de ejemplo
- `npm run train:ai` - Entrena el modelo de IA manualmente
- `npm run build` - Build de producción

## 📊 Requisitos del Proyecto

### Funcionales
- ✅ Registro e inicio de sesión
- ✅ Recomendación de productos inteligentes (80%+ precisión)
- ✅ Carrito inteligente de compras
- ✅ Panel de analítica de ventas
- ✅ Chatbot asistente de compra
- ✅ Gestión de inventario
- ✅ Filtrado dinámico de productos
- ✅ Pagos integrados y seguros
- ✅ Sistema de retroalimentación
- ✅ Notificaciones de comportamiento

### No Funcionales
- Disponibilidad 99%
- Tiempo de respuesta ≤ 3 segundos
- Seguridad SSL/TLS
- Escalabilidad 10,000 usuarios concurrentes
- Interfaz responsiva e intuitiva

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test

# AI Service
cd ai-service
pytest
```

## 📅 Fechas Importantes

- **Frontend (límite):** 3/11/2025
- **Primeras pruebas:** 6/10/2025
- **Segundas pruebas:** 18/10/2025
- **Entrega final:** 1/12/2025

## 👥 Equipo

- **Gerente del Proyecto:** Nicolas Gutierrez
- **Responsable:** Andres Felipe Rojas

## 📝 Licencia

MIT License - Ver [LICENSE](./LICENSE)

## 🔗 Documentación Adicional

- [Recomendaciones de Implementación](./RECOMENDACIONES_IMPLEMENTACION.md)
- [Estructura del Proyecto](./ESTRUCTURA_PROYECTO.md)

