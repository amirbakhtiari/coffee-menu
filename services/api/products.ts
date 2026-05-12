
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

export const fetchProductById = async (id: string): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Extract original ID if it's a simulated page ID (e.g., "4-page-0" -> "4")
      const originalId = id.includes('-page-') ? id.split('-page-')[0] : id;
      const product = PRODUCTS.find(p => p.id === originalId);
      
      if (product) {
        // Return a copy with the provided ID to maintain consistency
        resolve({ ...product, id });
      } else {
        reject(new Error(`محصول با کد ${id} یافت نشد`));
      }
    }, 500);
  });
};
