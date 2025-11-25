import { useParams } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Detalle del Producto {id}</h1>
      <div className="card">
        <p className="text-gray-600">Pendiente implementación</p>
      </div>
    </div>
  );
}

