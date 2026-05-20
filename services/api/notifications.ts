
export const fetchNotifications = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: 1, title: 'سفارش شما تایید شد', desc: 'کاپوچینوی داغ شما در حال آماده‌سازی است.', time: '۵ دقیقه پیش', read: false },
    { id: 2, title: 'کد تخفیف ویژه', desc: 'برای خرید بعدی از ۲۰٪ تخفیف بهره‌مند شوید: COFFEE20', time: '۲ ساعت پیش', read: true },
    { id: 3, title: 'به کافه لند خوش آمدید', desc: 'از منوی جدید ما دیدن کنید و لذت ببرید.', time: '۱ روز پیش', read: true },
  ];
};
