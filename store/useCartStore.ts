
import { create } from 'zustand';
import { CartItem, Product, ProductOptions } from '../types';

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, options?: ProductOptions) => void;
  setCartItemQuantity: (product: Product, quantity: number, options: ProductOptions) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: () => number;
  totalOriginalAmount: () => number;
  totalDiscount: () => number;
  totalItems: () => number;
  getItemQuantity: (productId: string) => number;
  getSpecificItem: (productId: string, options: ProductOptions) => CartItem | undefined;
  updateProductQuantity: (product: Product, delta: number) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addToCart: (product, quantity = 1, options) => {
    const defaultOptions: ProductOptions = options || {
      size: 'M',
      sugar: '50%',
      milk: 'معمولی',
      syrupType: 'بدون سیروپ',
      syrupAmount: '۰'
    };
    
    const cartId = `${product.id}-${defaultOptions.size}-${defaultOptions.sugar}-${defaultOptions.milk}-${defaultOptions.syrupType}-${defaultOptions.syrupAmount}`;

    set((state) => {
      const existing = state.items.find(item => item.cartId === cartId);
      if (existing) {
        return {
          items: state.items.map(item =>
            item.cartId === cartId ? { ...item, quantity: item.quantity + quantity } : item
          )
        };
      }
      return { 
        items: [...state.items, { ...product, quantity, selectedOptions: defaultOptions, cartId }] 
      };
    });
  },

  setCartItemQuantity: (product, quantity, options) => {
    const cartId = `${product.id}-${options.size}-${options.sugar}-${options.milk}-${options.syrupType}-${options.syrupAmount}`;
    
    set((state) => {
      const existing = state.items.find(item => item.cartId === cartId);
      if (quantity <= 0) {
        return { items: state.items.filter(item => item.cartId !== cartId) };
      }
      if (existing) {
        return {
          items: state.items.map(item =>
            item.cartId === cartId ? { ...item, quantity, price: product.price } : item
          )
        };
      }
      return { 
        // استفاده از شیء محصولی که از کامپوننت می‌آید (چون ممکن است قیمتش تغییر کرده باشد)
        items: [...state.items, { ...product, quantity, selectedOptions: options, cartId }] 
      };
    });
  },

  updateProductQuantity: (product, delta) => {
    // در صفحه اصلی همیشه از سایز متوسط استفاده می‌کنیم
    const defaultOptions: ProductOptions = {
      size: 'M',
      sugar: '50%',
      milk: 'معمولی',
      syrupType: 'بدون سیروپ',
      syrupAmount: '۰'
    };
    const cartId = `${product.id}-${defaultOptions.size}-${defaultOptions.sugar}-${defaultOptions.milk}-${defaultOptions.syrupType}-${defaultOptions.syrupAmount}`;
    const items = get().items;
    const existing = items.find(item => item.cartId === cartId);

    if (existing) {
      get().updateQuantity(cartId, existing.quantity + delta);
    } else if (delta > 0) {
      get().addToCart(product, 1, defaultOptions);
    }
  },

  removeFromCart: (cartId) => {
    set((state) => ({
      items: state.items.filter(item => item.cartId !== cartId)
    }));
  },

  updateQuantity: (cartId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(cartId);
      return;
    }
    set((state) => ({
      items: state.items.map(item =>
        item.cartId === cartId ? { ...item, quantity } : item
      )
    }));
  },

  clearCart: () => set({ items: [] }),

  totalAmount: () => {
    return get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  },

  totalOriginalAmount: () => {
    return get().items.reduce((acc, item) => acc + ((item.originalPrice || item.price) * item.quantity), 0);
  },

  totalDiscount: () => {
    return get().items.reduce((acc, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        return acc + ((item.originalPrice - item.price) * item.quantity);
      }
      return acc;
    }, 0);
  },

  totalItems: () => {
    return get().items.reduce((acc, item) => acc + item.quantity, 0);
  },

  getItemQuantity: (productId) => {
    return get().items
      .filter(item => item.id === productId)
      .reduce((acc, item) => acc + item.quantity, 0);
  },

  getSpecificItem: (productId, options) => {
    const cartId = `${productId}-${options.size}-${options.sugar}-${options.milk}-${options.syrupType}-${options.syrupAmount}`;
    return get().items.find(item => item.cartId === cartId);
  }
}));
