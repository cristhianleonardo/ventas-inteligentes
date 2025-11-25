import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            🛒 Ventas Inteligentes
          </Link>
          <nav className="flex gap-4">
            <Link to="/products" className="hover:text-primary-600">
              Productos
            </Link>
            <Link to="/cart" className="hover:text-primary-600">
              Carrito
            </Link>
            <Link to="/login" className="btn btn-primary">
              Iniciar Sesión
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

