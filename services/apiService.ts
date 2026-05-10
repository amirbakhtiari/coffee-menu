
import { PRODUCTS } from '../api/mockData';
import { Product, CategoryType, UserProfile, Order } from '../types';

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

/**
 * Simulates an API call to fetch user orders
 */
export const fetchOrders = async (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'ORD-1245',
          date: '۱۴۰۲/۱۲/۲۰',
          time: '۱۸:۳۰',
          address: 'زعفرانیه، خیابان آصف، پلاک ۱۲',
          totalPrice: 125000,
          discount: 15000,
          status: 'delivered',
          items: [
            { 
              id: '1', 
              name: 'لته آرت', 
              subName: 'با شیر بادام',
              price: 65000, 
              quantity: 1, 
              image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=400',
              pointsEach: 15,
              rating: 4.5,
              category: CategoryType.LATTE,
              description: '',
              volume: '300ml',
              cartId: '1'
            },
            { 
              id: '2', 
              name: 'کروسان شکلاتی', 
              subName: 'تازه‌پز',
              price: 60000, 
              quantity: 1, 
              image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
              pointsEach: 10,
              rating: 4.8,
              category: CategoryType.ESPRESSO,
              description: '',
              volume: '150g',
              cartId: '2'
            }
          ],
          points: 25,
          paymentMethod: 'درگاه بانکی',
          summary: {
            subtotal: 125000,
            delivery: 0,
            discount: 15000,
            total: 110000
          }
        },
        {
          id: 'ORD-1198',
          date: '۱۴۰۲/۱۲/۱۵',
          time: '۱۱:۴۵',
          address: 'تجریش، خیابان فناخسرو، کوچه نهم',
          totalPrice: 89000,
          status: 'delivered',
          items: [
            { 
              id: '3', 
              name: 'آیس کافی', 
              price: 55000, 
              quantity: 1, 
              image: '',
              rating: 4.2,
              subName: '',
              category: CategoryType.ESPRESSO,
              description: '',
              volume: '400ml',
              cartId: '3'
            },
            { 
              id: '4', 
              name: 'کوکی گردو', 
              price: 34000, 
              quantity: 1, 
              image: '',
              rating: 4.5,
              subName: '',
              category: CategoryType.DISCOUNTED,
              description: '',
              volume: '100g',
              cartId: '4'
            }
          ],
          points: 15,
          paymentMethod: 'نقدی',
          summary: {
            subtotal: 89000,
            delivery: 0,
            discount: 0,
            total: 89000
          }
        }
      ]);
    }, 1200);
  });
};

/**
 * Simulates an API call to fetch a single order by ID
 */
export const fetchOrderById = async (id: string): Promise<Order | undefined> => {
  const orders = await fetchOrders();
  return orders.find(o => o.id === id);
};
/**
 * Simulates an API call to fetch user profile
 */
export const fetchUserProfile = async (): Promise<UserProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        fullName: 'امیر بختیاری',
        mobile: '۰۹۱۲۳۴۵۶۷۸۹',
        birthDate: '۱۳۷۰/۰۵/۱۵',
        tier: 'bronze',
        points: 450
      });
    }, 1000);
  });
};

/**
 * Simulates an API call to fetch notifications
 */
export const fetchNotifications = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: 1, title: 'سفارش شما تایید شد', desc: 'کاپوچینوی داغ شما در حال آماده‌سازی است.', time: '۵ دقیقه پیش', read: false },
    { id: 2, title: 'کد تخفیف ویژه', desc: 'برای خرید بعدی از ۲۰٪ تخفیف بهره‌مند شوید: COFFEE20', time: '۲ ساعت پیش', read: true },
    { id: 3, title: 'به کافه لند خوش آمدید', desc: 'از منوی جدید ما دیدن کنید و لذت ببرید.', time: '۱ روز پیش', read: true },
  ];
};

/**
 * Simulates an API call to update user profile
 */
export const updateUserProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        fullName: data.fullName || 'امیر بختیاری',
        mobile: data.mobile || '۰۹۱۲۳۴۵۶۷۸۹',
        birthDate: data.birthDate || '۱۳۷۰/۰۵/۱۵',
        tier: 'bronze',
        points: 450
      });
    }, 1500);
  });
};

/**
 * Simulates an API call to fetch categories
 */
export const fetchCategories = async (): Promise<{ id: CategoryType; label: string; icon: any }[]> => {
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

