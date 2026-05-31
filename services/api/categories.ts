
import { CategoryType, Category } from '../../types';

export const fetchCategories = async (): Promise<Category[]> => {
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
    }, 1500); // Increased delay to show off placeholder loading
  });
};
