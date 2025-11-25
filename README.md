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

- Node.js 20+
- Python 3.11+
- Docker y Docker Compose
- PostgreSQL 15+ (o usar Docker)
- Redis (o usar Docker)

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

4. **Iniciar servicios con Docker**
```bash
npm run docker:up
```

5. **Ejecutar migraciones de base de datos**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

6. **Iniciar servicios en desarrollo**
```bash
# Desde la raíz del proyecto
npm run dev

# O por separado:
npm run dev:frontend  # Frontend en http://localhost:3000
npm run dev:backend   # Backend en http://localhost:3001
# AI Service: python -m uvicorn ai-service.app.main:app --reload --port 8000
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

- `npm run dev` - Inicia frontend y backend en desarrollo
- `npm run dev:frontend` - Solo frontend
- `npm run dev:backend` - Solo backend
- `npm run build` - Build de producción
- `npm run docker:up` - Inicia servicios Docker
- `npm run docker:down` - Detiene servicios Docker

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

