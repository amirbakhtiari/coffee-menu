
import { Order } from '../../types';

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
              category: 'LATTE' as any,
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
              category: 'ESPRESSO' as any,
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
              category: 'ESPRESSO' as any,
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
              category: 'DISCOUNTED' as any,
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

export const fetchOrderById = async (id: string): Promise<Order | undefined> => {
  const orders = await fetchOrders();
  return orders.find(o => o.id === id);
};
