
import { PRODUCTS } from '../../api/mockData';
import { Product, CategoryType } from '../../types';

export const fetchProducts = async (category?: CategoryType, page = 1, pageSize = 8): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...PRODUCTS];
      if (category && category !== CategoryType.PREVIOUS_ORDERS) {
        filtered = filtered.filter(p => p.category === category);
      }
      
      // Simulate more data by repeating filtered products for testing infinite scroll
      // In a real app, this would be a real DB query with limit/offset
      const totalAvailable = filtered.length * 3; // Simulate 3 times more data
      const extendedList: Product[] = [];
      for (let i = 0; i < 3; i++) {
        filtered.forEach(p => extendedList.push({ ...p, id: `${p.id}-page-${i}` }));
      }

      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      
      resolve(extendedList.slice(start, end));
    }, 1000);
  });
};

export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(PRODUCTS.find(p => p.id === id));
    }, 500);
  });
};

export const fetchCategories = async (): Promise<{ id: CategoryType; label: string; icon: string }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: CategoryType.PREVIOUS_ORDERS, label: 'سفارشات قبلی', icon: 'History' },
        { id: CategoryType.DISCOUNTED, label: 'تخفیف‌دارها', icon: 'Percent' },
        { id: CategoryType.CAPPUCCINO, label: 'کاپوچینو', icon: 'Coffee' },
        { id: CategoryType.LATTE, label: 'لته آرت', icon: 'Droplets' },
        { id: CategoryType.ESPRESSO, label: 'اسپرسو', icon: 'Zap' },
        { id: CategoryType.MOCHA, label: 'موکا فندق', icon: 'Coffee' }
      ]);
    }, 600);
  });
};
