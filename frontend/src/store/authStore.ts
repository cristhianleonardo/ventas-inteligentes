import { create } from 'zustand';
import { User } from '../services/auth.service';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  init: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  init: () => {
    const user = authService.getCurrentUser();
    set({ user, isAuthenticated: !!user });
  },
  login: async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    if (response.token && response.user) {
      set({ user: response.user, isAuthenticated: true });
    }
  },
  register: async (email: string, password: string, name: string) => {
    await authService.register({ email, password, name });
  },
  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },
}));

