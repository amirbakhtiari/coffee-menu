
import { Order } from '../../types';

export const fetchOrders = async (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'ORD-1245',
          date: '۱۴۰۲/۱۲/۲۰',
          time: '۱۸:۱۵',
          address: 'زعفرانیه، خیابان آصف، پلاک ۱۲',
          tableNumber: 'میز ۷ (فضای باز)',
          orderType: 'در کافه',
          totalPrice: 125000,
          discount: 15000,
          status: 'pending',
          currentStepIndex: 2,
          estimatedDelivery: 'حدود ۱۰ دقیقه',
          timeline: [
            {
              id: 'step-1',
              stepNumber: 1,
              title: 'ثبت و تایید سفارش',
              desc: 'سفارش شما در سیستم ثبت شد و فاکتور پرداخت صادر گردید.',
              time: '۱۸:۱۵',
              status: 'completed',
            },
            {
              id: 'step-2',
              stepNumber: 2,
              title: 'تایید باریستای کافه',
              desc: 'سفارش توسط باریستای شیفت تایید و اقلام بررسی گردید.',
              time: '۱۸:۱۸',
              status: 'completed',
            },
            {
              id: 'step-3',
              stepNumber: 3,
              title: 'آماده‌سازی و دم‌آوری قهوه',
              desc: 'عصاره‌گیری قهوه با دستگاه اسپرسوساز و آماده‌سازی شیر بادام در حال انجام است.',
              time: '۱۸:۲۰',
              status: 'current',
            },
            {
              id: 'step-4',
              stepNumber: 4,
              title: 'تزیین و آماده تحویل',
              desc: 'طراحی لته‌آرت و بسته‌بندی کروسان تازه روی سینی مخصوص سرو.',
              time: '۱۸:۲۸ (تخمینی)',
              status: 'upcoming',
            },
            {
              id: 'step-5',
              stepNumber: 5,
              title: 'تحویل روی میز ۷',
              desc: 'سفارش با لبخند تحویل شما داده خواهد شد. نوش جان!',
              time: '۱۸:۳۲ (تخمینی)',
              status: 'upcoming',
            },
          ],
          items: [
            { 
              id: '1', 
              name: 'لته آرت', 
              subName: 'با شیر بادام و سیروپ کارامل',
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
              subName: 'تازه‌پز فرانسوی',
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
          tableNumber: 'میز ۲',
          orderType: 'بیرون‌بر',
          totalPrice: 89000,
          status: 'delivered',
          currentStepIndex: 4,
          timeline: [
            {
              id: 'step-1',
              stepNumber: 1,
              title: 'ثبت سفارش',
              desc: 'سفارش در سیستم ثبت شد.',
              time: '۱۱:۴۵',
              status: 'completed',
            },
            {
              id: 'step-2',
              stepNumber: 2,
              title: 'تایید باریستا',
              desc: 'اقلام سفارش تایید شد.',
              time: '۱۱:۴۸',
              status: 'completed',
            },
            {
              id: 'step-3',
              stepNumber: 3,
              title: 'آماده‌سازی و بسته‌بندی',
              desc: 'آماده‌سازی آیس‌کافی و کوکی تکمیل شد.',
              time: '۱۱:۵۵',
              status: 'completed',
            },
            {
              id: 'step-4',
              stepNumber: 4,
              title: 'آماده تحویل بیرون‌بر',
              desc: 'بسته‌بندی در پاکت کاغذی دوستدار محیط زیست قرار گرفت.',
              time: '۱۲:۰۰',
              status: 'completed',
            },
            {
              id: 'step-5',
              stepNumber: 5,
              title: 'تحویل داده شد',
              desc: 'سفارش با موفقیت تحویل مشتری گردید.',
              time: '۱۲:۰۵',
              status: 'completed',
            },
          ],
          items: [
            { 
              id: '3', 
              name: 'آیس کافی', 
              price: 55000, 
              quantity: 1, 
              image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400',
              rating: 4.2,
              subName: 'سرد و نشاط‌آور',
              category: 'ESPRESSO' as any,
              description: '',
              volume: '400ml',
              cartId: '3'
            },
            { 
              id: '4', 
              name: 'کوکی گردو و شکلات', 
              price: 34000, 
              quantity: 1, 
              image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400',
              rating: 4.5,
              subName: 'شکلات بلژیکی',
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
    }, 400);
  });
};

export const fetchOrderById = async (id: string): Promise<Order | undefined> => {
  const orders = await fetchOrders();
  const found = orders.find(o => o.id === id);
  if (found) return found;

  // Fallback to active order template if custom ID requested
  return {
    ...orders[0],
    id: id
  };
};

