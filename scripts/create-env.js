const fs = require('fs');
const path = require('path');

// Contenido del .env raíz
const rootEnv = `# Database
POSTGRES_USER=ventas_user
POSTGRES_PASSWORD=ventas_password
POSTGRES_DB=ventas_inteligentes
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
DATABASE_URL=postgresql://ventas_user:ventas_password@localhost:5432/ventas_inteligentes?schema=public

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Backend API
BACKEND_PORT=3001
BACKEND_URL=http://localhost:3001
JWT_SECRET=tu-clave-secreta-super-segura-cambiar-en-produccion-2025
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_PORT=3000
FRONTEND_URL=http://localhost:3000

# AI Service
AI_SERVICE_PORT=8000
AI_SERVICE_URL=http://localhost:8000

# Environment
NODE_ENV=development
`;

// Contenido del .env frontend
const frontendEnv = `VITE_API_URL=http://localhost:3001/api
VITE_AI_SERVICE_URL=http://localhost:8000
`;

// Contenido del .env backend
const backendEnv = `# Database
DATABASE_URL=postgresql://ventas_user:ventas_password@localhost:5432/ventas_inteligentes?schema=public

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Backend API
BACKEND_PORT=3001
JWT_SECRET=tu-clave-secreta-super-segura-cambiar-en-produccion-2025
JWT_EXPIRES_IN=7d

# AI Service
AI_SERVICE_URL=http://localhost:8000

# Environment
NODE_ENV=development
`;

// Contenido del .env ai-service
const aiServiceEnv = `# Database
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
`;

// Crear archivos
const files = [
  { path: path.join(__dirname, '..', '.env'), content: rootEnv },
  { path: path.join(__dirname, '..', 'frontend', '.env'), content: frontendEnv },
  { path: path.join(__dirname, '..', 'backend', '.env'), content: backendEnv },
  { path: path.join(__dirname, '..', 'ai-service', '.env'), content: aiServiceEnv },
];

files.forEach(({ path: filePath, content }) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Creado: ${filePath}`);
  } else {
    console.log(`⚠️  Ya existe: ${filePath}`);
  }
});

console.log('\n✨ Archivos .env creados exitosamente!');

