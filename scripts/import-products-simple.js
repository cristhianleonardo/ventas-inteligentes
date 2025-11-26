/**
 * Script simple para importar productos desde una URL
 * Ejecutar desde Node.js: node scripts/import-products-simple.js
 */

const axios = require('axios');
const readline = require('readline');

const API_URL = 'http://localhost:3001/api';

// Productos de ejemplo para diferentes categorías
const SAMPLE_PRODUCTS = {
  electronics: [
    { name: 'iPhone 15 Pro', description: 'Smartphone de última generación con cámara profesional', price: 999.99, category: 'electronics', stock: 50, imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500' },
    { name: 'Samsung Galaxy S24', description: 'Teléfono Android premium con pantalla AMOLED', price: 899.99, category: 'electronics', stock: 45, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa5?w=500' },
    { name: 'MacBook Pro 16"', description: 'Laptop profesional Apple con chip M3', price: 2499.99, category: 'electronics', stock: 30, imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52-6b5732ac2d7?w=500' },
    { name: 'AirPods Pro', description: 'Audífonos inalámbricos con cancelación de ruido activa', price: 249.99, category: 'electronics', stock: 100, imageUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500' },
    { name: 'iPad Air', description: 'Tablet versátil y potente para trabajo y entretenimiento', price: 599.99, category: 'electronics', stock: 60, imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500' },
    { name: 'Sony WH-1000XM5', description: 'Audífonos over-ear con cancelación de ruido líder', price: 399.99, category: 'electronics', stock: 40, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' },
    { name: 'Nintendo Switch OLED', description: 'Consola de videojuegos portátil y de sobremesa', price: 349.99, category: 'electronics', stock: 55, imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500' },
    { name: 'Samsung 4K Smart TV 55"', description: 'Televisor inteligente con resolución 4K UHD', price: 699.99, category: 'electronics', stock: 25, imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500' },
    { name: 'PlayStation 5', description: 'Consola de videojuegos de última generación', price: 499.99, category: 'electronics', stock: 35, imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500' },
    { name: 'Xbox Series X', description: 'Consola de Microsoft con potencia de 12 TFLOPS', price: 499.99, category: 'electronics', stock: 30, imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500' },
    { name: 'Apple Watch Series 9', description: 'Reloj inteligente con GPS y monitor de salud', price: 399.99, category: 'electronics', stock: 70, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' },
    { name: 'GoPro Hero 12', description: 'Cámara de acción 4K resistente al agua', price: 449.99, category: 'electronics', stock: 45, imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244b32a?w=500' },
    { name: 'DJI Mini 4 Pro', description: 'Drone con cámara 4K y estabilización', price: 1099.99, category: 'electronics', stock: 20, imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500' },
    { name: 'Kindle Paperwhite', description: 'Lector de libros electrónicos con pantalla iluminada', price: 139.99, category: 'electronics', stock: 80, imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500' },
    { name: 'Logitech MX Master 3S', description: 'Mouse inalámbrico ergonómico para productividad', price: 99.99, category: 'electronics', stock: 90, imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500' },
  ],
  clothing: [
    { name: 'Camiseta Básica Algodón', description: 'Camiseta 100% algodón, cómoda y versátil', price: 19.99, category: 'clothing', stock: 200, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500' },
    { name: 'Jeans Clásicos', description: 'Pantalón vaquero de corte clásico y ajustado', price: 49.99, category: 'clothing', stock: 150, imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500' },
    { name: 'Zapatillas Deportivas', description: 'Zapatillas cómodas para running y ejercicio', price: 79.99, category: 'clothing', stock: 120, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' },
    { name: 'Chaqueta Impermeable', description: 'Chaqueta resistente al agua y viento', price: 89.99, category: 'clothing', stock: 80, imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500' },
    { name: 'Vestido Casual', description: 'Vestido cómodo para el día a día', price: 39.99, category: 'clothing', stock: 90, imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500' },
    { name: 'Sudadera con Capucha', description: 'Sudadera cómoda con capucha y bolsillo', price: 59.99, category: 'clothing', stock: 110, imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500' },
    { name: 'Pantalón Deportivo', description: 'Pantalón de entrenamiento transpirable', price: 44.99, category: 'clothing', stock: 95, imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500' },
    { name: 'Camisa Formal', description: 'Camisa de vestir elegante para ocasiones formales', price: 69.99, category: 'clothing', stock: 75, imageUrl: 'https://images.unsplash.com/photo-1596755094514-87c7c49e0c0b?w=500' },
    { name: 'Abrigo de Invierno', description: 'Abrigo cálido para temporada de frío', price: 129.99, category: 'clothing', stock: 60, imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500' },
    { name: 'Shorts Deportivos', description: 'Shorts ligeros para ejercicio y verano', price: 29.99, category: 'clothing', stock: 130, imageUrl: 'https://images.unsplash.com/photo-1506629905607-0c0c0a5b0b0b?w=500' },
    { name: 'Blusa Elegante', description: 'Blusa femenina para ocasiones especiales', price: 54.99, category: 'clothing', stock: 85, imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500' },
    { name: 'Traje de Baño', description: 'Bikini de dos piezas resistente al cloro', price: 39.99, category: 'clothing', stock: 100, imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500' },
    { name: 'Gorra Deportiva', description: 'Gorra ajustable con protección UV', price: 24.99, category: 'clothing', stock: 140, imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500' },
    { name: 'Bufanda de Lana', description: 'Bufanda cálida de lana merino', price: 34.99, category: 'clothing', stock: 105, imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500' },
    { name: 'Cinturón de Cuero', description: 'Cinturón elegante de cuero genuino', price: 49.99, category: 'clothing', stock: 70, imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=500' },
  ],
  books: [
    { name: 'El Código Da Vinci', description: 'Novela de misterio y suspenso de Dan Brown', price: 14.99, category: 'books', stock: 75, imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500' },
    { name: 'Cien Años de Soledad', description: 'Clásico de la literatura latinoamericana de García Márquez', price: 16.99, category: 'books', stock: 60, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500' },
    { name: 'Harry Potter y la Piedra Filosofal', description: 'Primera entrega de la saga mágica', price: 12.99, category: 'books', stock: 100, imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500' },
    { name: '1984', description: 'Novela distópica de George Orwell sobre control totalitario', price: 13.99, category: 'books', stock: 55, imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500' },
    { name: 'El Principito', description: 'Cuento filosófico para todas las edades de Saint-Exupéry', price: 10.99, category: 'books', stock: 120, imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500' },
    { name: 'Don Quijote de la Mancha', description: 'Obra maestra de la literatura española', price: 18.99, category: 'books', stock: 50, imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500' },
    { name: 'El Señor de los Anillos', description: 'Trilogía épica de fantasía de J.R.R. Tolkien', price: 24.99, category: 'books', stock: 65, imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500' },
    { name: 'La Odisea', description: 'Poema épico griego atribuido a Homero', price: 15.99, category: 'books', stock: 45, imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500' },
    { name: 'Orgullo y Prejuicio', description: 'Novela romántica clásica de Jane Austen', price: 11.99, category: 'books', stock: 80, imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500' },
    { name: 'Crónica de una Muerte Anunciada', description: 'Novela de Gabriel García Márquez', price: 13.99, category: 'books', stock: 70, imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500' },
    { name: 'El Alquimista', description: 'Fábula espiritual de Paulo Coelho', price: 12.99, category: 'books', stock: 90, imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500' },
    { name: 'Los Juegos del Hambre', description: 'Trilogía de ciencia ficción distópica', price: 16.99, category: 'books', stock: 85, imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500' },
    { name: 'El Hobbit', description: 'Aventura fantástica precuela de El Señor de los Anillos', price: 14.99, category: 'books', stock: 75, imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500' },
    { name: 'Matar a un Ruiseñor', description: 'Novela sobre justicia y moral de Harper Lee', price: 15.99, category: 'books', stock: 60, imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500' },
    { name: 'El Gran Gatsby', description: 'Novela sobre la decadencia del sueño americano', price: 13.99, category: 'books', stock: 55, imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500' },
  ],
  food: [
    { name: 'Café Premium 1kg', description: 'Café de origen único, tostado artesanal', price: 24.99, category: 'food', stock: 200, imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500' },
    { name: 'Chocolate Artesanal', description: 'Chocolate 70% cacao, importado de Bélgica', price: 12.99, category: 'food', stock: 150, imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4e6b5a73?w=500' },
    { name: 'Aceite de Oliva Extra Virgen', description: 'Aceite premium español, 500ml', price: 18.99, category: 'food', stock: 100, imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd2c7e?w=500' },
    { name: 'Miel Natural', description: 'Miel pura de abejas, 500g', price: 15.99, category: 'food', stock: 80, imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500' },
    { name: 'Té Verde Orgánico', description: 'Té verde premium, 100 bolsitas', price: 9.99, category: 'food', stock: 180, imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500' },
    { name: 'Vino Tinto Reserva', description: 'Vino tinto envejecido en barrica de roble', price: 29.99, category: 'food', stock: 60, imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500' },
    { name: 'Queso Gourmet', description: 'Selección de quesos artesanales variados', price: 22.99, category: 'food', stock: 70, imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500' },
    { name: 'Salmón Ahumado', description: 'Salmón noruego ahumado en frío, 200g', price: 19.99, category: 'food', stock: 50, imageUrl: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=500' },
    { name: 'Aceitunas Gourmet', description: 'Aceitunas verdes y negras en conserva', price: 8.99, category: 'food', stock: 120, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500' },
    { name: 'Mermelada Artesanal', description: 'Mermelada casera de frutas naturales', price: 7.99, category: 'food', stock: 140, imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500' },
    { name: 'Pasta Premium', description: 'Pasta italiana de trigo duro, 500g', price: 6.99, category: 'food', stock: 160, imageUrl: 'https://images.unsplash.com/photo-1551462147-85885e5e5e5a?w=500' },
    { name: 'Salsa de Tomate Orgánica', description: 'Salsa de tomate natural sin conservantes', price: 5.99, category: 'food', stock: 170, imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500' },
    { name: 'Nueces Premium', description: 'Nueces de California seleccionadas, 500g', price: 16.99, category: 'food', stock: 90, imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500' },
    { name: 'Miel de Manuka', description: 'Miel medicinal de Nueva Zelanda, 250g', price: 34.99, category: 'food', stock: 40, imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500' },
    { name: 'Café en Cápsulas', description: 'Cápsulas de café compatibles, pack de 20', price: 12.99, category: 'food', stock: 110, imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500' },
  ],
  sports: [
    { name: 'Balón de Fútbol', description: 'Balón oficial de fútbol, tamaño 5', price: 29.99, category: 'sports', stock: 100, imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=500' },
    { name: 'Raqueta de Tenis', description: 'Raqueta profesional de tenis con tecnología avanzada', price: 149.99, category: 'sports', stock: 40, imageUrl: 'https://images.unsplash.com/photo-1622163642992-7736f90e25b3?w=500' },
    { name: 'Bicicleta de Montaña', description: 'Bicicleta todo terreno, 21 velocidades', price: 399.99, category: 'sports', stock: 25, imageUrl: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500' },
    { name: 'Pesas Ajustables', description: 'Set de pesas ajustables 2.5-25kg', price: 89.99, category: 'sports', stock: 60, imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500' },
    { name: 'Yoga Mat', description: 'Colchoneta de yoga antideslizante', price: 24.99, category: 'sports', stock: 90, imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83d34dc0?w=500' },
    { name: 'Balón de Baloncesto', description: 'Balón oficial de baloncesto tamaño 7', price: 34.99, category: 'sports', stock: 75, imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500' },
    { name: 'Mancuernas Hexagonales', description: 'Par de mancuernas de 10kg cada una', price: 79.99, category: 'sports', stock: 50, imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500' },
    { name: 'Cinta de Correr', description: 'Cinta de correr plegable con pantalla LCD', price: 599.99, category: 'sports', stock: 15, imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=500' },
    { name: 'Pelota de Voleibol', description: 'Pelota oficial de voleibol de competición', price: 39.99, category: 'sports', stock: 65, imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=500' },
    { name: 'Guantes de Boxeo', description: 'Guantes de boxeo profesionales de cuero', price: 69.99, category: 'sports', stock: 45, imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83d34dc0?w=500' },
    { name: 'Bicicleta Estática', description: 'Bicicleta de ejercicio para interior', price: 299.99, category: 'sports', stock: 30, imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=500' },
    { name: 'Balón de Fútbol Americano', description: 'Balón oficial de fútbol americano', price: 44.99, category: 'sports', stock: 55, imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=500' },
    { name: 'Tabla de Surf', description: 'Tabla de surf para principiantes, 7 pies', price: 349.99, category: 'sports', stock: 20, imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500' },
    { name: 'Casco de Ciclismo', description: 'Casco de seguridad con ventilación', price: 59.99, category: 'sports', stock: 80, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500' },
    { name: 'Pelota de Golf', description: 'Pack de 12 pelotas de golf profesionales', price: 24.99, category: 'sports', stock: 95, imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=500' },
  ],
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function importProducts() {
  console.log('🛒 Importador de Productos de Ejemplo\n');
  console.log('Categorías disponibles:');
  console.log('1. Electronics (15 productos)');
  console.log('2. Clothing (15 productos)');
  console.log('3. Books (15 productos)');
  console.log('4. Food (15 productos)');
  console.log('5. Sports (15 productos)');
  console.log('6. Todas las categorías (75 productos)\n');

  // Si hay argumento en línea de comandos, usarlo; si no, preguntar
  const args = process.argv.slice(2);
  let choice;
  
  if (args.length > 0) {
    choice = args[0];
    console.log(`📌 Usando opción: ${choice}\n`);
  } else {
    choice = await question('Selecciona una opción (1-6): ');
  }
  
  let productsToImport = [];
  const categories = ['electronics', 'clothing', 'books', 'food', 'sports'];
  
  if (choice === '6') {
    // Importar todas las categorías
    categories.forEach(cat => {
      productsToImport.push(...SAMPLE_PRODUCTS[cat]);
    });
  } else {
    const categoryIndex = parseInt(choice) - 1;
    if (categoryIndex >= 0 && categoryIndex < categories.length) {
      productsToImport = SAMPLE_PRODUCTS[categories[categoryIndex]];
    } else {
      console.log('❌ Opción inválida');
      rl.close();
      return;
    }
  }

  console.log(`\n📦 Se importarán ${productsToImport.length} productos\n`);
  
  // Login automático como admin
  console.log('🔐 Iniciando sesión como admin...\n');
  
  let token;
  try {
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@ventas.com',
      password: 'admin123',
    });
    
    if (loginResponse.data.token) {
      token = loginResponse.data.token;
      console.log('✅ Sesión iniciada correctamente\n');
    } else {
      console.log('❌ Error: No se recibió token del servidor');
      rl.close();
      return;
    }
  } catch (error) {
    console.log('❌ Error al iniciar sesión:');
    console.log(`   ${error.response?.data?.error?.message || error.message}`);
    console.log('\n💡 Asegúrate de que:');
    console.log('   1. El backend esté corriendo (npm run dev:backend)');
    console.log('   2. El usuario admin exista (ejecuta: npm run create-admin)');
    rl.close();
    return;
  }

  console.log('\n🔄 Importando productos...\n');

  let imported = 0;
  let failed = 0;

  for (const product of productsToImport) {
    try {
      const response = await axios.post(
        `${API_URL}/products`,
        product,
        {
          headers: {
            'Authorization': `Bearer ${token.trim()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        imported++;
        console.log(`✅ ${product.name}`);
      } else {
        failed++;
        console.log(`❌ ${product.name} - Error ${response.status}`);
      }
    } catch (error) {
      failed++;
      const errorMsg = error.response?.data?.error?.message || error.message;
      console.log(`❌ ${product.name} - ${errorMsg}`);
    }
  }

  console.log(`\n📊 Resumen: ${imported} importados, ${failed} fallidos`);
  rl.close();
}

importProducts().catch(console.error);

