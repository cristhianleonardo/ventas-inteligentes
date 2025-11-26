import { create } from 'zustand';
import { CartItem } from '../services/cart.service';
import { cartService } from '../services/cart.service';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await cartService.getCart();
      set({
        items: response.cart.items,
        total: response.cart.total,
        itemCount: response.cart.itemCount,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },
  addItem: async (productId: string, quantity = 1) => {
    try {
      await cartService.addToCart(productId, quantity);
      await get().fetchCart();
    } catch (error) {
      console.error('Error agregando al carrito:', error);
    }
  },
  updateItem: async (itemId: string, quantity: number) => {
    try {
      await cartService.updateCartItem(itemId, quantity);
      await get().fetchCart();
    } catch (error) {
      console.error('Error actualizando item:', error);
    }
  },
  removeItem: async (itemId: string) => {
    try {
      await cartService.removeFromCart(itemId);
      await get().fetchCart();
    } catch (error) {
      console.error('Error eliminando item:', error);
    }
  },
  clearCart: async () => {
    try {
      await cartService.clearCart();
      set({ items: [], total: 0, itemCount: 0 });
    } catch (error) {
      console.error('Error vaciando carrito:', error);
    }
  },
}));

