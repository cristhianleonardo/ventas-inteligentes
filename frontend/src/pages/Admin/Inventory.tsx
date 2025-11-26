import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/product.service';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function AdminInventory() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-inventory'],
    queryFn: () => productService.getProducts({ limit: 100 }),
  });

  const updateStockMutation = useMutation({
    mutationFn: ({ id, quantity, operation }: { id: string; quantity: number; operation: string }) =>
      api.patch(`/products/${id}/stock`, { quantity, operation }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inventory'] });
    },
  });

  const handleStockUpdate = (productId: string, operation: 'add' | 'subtract' | 'set') => {
    const quantity = prompt(
      operation === 'add'
        ? '¿Cuántas unidades agregar?'
        : operation === 'subtract'
        ? '¿Cuántas unidades restar?'
        : '¿Cuál es el nuevo stock?'
    );
    if (quantity && !isNaN(parseInt(quantity))) {
      updateStockMutation.mutate({
        id: productId,
        quantity: parseInt(quantity),
        operation,
      });
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-xl">No tienes permisos para acceder a esta página</p>
        <Link to="/" className="btn btn-primary mt-4">Volver al inicio</Link>
      </div>
    );
  }

  const totalProducts = data?.products.length || 0;
  const totalStock = data?.products.reduce((sum: number, p: any) => sum + p.stock, 0) || 0;
  const lowStock = data?.products.filter((p: any) => p.stock < 10).length || 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Control de Inventario</h1>

      {/* Estadísticas */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Total Productos</h3>
          <p className="text-3xl font-bold text-primary-600">{totalProducts}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Stock Total</h3>
          <p className="text-3xl font-bold text-primary-600">{totalStock}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Stock Bajo</h3>
          <p className="text-3xl font-bold text-red-600">{lowStock}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Producto</th>
                  <th className="text-left p-2">Stock Actual</th>
                  <th className="text-left p-2">Estado</th>
                  <th className="text-left p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data?.products.map((product: any) => (
                  <tr
                    key={product.id}
                    className={`border-b hover:bg-gray-50 ${
                      product.stock < 10 ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="p-2">{product.name}</td>
                    <td className="p-2 font-semibold">{product.stock}</td>
                    <td className="p-2">
                      {product.stock === 0 ? (
                        <span className="text-red-600 font-semibold">Sin Stock</span>
                      ) : product.stock < 10 ? (
                        <span className="text-orange-600 font-semibold">Stock Bajo</span>
                      ) : (
                        <span className="text-green-600 font-semibold">Disponible</span>
                      )}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStockUpdate(product.id, 'add')}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          + Agregar
                        </button>
                        <button
                          onClick={() => handleStockUpdate(product.id, 'subtract')}
                          className="text-orange-600 hover:text-orange-800 text-sm"
                        >
                          - Restar
                        </button>
                        <button
                          onClick={() => handleStockUpdate(product.id, 'set')}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          = Establecer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

