
export interface NotificationItem {
  id: number;
  type: 'order' | 'discount' | 'system';
  orderId?: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

export const fetchNotifications = async (): Promise<NotificationItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    { 
      id: 1, 
      type: 'order',
      orderId: 'ORD-1245',
      title: 'سفارش شما تایید شد', 
      desc: 'کاپوچینوی داغ و لته آرت شما در حال آماده‌سازی و دم‌آوری است.', 
      time: '۵ دقیقه پیش', 
      read: false 
    },
    { 
      id: 2, 
      type: 'discount',
      title: 'کد تخفیف ویژه ۲۰٪', 
      desc: 'برای سفارش بعدی خود از کد تخفیف COFFEE20 استفاده کنید.', 
      time: '۲ ساعت پیش', 
      read: true 
    },
    { 
      id: 3, 
      type: 'order',
      orderId: 'ORD-1198',
      title: 'سفارش قبلی تحویل شد', 
      desc: 'سفارش آیس کافی و کوکی با موفقیت تحویل شد. مشاهده فاکتور و زمان‌بندی.', 
      time: 'دیروز', 
      read: true 
    },
    { 
      id: 4, 
      type: 'system',
      title: 'به کافه لند خوش آمدید', 
      desc: 'با هر سفارش در باشگاه مشتریان امتیاز کسب کنید و از جوایز ویژه بهره‌مند شوید.', 
      time: '۳ روز پیش', 
      read: true 
    },
  ];
};

