# 🏗️ Arquitectura del Sistema

## Visión General

Ventas Inteligentes utiliza una arquitectura **monorepo** con tres servicios principales que se comunican entre sí:

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│   Frontend      │  React + TypeScript
│   (Puerto 3000) │
└────────┬────────┘
         │
         │ HTTP/REST
         ▼
┌─────────────────┐
│   Backend API   │  Node.js + Express
│   (Puerto 3001) │
└────────┬────────┘
         │
    ┌────┴────┐
    │        │
    ▼        ▼
┌────────┐ ┌──────────────┐
│Postgres│ │ AI Service   │  Python + FastAPI
│   DB   │ │ (Puerto 8000)│
└────────┘ └──────┬───────┘
         │        │
         └───┬────┘
             │
             ▼
         ┌───────┐
         │ Redis │  Caché
         └───────┘
```

## Componentes Principales

### 1. Frontend (React + TypeScript)

**Tecnologías:**
- React 18+ con TypeScript
- Vite (build tool)
- Tailwind CSS (estilos)
- React Query (gestión de estado del servidor)
- Zustand (estado global)
- React Router (navegación)

**Responsabilidades:**
- Interfaz de usuario
- Gestión de estado del cliente
- Comunicación con Backend API
- Renderizado responsivo

### 2. Backend API (Node.js + Express)

**Tecnologías:**
- Node.js 20+ con TypeScript
- Express (framework web)
- Prisma (ORM)
- JWT (autenticación)
- PostgreSQL (base de datos)
- Redis (caché)

**Responsabilidades:**
- API REST para todas las operaciones
- Autenticación y autorización
- Gestión de usuarios, productos, carrito, órdenes
- Comunicación con AI Service
- Validación de datos
- Logging y manejo de errores

**Endpoints Principales:**
- `/api/auth/*` - Autenticación
- `/api/users/*` - Gestión de usuarios
- `/api/products/*` - Catálogo de productos
- `/api/cart/*` - Carrito de compras
- `/api/orders/*` - Órdenes de compra

### 3. AI Service (Python + FastAPI)

**Tecnologías:**
- Python 3.11+
- FastAPI (framework web)
- Scikit-learn (modelos ML)
- Pandas (procesamiento de datos)
- Redis (caché de recomendaciones)

**Responsabilidades:**
- Generar recomendaciones personalizadas
- Entrenar modelos de ML
- Calcular similitud entre productos
- Alcanzar 80%+ de precisión

**Endpoints:**
- `/api/recommendations/{user_id}` - Recomendaciones para usuario
- `/api/recommendations/product/{product_id}` - Productos similares
- `/api/recommendations/train` - Entrenar modelo

### 4. Base de Datos (PostgreSQL)

**Esquema Principal:**
- `User` - Usuarios del sistema
- `Product` - Catálogo de productos
- `Cart` / `CartItem` - Carrito de compras
- `Order` / `OrderItem` - Órdenes de compra
- `Review` - Reseñas de productos

### 5. Caché (Redis)

**Uso:**
- Sesiones de usuario
- Recomendaciones en caché
- Productos populares
- Resultados de búsqueda

## Flujo de Datos

### Flujo de Recomendaciones

1. Usuario navega por productos
2. Frontend envía datos de comportamiento a Backend
3. Backend almacena interacciones en PostgreSQL
4. Backend solicita recomendaciones a AI Service
5. AI Service calcula recomendaciones (usa caché si está disponible)
6. AI Service retorna productos recomendados
7. Backend retorna recomendaciones a Frontend
8. Frontend muestra productos recomendados

### Flujo de Compra

1. Usuario agrega productos al carrito
2. Frontend actualiza carrito en Backend
3. Backend guarda carrito en PostgreSQL
4. Usuario procede al checkout
5. Backend crea orden
6. Backend procesa pago (integración futura)
7. Backend actualiza inventario
8. Backend envía confirmación

## Seguridad

- **Autenticación:** JWT tokens
- **Autorización:** Roles (user, admin)
- **Validación:** Zod schemas
- **Cifrado:** HTTPS en producción
- **Protección:** CORS configurado
- **Sanitización:** Validación de inputs

## Escalabilidad

- **Horizontal:** Servicios independientes pueden escalar por separado
- **Caché:** Redis reduce carga en BD y AI Service
- **Base de datos:** Índices optimizados en Prisma
- **Load balancing:** Preparado para múltiples instancias

## Monitoreo

- **Logging:** Winston (Backend), FastAPI logs (AI Service)
- **Health checks:** `/health` en cada servicio
- **Métricas:** Preparado para integración con APM

## Deployment

- **Docker:** Contenedores para cada servicio
- **Docker Compose:** Orquestación local
- **Producción:** Preparado para Kubernetes/Docker Swarm

