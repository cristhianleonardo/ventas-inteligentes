# 🚀 Comandos para Ejecutar el Proyecto

## ⚡ Inicio Rápido

### 1. Crear archivos .env

**Crea `.env` en la raíz:**
```env
POSTGRES_USER=ventas_user
POSTGRES_PASSWORD=ventas_password
POSTGRES_DB=ventas_inteligentes
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
DATABASE_URL=postgresql://ventas_user:ventas_password@localhost:5432/ventas_inteligentes?schema=public
REDIS_HOST=localhost
REDIS_PORT=6379
BACKEND_PORT=3001
BACKEND_URL=http://localhost:3001
JWT_SECRET=tu-clave-secreta-super-segura-cambiar-en-produccion-2025
JWT_EXPIRES_IN=7d
FRONTEND_PORT=3000
FRONTEND_URL=http://localhost:3000
AI_SERVICE_PORT=8000
AI_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

**Crea `frontend/.env`:**
```env
VITE_API_URL=http://localhost:3001/api
VITE_AI_SERVICE_URL=http://localhost:8000
```

**Crea `backend/.env`:**
```env
DATABASE_URL=postgresql://ventas_user:ventas_password@localhost:5432/ventas_inteligentes?schema=public
REDIS_HOST=localhost
REDIS_PORT=6379
BACKEND_PORT=3001
JWT_SECRET=tu-clave-secreta-super-segura-cambiar-en-produccion-2025
JWT_EXPIRES_IN=7d
AI_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

### 2. Instalar dependencias
```bash
npm run setup
```

### 3. Iniciar base de datos (Docker)
```bash
npm run docker:up
```

### 4. Configurar base de datos
```bash
cd backend
npx prisma generate
npx prisma migrate dev
cd ..
```

### 5. Ejecutar todo
```bash
npm run dev
```

---

## 📍 URLs

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001
- **AI Service:** http://localhost:8000
- **Prisma Studio:** `cd backend && npx prisma studio`

---

## 🔧 Comandos Útiles

```bash
# Ver logs de Docker
npm run docker:logs

# Detener Docker
npm run docker:down

# Solo backend
npm run dev:backend

# Solo frontend
npm run dev:frontend
```

