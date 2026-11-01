import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Bell, CheckCircle2, Coffee, Tag, Clock } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import AppBar from '../components/AppBar';
import { useNotificationsApi } from '../hooks/api/useNotificationsApi';
import { useTranslation } from '../store/useLanguageStore';

const Messages: React.FC = () => {
  const navigate = useNavigate();
  const { t, isRTL, dir } = useTranslation();
  const [localReadStatus, setLocalReadStatus] = useState<Record<number, boolean>>({});

  const { data: notifications = [], isLoading } = useNotificationsApi();

  const markAllAsRead = () => {
    if (!notifications) return;
    const newStatus = { ...localReadStatus };
    (notifications as any[]).forEach(n => {
      newStatus[n.id] = true;
    });
    setLocalReadStatus(newStatus);
  };

  const handleNotificationClick = (notif: any) => {
    // Mark as read locally
    setLocalReadStatus(prev => ({ ...prev, [notif.id]: true }));

    // Check if this notification is order-related
    const isOrderRelated = notif.type === 'order' || !!notif.orderId || notif.title?.includes('سفارش') || notif.desc?.includes('سفارش');
    if (isOrderRelated) {
      const targetOrderId = notif.orderId || 'ORD-1245';
      navigate(`/order/${targetOrderId}`);
    }
  };

  const getNotifIcon = (notif: any, isRead: boolean) => {
    const isOrder = notif.type === 'order' || !!notif.orderId || notif.title?.includes('سفارش');
    const isDiscount = notif.type === 'discount' || notif.title?.includes('تخفیف');

    if (isOrder) {
      return <Coffee size={19} className={isRead ? 'text-muted' : 'text-white'} />;
    }
    if (isDiscount) {
      return <Tag size={19} className={isRead ? 'text-muted' : 'text-white'} />;
    }
    return <Bell size={19} className={isRead ? 'text-muted' : 'text-white'} />;
  };

  const ForwardChevron = isRTL ? ChevronLeft : ChevronRight;

  return (
    <PageTransition>
      <div className="px-6 pt-12 pb-32 min-h-screen bg-lightGray dark:bg-dark text-start transition-colors" dir={dir}>
        <AppBar 
          title={t('messages_title')}
          onBack={() => navigate('/')}
          rightAction={
            <button 
              onClick={markAllAsRead}
              className="w-10 h-10 bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-50 dark:border-white/5 flex items-center justify-center text-primary active:scale-90 transition-transform cursor-pointer"
              title={t('mark_all_read')}
            >
              <CheckCircle2 size={20} />
            </button>
          }
        />

        <div className="flex flex-col gap-3">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-black/20 p-5 rounded-[28px] border border-gray-50 dark:border-white/5 animate-pulse flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-4">
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
            notifications?.map((notif: any) => {
              const isRead = localReadStatus[notif.id] ?? notif.read;
              const isOrder = notif.type === 'order' || !!notif.orderId || notif.title?.includes('سفارش');

              return (
                <div 
                  key={notif.id} 
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 rounded-[26px] border flex flex-col gap-2 transition-all cursor-pointer active:scale-[0.99] select-none ${
                    isRead 
                      ? 'bg-white dark:bg-black/20 border-gray-100 dark:border-white/5 hover:border-gray-200' 
                      : 'bg-primary/5 dark:bg-primary/10 border-primary/25 dark:border-primary/30 shadow-sm'
                  }`}
                >
                  <div className="flex flex-row gap-3.5 items-start">
                    <div className={`p-3 rounded-2xl shrink-0 mt-0.5 ${
                      isRead 
                        ? 'bg-gray-100 dark:bg-white/5 text-muted dark:text-white/40' 
                        : 'bg-primary text-white shadow-md shadow-primary/20'
                    }`}>
                      {getNotifIcon(notif, isRead)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex flex-row justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-black text-sm truncate ${isRead ? 'text-dark/80 dark:text-white/70' : 'text-dark dark:text-white'}`}>
                            {notif.title}
                          </h3>
                          {isOrder && (
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-primary/10 text-primary dark:bg-primary/20">
                              {t('order_badge')}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted dark:text-white/40 font-bold whitespace-nowrap mx-2">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted dark:text-white/50 leading-relaxed font-bold">
                        {notif.desc}
                      </p>
                    </div>
                    {!isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 animate-pulse shrink-0"></div>
                    )}
                  </div>

                  {/* Order Timeline Action Pill */}
                  {isOrder && (
                    <div className="mt-1 pt-2.5 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-primary font-black text-xs">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Clock size={13} className="text-primary" />
                        <span>{t('order_timeline_btn')}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-black">
                        <ForwardChevron size={14} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {!isLoading && notifications && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted dark:text-white/20">
            <Bell size={48} className="opacity-10 mb-4" />
            <p className="text-sm font-black">{t('no_messages')}</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Messages;
