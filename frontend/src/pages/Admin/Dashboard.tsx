import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function AdminDashboard() {
  const { user } = useAuthStore();

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-xl">No tienes permisos para acceder a esta página</p>
        <Link to="/" className="btn btn-primary mt-4">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/products" className="card hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-4">📦</div>
          <h2 className="text-xl font-semibold mb-2">Gestión de Productos</h2>
          <p className="text-gray-600">Crear, editar y eliminar productos del inventario</p>
        </Link>

        <Link to="/admin/users" className="card hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-4">👥</div>
          <h2 className="text-xl font-semibold mb-2">Gestión de Usuarios</h2>
          <p className="text-gray-600">Administrar usuarios y roles</p>
        </Link>

        <Link to="/admin/inventory" className="card hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-xl font-semibold mb-2">Control de Inventario</h2>
          <p className="text-gray-600">Visualizar y controlar el stock</p>
        </Link>
      </div>
    </div>
  );
}

