
export enum CategoryType {
  DISCOUNTED = 'Discounted',
  CAPPUCCINO = 'Cappuccino',
  LATTE = 'Latte',
  ESPRESSO = 'Espresso',
  MOCHA = 'Mocha',
  PREVIOUS_ORDERS = 'PreviousOrders'
}

export interface ProductOptions {
  size: 'S' | 'M' | 'L';
  sugar: '0%' | '50%' | '100%';
  milk: 'بدون شیر' | 'معمولی' | 'جو دوسر' | 'سویا';
  syrupType: 'وانیل' | 'کارامل' | 'فندق' | 'بدون سیروپ';
  syrupAmount: '۰' | '۱' | '۲';
}

export interface Product {
  id: string;
  name: string;
  subName: string;
  price: number; // قیمت نهایی (بعد از تخفیف)
  originalPrice?: number; // قیمت قبل از تخفیف (اختیاری)
  discountPercent?: number; // درصد تخفیف (اختیاری)
  rating: number;
  image: string;
  category: CategoryType;
  description: string;
  volume: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedOptions?: ProductOptions;
  cartId: string;
  pointsEach?: number;
}

export interface UserProfile {
  fullName: string;
  mobile: string;
  birthDate: string;
  tier: 'bronze' | 'silver' | 'gold';
  points: number;
}

export interface Order {
  id: string;
  date: string;
  time?: string;
  items: CartItem[];
  totalPrice: number;
  discount?: number;
  status: 'delivered' | 'pending' | 'canceled';
  points: number;
  paymentMethod: 'نقدی' | 'درگاه بانکی' | 'عضویت';
  address?: string;
  summary?: {
    subtotal: number;
    delivery: number;
    discount: number;
    total: number;
  };
}
