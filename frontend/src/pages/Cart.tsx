import { useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';

export default function Cart() {
  const {
    items,
    total,
    itemCount,
    isLoading,
    fetchCart,
    updateItem,
    removeItem,
    clearCart,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Cargando carrito...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Mi Carrito</h1>
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">Tu carrito está vacío</p>
          <Link to="/products" className="btn btn-primary">
            Explorar Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Mi Carrito ({itemCount} items)</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card flex gap-4">
              {item.product.imageUrl ? (
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Sin imagen</span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{item.product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  ${item.product.price.toFixed(2)} c/u
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Cantidad:</label>
                    <input
                      type="number"
                      min="1"
                      max={item.product.stock}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, parseInt(e.target.value) || 1)
                      }
                      className="w-20 px-2 py-1 border rounded"
                    />
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="card h-fit">
          <h2 className="text-xl font-bold mb-4">Resumen</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío:</span>
              <span>Gratis</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Link
              to="/checkout"
              className="btn btn-primary w-full block text-center"
            >
              Proceder al Pago
            </Link>
            <button
              onClick={() => clearCart()}
              className="btn btn-secondary w-full"
            >
              Vaciar Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

