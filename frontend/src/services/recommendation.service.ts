import api from './api';

export interface Recommendation {
  product_id: string;
  score: number;
}

export interface SimilarProduct {
  product_id: string;
  similarity: number;
}

export const recommendationService = {
  async getRecommendations(userId: string, limit: number = 10): Promise<Recommendation[]> {
    const response = await api.get(`/recommendations/user/${userId}`, {
      params: { limit },
    });
    return response.data.recommendations || [];
  },

  async getSimilarProducts(productId: string, limit: number = 5): Promise<SimilarProduct[]> {
    const response = await api.get(`/recommendations/product/${productId}`, {
      params: { limit },
    });
    return response.data.similarProducts || [];
  },

  async trainModel() {
    const response = await api.post('/recommendations/train');
    return response.data;
  },

  async getModelAccuracy() {
    try {
      const response = await api.get('/recommendations/accuracy');
      return response.data;
    } catch (error: any) {
      // Si el modelo no está entrenado, devolver null en lugar de error
      if (error.response?.status === 503) {
        return null;
      }
      throw error;
    }
  },
};

