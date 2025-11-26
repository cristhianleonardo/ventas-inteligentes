import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useEffect } from 'react';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { itemCount, fetchCart } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            🛒 Ventas Inteligentes
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/products" className="hover:text-primary-600">
              Productos
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/cart" className="hover:text-primary-600 relative">
                  Carrito
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="hover:text-primary-600">
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {user?.name}
                  </span>
                  <button
                    onClick={logout}
                    className="btn btn-secondary text-sm"
                  >
                    Salir
                  </button>
                </div>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link to="/login" className="hover:text-primary-600">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

