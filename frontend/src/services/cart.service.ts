import api from './api';
import { Product } from './product.service';

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

export const cartService = {
  async getCart(): Promise<{ success: boolean; cart: Cart }> {
    const response = await api.get('/cart');
    return response.data;
  },

  async addToCart(productId: string, quantity: number = 1) {
    const response = await api.post('/cart/items', { productId, quantity });
    return response.data;
  },

  async updateCartItem(itemId: string, quantity: number) {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  async removeFromCart(itemId: string) {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  async clearCart() {
    const response = await api.delete('/cart');
    return response.data;
  },
};

