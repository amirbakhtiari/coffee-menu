import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, History, CheckCircle2, Clock, XCircle, CreditCard, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import AppBar from '../components/AppBar';
import { useOrders } from '../hooks/api/useOrdersApi';

const Orders: React.FC = () => {
  const navigate = useNavigate();
  
  const { data: orders = [], isLoading: loading } = useOrders();

  return (
    <PageTransition>
      <div className="h-screen flex flex-col bg-lightGray dark:bg-dark overflow-hidden transition-colors" dir="rtl">
        <div className="px-6 pt-6 shrink-0 sticky top-0 z-50 bg-lightGray/95 dark:bg-dark/95 backdrop-blur-md pb-1 transition-colors">
          <AppBar 
            title="سفارشات من"
            subtitle="تاریخچه تمام فعالیت‌های شما"
            onBack={() => navigate('/profile')}
            className="mb-1"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-10 space-y-4 pt-2">
          {loading ? (
            // Placeholder Loading (Skeletons)
            Array(4).fill(0).map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-black/20 p-5 rounded-[32px] border border-gray-50 dark:border-white/5 animate-pulse">
                <div className="flex flex-row items-center justify-between mb-4">
                  <div className="flex flex-row items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-2xl"></div>
                    <div className="space-y-2">
                      <div className="h-3 w-24 bg-gray-100 dark:bg-white/5 rounded-full"></div>
                      <div className="h-2 w-16 bg-gray-50 dark:bg-white/5 rounded-full"></div>
                    </div>
                  </div>
                  <div className="h-5 w-20 bg-gray-100 dark:bg-white/5 rounded-full"></div>
                </div>
                <div className="flex flex-row justify-between pt-3 border-t border-gray-50 dark:border-white/5 mt-3 opacity-50">
                  <div className="h-2 w-20 bg-gray-100 dark:bg-white/5 rounded-full"></div>
                  <div className="h-2 w-20 bg-gray-100 dark:bg-white/5 rounded-full"></div>
                </div>
              </div>
            ))
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate(`/order/${order.id}`)}
                className="bg-white dark:bg-black/20 p-5 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden relative cursor-pointer active:scale-[0.99] transition-transform"
              >
                <div className="flex flex-row items-center justify-between mb-4">
                   <div className="flex flex-row items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      order.status === 'delivered' ? 'bg-green-50 dark:bg-green-500/10 text-green-500' : 
                      order.status === 'pending' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-500' : 'bg-red-50 dark:bg-red-500/10 text-red-500'
                    }`}>
                      {order.status === 'delivered' ? <CheckCircle2 size={24} /> : 
                       order.status === 'pending' ? <Clock size={24} /> : <XCircle size={24} />}
                    </div>
                    <div className="text-right">
                      <h4 className="font-black text-sm text-dark dark:text-white">کد سفارش: {order.id}</h4>
                      <p className="text-[10px] text-muted dark:text-white/40 font-bold mt-0.5">{order.date}</p>
                    </div>
                  </div>
                  <div className="text-left flex flex-col justify-center items-end">
                    <div className="flex items-center gap-1 text-sm font-black text-dark dark:text-white">
                      <span>{order.totalPrice.toLocaleString()}</span>
                      <span className="text-[10px] text-primary italic font-black">T</span>
                    </div>
                    {order.discount && order.discount > 0 && (
                      <div className="flex items-center gap-1 text-[9px] font-black text-red-500 mt-1 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full">
                        <span dir="ltr">{order.discount.toLocaleString()} T</span>
                        <span>تخفیف</span>
                      </div>
                    )}
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full block mt-2 ${
                      order.status === 'delivered' ? 'bg-green-500/10 text-green-600' : 
                      order.status === 'pending' ? 'bg-orange-500/10 text-orange-600' : 'bg-red-500/10 text-red-600'
                    }`}>
                      {order.status === 'delivered' ? 'تحویل شده' : 
                       order.status === 'pending' ? 'در حال آماده‌سازی' : 'لغو شده'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5 mt-4">
                  <div className="flex flex-row items-center gap-2 text-muted dark:text-white/40">
                    <CreditCard size={14} className="text-primary/60" />
                    <span className="text-[10px] font-bold">پرداخت: {order.paymentMethod}</span>
                  </div>
                  <div className="flex flex-row items-center gap-2 text-muted dark:text-white/40">
                    <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <Coins size={10} />
                    </div>
                    <span className="text-[10px] font-black text-primary">+{order.points} امتیاز هدیه</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-muted dark:text-white/20">
              <History size={64} className="opacity-10 mb-6" />
              <p className="font-black text-dark/60 dark:text-white/60">هنوز سفارشی ثبت نکرده‌اید</p>
              <button 
                onClick={() => navigate('/menu')}
                className="mt-6 text-primary text-sm font-black underline"
              >
                مشاهده منو و اولین سفارش
              </button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Orders;
