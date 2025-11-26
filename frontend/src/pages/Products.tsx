import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService, Product } from '../services/product.service';
import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';

export default function Products() {
  const [filters, setFilters] = useState({ page: 1, limit: 20 });
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setFilters((prev) => ({ ...prev, page: 1 })); // Reset a página 1 al buscar
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', filters, debouncedSearch, category],
    queryFn: () =>
      productService.getProducts({
        ...filters,
        search: debouncedSearch || undefined,
        category: category || undefined,
      }),
  });

  const handleAddToCart = async (productId: string) => {
    try {
      await addItem(productId, 1);
      alert('Producto agregado al carrito');
    } catch (err) {
      alert('Error al agregar al carrito');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar productos</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Catálogo de Productos</h1>

      {/* Filtros */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input flex-1 min-w-[200px]"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input"
        >
          <option value="">Todas las categorías</option>
          <option value="electronics">Electrónica</option>
          <option value="clothing">Ropa</option>
          <option value="books">Libros</option>
          <option value="food">Comida</option>
          <option value="sports">Deporte</option>
        </select>
      </div>

      {/* Lista de productos */}
      {data?.products && data.products.length > 0 ? (
        <>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {data.products.map((product: Product) => (
              <div key={product.id} className="card hover:shadow-lg transition-shadow">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-48 w-full object-cover rounded mb-4"
                  />
                ) : (
                  <div className="h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
                    <span className="text-gray-400">Sin imagen</span>
                  </div>
                )}
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2 text-sm line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xl font-bold text-primary-600">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/products/${product.id}`}
                    className="btn btn-secondary flex-1 text-center"
                  >
                    Ver Detalles
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="btn btn-primary flex-1"
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Sin Stock' : 'Agregar'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {data.pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                disabled={filters.page === 1}
                className="btn btn-secondary"
              >
                Anterior
              </button>
              <span className="flex items-center px-4">
                Página {data.pagination.page} de {data.pagination.totalPages}
              </span>
              <button
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                disabled={filters.page >= data.pagination.totalPages}
                className="btn btn-secondary"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-600">No se encontraron productos</p>
        </div>
      )}
    </div>
  );
}

