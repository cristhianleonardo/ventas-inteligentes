import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recommendationService } from '../../services/recommendation.service';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

export default function AIModel() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: accuracyData, isLoading: isLoadingAccuracy } = useQuery({
    queryKey: ['model-accuracy'],
    queryFn: () => recommendationService.getModelAccuracy(),
    refetchInterval: 30000, // Actualizar cada 30 segundos
    retry: false, // No reintentar si el modelo no está entrenado
  });

  const trainMutation = useMutation({
    mutationFn: () => recommendationService.trainModel(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['model-accuracy'] });
    },
  });

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-xl">No tienes permisos para acceder a esta página</p>
        <Link to="/" className="btn btn-primary mt-4">Volver al inicio</Link>
      </div>
    );
  }

  const accuracy = accuracyData?.accuracy ?? null;
  const targetMet = accuracyData?.targetMet ?? false;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Modelo de IA - Recomendaciones</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Estado del Modelo</h2>
          {isLoadingAccuracy ? (
            <p className="text-gray-600">Cargando...</p>
          ) : accuracy !== null && accuracyData ? (
            <div>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Precisión Actual:</span>
                  <span className={`font-bold text-lg ${targetMet ? 'text-green-600' : 'text-orange-600'}`}>
                    {accuracy.toFixed(2)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${targetMet ? 'bg-green-600' : 'bg-orange-600'}`}
                    style={{ width: `${Math.min(accuracy, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Objetivo:</span>
                  <span className="font-semibold">80%</span>
                </div>
              </div>
              <div className={`p-3 rounded ${targetMet ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                {targetMet ? (
                  <p className="font-semibold">✅ Objetivo alcanzado (80%+)</p>
                ) : (
                  <p className="font-semibold">⚠️ Objetivo no alcanzado. Entrena el modelo con más datos.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Modelo no entrenado</p>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Entrenamiento</h2>
          <p className="text-gray-600 mb-4">
            El modelo usa técnicas de Machine Learning (Content-Based y Collaborative Filtering)
            para predecir productos de interés con alta precisión.
          </p>
          <button
            onClick={() => trainMutation.mutate()}
            disabled={trainMutation.isPending}
            className="btn btn-primary w-full"
          >
            {trainMutation.isPending ? 'Entrenando...' : 'Entrenar Modelo'}
          </button>
          {trainMutation.isSuccess && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
              <p className="font-semibold">✅ Modelo entrenado exitosamente</p>
              <p className="text-sm mt-1">
                Precisión: {trainMutation.data.accuracy}%
                {trainMutation.data.targetMet && ' (Objetivo alcanzado)'}
              </p>
            </div>
          )}
          {trainMutation.isError && (
            <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
              <p className="font-semibold">❌ Error al entrenar modelo</p>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Cómo Funciona</h2>
        <div className="space-y-3 text-gray-700">
          <div>
            <h3 className="font-semibold mb-1">1. Content-Based Filtering</h3>
            <p className="text-sm">
              Analiza las características de los productos (nombre, descripción, categoría, precio)
              para encontrar productos similares.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">2. Collaborative Filtering</h3>
            <p className="text-sm">
              Analiza el comportamiento de usuarios similares (carritos, compras, reseñas)
              para recomendar productos que otros usuarios con gustos similares han comprado.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">3. Modelo Híbrido</h3>
            <p className="text-sm">
              Combina ambas técnicas para maximizar la precisión y alcanzar el objetivo del 80%+.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

