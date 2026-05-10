
import { PRODUCTS } from '../api/mockData';
import { Product, CategoryType } from '../types';

/**
 * Simulates an API call to fetch products with pagination and optional category filtering.
 */
export const fetchProducts = async (category?: CategoryType, page = 1, pageSize = 10): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = PRODUCTS;

      if (category) {
        if (category === CategoryType.DISCOUNTED) {
          filtered = filtered.filter(p => (p.discountPercent || 0) > 0);
        } else if (category === CategoryType.PREVIOUS_ORDERS) {
          // در واقعیت باید از تاریخچه سفارشات کاربر بیاید، اینجا به صورت فرضی چند محصول رندوم برمی‌گردانیم
          filtered = filtered.slice(0, 8); 
        } else {
          filtered = filtered.filter(p => p.category === category);
        }
      }

      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedProducts = filtered.slice(startIndex, endIndex);
      resolve(paginatedProducts);
    }, 800); // Simulate network latency
  });
};

/**
 * Simulates an API call to fetch a single product by ID
 */
export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(PRODUCTS.find(p => p.id === id));
    }, 500);
  });
};
