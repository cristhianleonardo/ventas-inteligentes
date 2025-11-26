import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import { useCartStore } from '../store/cartStore';
import { recommendationService } from '../services/recommendation.service';
import { Link } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id!),
    enabled: !!id,
  });

  // Obtener productos similares
  const { data: similarData } = useQuery({
    queryKey: ['similar-products', id],
    queryFn: () => recommendationService.getSimilarProducts(id!, 4),
    enabled: !!id,
  });

  // Obtener detalles de productos similares
  const similarProductIds = similarData?.map((p: any) => p.product_id) || [];
  const { data: similarProducts } = useQuery({
    queryKey: ['similar-products-details', similarProductIds],
    queryFn: async () => {
      const products = await Promise.all(
        similarProductIds.map((productId: string) =>
          productService.getProductById(productId).catch(() => null)
        )
      );
      return products.filter((p) => p !== null).map((p: any) => p.product);
    },
    enabled: similarProductIds.length > 0,
  });

  const handleAddToCart = async () => {
    if (!id) return;
    try {
      await addItem(id, 1);
      alert('Producto agregado al carrito');
    } catch (err) {
      alert('Error al agregar al carrito');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Cargando producto...</p>
      </div>
    );
  }

  if (error || !data?.product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Producto no encontrado</p>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Volver a Productos
        </button>
      </div>
    );
  }

  const product = data.product;

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate('/products')}
        className="text-primary-600 hover:underline mb-4"
      >
        ← Volver a productos
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Sin imagen</span>
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-4xl font-bold text-primary-600 mb-4">
            ${product.price.toFixed(2)}
          </p>

          <div className="mb-4">
            <p className="text-gray-600 mb-2">{product.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="px-3 py-1 bg-gray-100 rounded">
                Categoría: {product.category}
              </span>
              <span
                className={`px-3 py-1 rounded ${
                  product.stock > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                Stock: {product.stock}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn btn-primary w-full"
            >
              {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="btn btn-secondary w-full"
            >
              Ver Carrito
            </button>
          </div>

          {product.reviews && product.reviews.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Reseñas</h2>
              <div className="space-y-4">
                {product.reviews.map((review: any) => (
                  <div key={review.id} className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{review.user?.name}</span>
                      <span className="text-yellow-500">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-gray-600">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Productos Similares */}
      {similarProducts && similarProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Productos Similares</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {similarProducts.map((similarProduct: any) => (
              <Link
                key={similarProduct.id}
                to={`/products/${similarProduct.id}`}
                className="card hover:shadow-lg transition-shadow"
              >
                {similarProduct.imageUrl ? (
                  <img
                    src={similarProduct.imageUrl}
                    alt={similarProduct.name}
                    className="h-48 w-full object-cover rounded mb-4"
                  />
                ) : (
                  <div className="h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
                    <span className="text-gray-400">Sin imagen</span>
                  </div>
                )}
                <h3 className="font-semibold mb-2">{similarProduct.name}</h3>
                <p className="text-xl font-bold text-primary-600">
                  ${similarProduct.price.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

