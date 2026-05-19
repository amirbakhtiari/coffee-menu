import { CategoryType, Category } from '@/types.ts';

export const fetchCategories = async (): Promise<Category[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        // { id: CategoryType.PREVIOUS_ORDERS, label: 'سفارشات قبلی', icon: 'History' },
        // { id: CategoryType.DISCOUNTED, label: 'تخفیف‌دارها', icon: 'Percent' },
        { id: CategoryType.HOT_COFFEE, label: 'قهوه گرم', icon: 'Coffee' },
        { id: CategoryType.COLD_COFFEE, label: 'قهوه سرد', icon: 'Snowflake' },
        { id: CategoryType.MILKSHAKE, label: 'میلک شیک', icon: 'Milk' },
        { id: CategoryType.HOT_DRINKS, label: 'نوشیدنی گرم', icon: 'HotDrinks' },
        { id: CategoryType.TEA_HERBAL_TEA, label: 'چای و دمنوش', icon: 'TeaHerbalTea' },
        { id: CategoryType.COLD_DRINKS, label: 'نوشیدنی سرد', icon: 'ColdDrinks' },
        { id: CategoryType.CAKE, label: 'کیک', icon: 'CakeSlice' },
        { id: CategoryType.SNACKS, label: 'میان وعده', icon: 'Sandwich' }
      ]);
    }, 1500);
  });
};
