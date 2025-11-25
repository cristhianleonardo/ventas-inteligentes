export default function Products() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Catálogo de Productos</h1>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* TODO: Implementar lista de productos */}
        <div className="card">
          <div className="h-48 bg-gray-200 rounded mb-4"></div>
          <h3 className="font-semibold mb-2">Producto Ejemplo</h3>
          <p className="text-gray-600 mb-2">$99.99</p>
          <button className="btn btn-primary w-full">Agregar al Carrito</button>
        </div>
      </div>
    </div>
  );
}

