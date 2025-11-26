import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Bienvenido a Ventas Inteligentes
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Descubre productos perfectos para ti con nuestro agente inteligente de recomendaciones
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/products" className="btn btn-primary text-lg px-8 py-3">
            Explorar Productos
          </Link>
          {!isAuthenticated && (
            <Link to="/login" className="btn btn-secondary text-lg px-8 py-3">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="card text-center">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold mb-2">IA Inteligente</h3>
          <p className="text-gray-600">
            Recomendaciones personalizadas con 80%+ de precisión
          </p>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold mb-2">UI Intuitiva</h3>
          <p className="text-gray-600">
            Navegación sencilla y diseño responsivo
          </p>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold mb-2">Rápido y Seguro</h3>
          <p className="text-gray-600">
            Procesamiento rápido con máxima seguridad
          </p>
        </div>
      </section>

      {/* Recommendations Preview */}
      <section className="card">
        <h2 className="text-2xl font-bold mb-4">Productos Recomendados para Ti</h2>
        <p className="text-gray-600 mb-4">
          Inicia sesión para ver recomendaciones personalizadas basadas en tus preferencias
        </p>
        <Link to="/products" className="text-primary-600 hover:underline">
          Ver todos los productos →
        </Link>
      </section>
    </div>
  );
}

