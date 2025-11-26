import api from './api';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const productService = {
  async getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<ProductsResponse>(`/products?${params.toString()}`);
    return response.data;
  },

  async getProductById(id: string): Promise<{ success: boolean; product: Product }> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const response = await api.post('/products', data);
    return response.data;
  },

  async updateProduct(id: string, data: Partial<Product>) {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: string) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  async updateStock(id: string, quantity: number, operation: 'add' | 'subtract' | 'set') {
    const response = await api.patch(`/products/${id}/stock`, { quantity, operation });
    return response.data;
  },
};

