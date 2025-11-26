import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { recommendationService } from '../services/recommendation.service';
import { productService } from '../services/product.service';

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();
  
  // Obtener recomendaciones si el usuario está autenticado
  const { data: recommendationsData } = useQuery({
    queryKey: ['recommendations', user?.id],
    queryFn: () => recommendationService.getRecommendations(user!.id, 8),
    enabled: !!isAuthenticated && !!user?.id,
  });

  // Obtener detalles de productos recomendados
  const recommendedProductIds = recommendationsData?.map((r: any) => r.product_id) || [];
  const { data: recommendedProducts } = useQuery({
    queryKey: ['recommended-products', recommendedProductIds],
    queryFn: async () => {
      const products = await Promise.all(
        recommendedProductIds.map((id: string) =>
          productService.getProductById(id).catch(() => null)
        )
      );
      return products.filter((p) => p !== null).map((p: any) => p.product);
    },
    enabled: recommendedProductIds.length > 0,
  });
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
        {isAuthenticated && recommendedProducts && recommendedProducts.length > 0 ? (
          <>
            <p className="text-gray-600 mb-4">
              Basado en tus preferencias y comportamiento de compra
            </p>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              {recommendedProducts.slice(0, 4).map((product: any) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 rounded mb-2 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Sin imagen</span>
                    </div>
                  )}
                  <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                  <p className="text-primary-600 font-bold">${product.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
            <Link to="/products" className="text-primary-600 hover:underline">
              Ver todos los productos →
            </Link>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-4">
              {isAuthenticated
                ? 'Aún no hay suficientes datos para recomendaciones personalizadas. ¡Explora productos!'
                : 'Inicia sesión para ver recomendaciones personalizadas basadas en tus preferencias'}
            </p>
            <Link to="/products" className="text-primary-600 hover:underline">
              Ver todos los productos →
            </Link>
          </>
        )}
      </section>
    </div>
  );
}

