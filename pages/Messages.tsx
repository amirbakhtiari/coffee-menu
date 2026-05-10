
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Bell, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import PageTransition from '../components/PageTransition';
import AppBar from '../components/AppBar';

// Dummy API function for test
const fetchNotifications = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: 1, title: 'سفارش شما تایید شد', desc: 'کاپوچینوی داغ شما در حال آماده‌سازی است.', time: '۵ دقیقه پیش', read: false },
    { id: 2, title: 'کد تخفیف ویژه', desc: 'برای خرید بعدی از ۲۰٪ تخفیف بهره‌مند شوید: COFFEE20', time: '۲ ساعت پیش', read: true },
    { id: 3, title: 'به کافه لند خوش آمدید', desc: 'از منوی جدید ما دیدن کنید و لذت ببرید.', time: '۱ روز پیش', read: true },
  ];
};

const Messages: React.FC = () => {
  const navigate = useNavigate();
  const [localReadStatus, setLocalReadStatus] = useState<Record<number, boolean>>({});

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  });

  const markAllAsRead = () => {
    if (!notifications) return;
    const newStatus = { ...localReadStatus };
    notifications.forEach(n => {
      newStatus[n.id] = true;
    });
    setLocalReadStatus(newStatus);
  };

  return (
    <PageTransition>
      <div className="px-6 pt-12 pb-32 min-h-screen bg-lightGray dark:bg-dark text-right transition-colors">
        <AppBar 
          title="پیام‌ها"
          onBack={() => navigate('/')}
          rightAction={
            <button 
              onClick={markAllAsRead}
              className="w-10 h-10 bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-50 dark:border-white/5 flex items-center justify-center text-primary active:scale-90 transition-transform"
              title="علامت‌گذاری همه به عنوان خوانده شده"
            >
              <CheckCircle2 size={20} />
            </button>
          }
        />

        <div className="flex flex-col gap-3">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-black/20 p-5 rounded-[32px] border border-gray-50 dark:border-white/5 animate-pulse flex flex-row-reverse items-center justify-between">
                <div className="flex flex-row-reverse items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-2xl"></div>
                  <div className="space-y-2">
                    <div className="h-3 w-32 bg-gray-100 dark:bg-white/5 rounded-full"></div>
                    <div className="h-2 w-24 bg-gray-50 dark:bg-white/5 rounded-full"></div>
                  </div>
                </div>
                <div className="h-3 w-4 bg-primary/20 rounded-full"></div>
              </div>
            ))
          ) : (
            notifications?.map((notif) => {
              const isRead = localReadStatus[notif.id] || notif.read;
              return (
                <div 
                  key={notif.id} 
                  className={`p-4 rounded-3xl border flex flex-row-reverse gap-4 items-start transition-all cursor-pointer ${
                    isRead 
                      ? 'bg-white dark:bg-black/20 border-gray-100 dark:border-white/5' 
                      : 'bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30 shadow-sm'
                  }`}
                  onClick={() => setLocalReadStatus({ ...localReadStatus, [notif.id]: true })}
                >
                  <div className={`p-3 rounded-2xl shrink-0 ${
                    isRead 
                      ? 'bg-gray-50 dark:bg-white/5 text-muted dark:text-white/40' 
                      : 'bg-primary text-white shadow-lg shadow-primary/20'
                  }`}>
                    <Bell size={20} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex flex-row-reverse justify-between items-center mb-1">
                      <h3 className={`font-black text-sm truncate ${isRead ? 'text-dark/70 dark:text-white/60' : 'text-dark dark:text-white'}`}>{notif.title}</h3>
                      <span className="text-[9px] text-muted dark:text-white/40 font-bold whitespace-nowrap ml-2">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-muted dark:text-white/40 leading-relaxed font-bold">{notif.desc}</p>
                  </div>
                  {!isRead && (
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 animate-pulse shrink-0"></div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {!isLoading && notifications && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted dark:text-white/20">
            <Bell size={48} className="opacity-10 mb-4" />
            <p className="text-sm font-black">پیامی ندارید</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Messages;
