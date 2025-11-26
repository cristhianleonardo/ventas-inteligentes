// Necesita ejecutarse desde el directorio backend
const path = require('path');
process.chdir(path.join(__dirname, '..', 'backend'));

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = 'admin@ventas.com';
    const password = 'admin123';
    const name = 'Administrador';

    // Verificar si ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('✅ El usuario admin ya existe');
      if (existingUser.role !== 'admin') {
        // Actualizar a admin si no lo es
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: 'admin' },
        });
        console.log('✅ Usuario actualizado a rol admin');
      }
      return;
    }

    // Crear admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'admin',
      },
    });

    console.log('✅ Usuario admin creado exitosamente!');
    console.log('📧 Email:', email);
    console.log('🔑 Contraseña:', password);
    console.log('👤 Nombre:', name);
  } catch (error) {
    console.error('❌ Error al crear admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

