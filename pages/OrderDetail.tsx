import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Package, Calendar, CreditCard, Coins, CheckCircle2, Clock, XCircle, MapPin, Loader2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import AppBar from '../components/AppBar';
import { useOrder } from '../hooks/api/useOrdersApi';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading: loading } = useOrder(id);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'delivered': return { label: 'تحویل شده', color: 'text-green-500', bg: 'bg-green-50', icon: <CheckCircle2 size={18} /> };
      case 'pending': return { label: 'در حال آماده‌سازی', color: 'text-orange-500', bg: 'bg-orange-50', icon: <Clock size={18} /> };
      default: return { label: 'لغو شده', color: 'text-red-500', bg: 'bg-red-50', icon: <XCircle size={18} /> };
    }
  };

  if (loading) return (
    <PageTransition>
      <div className="h-screen flex flex-col bg-lightGray dark:bg-dark overflow-hidden transition-colors" dir="rtl">
        <div className="px-6 pt-6 mb-1 shrink-0">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-black/20 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-white dark:bg-black/20 rounded-lg animate-pulse" />
              <div className="h-3 w-48 bg-white dark:bg-black/20 rounded-lg animate-pulse opacity-60" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-6">
          {/* Status Skeleton */}
          <div className="bg-white dark:bg-black/20 p-5 rounded-[32px] border border-gray-100 dark:border-white/5 flex flex-row items-center justify-between animate-pulse">
            <div className="flex flex-row items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl" />
              <div className="h-4 w-24 bg-gray-50 dark:bg-white/5 rounded-lg" />
            </div>
            <div className="h-3 w-32 bg-gray-50 dark:bg-white/5 rounded-lg" />
          </div>

          {/* Items Skeleton */}
          <div className="space-y-3">
            <div className="h-3 w-20 bg-gray-200 dark:bg-white/5 rounded mr-2 mb-2 animate-pulse" />
            {[1, 2].map((i) => (
              <div key={i} className="bg-white dark:bg-black/20 p-4 rounded-[28px] border border-gray-50 dark:border-white/5 flex flex-row items-center gap-4 animate-pulse">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-50 dark:bg-white/5 rounded-lg" />
                  <div className="h-3 w-1/2 bg-gray-50 dark:bg-white/5 rounded-lg opacity-50" />
                  <div className="flex justify-between mt-2">
                    <div className="h-4 w-16 bg-gray-50 dark:bg-white/5 rounded-lg" />
                    <div className="h-4 w-12 bg-gray-50 dark:bg-white/5 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Details Skeleton */}
          <div className="bg-white dark:bg-black/20 p-6 rounded-[32px] border border-gray-100 dark:border-white/5 space-y-5 animate-pulse">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-20 bg-gray-50 dark:bg-white/5 rounded" />
                <div className="h-4 w-full bg-gray-50 dark:bg-white/5 rounded-lg" />
              </div>
            </div>
            <div className="h-px bg-gray-50 dark:bg-white/5" />
            <div className="flex justify-between">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-gray-50 dark:bg-white/5 rounded" />
                  <div className="h-4 w-20 bg-gray-50 dark:bg-white/5 rounded-lg" />
                </div>
              </div>
              <div className="space-y-2 text-left">
                <div className="h-3 w-24 bg-gray-50 dark:bg-white/5 rounded mr-auto" />
                <div className="h-4 w-12 bg-gray-50 dark:bg-white/5 rounded-lg mr-auto" />
              </div>
            </div>
          </div>

          {/* Invoice Skeleton */}
          <div className="bg-dark rounded-[28px] p-6 animate-pulse">
            <div className="flex justify-between mb-4">
              <div className="h-4 w-20 bg-white/10 rounded" />
              <div className="h-4 w-24 bg-white/10 rounded" />
            </div>
            <div className="flex justify-between items-end">
              <div className="h-3 w-16 bg-white/10 rounded" />
              <div className="h-8 w-32 bg-white/10 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );

  if (!order) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-muted font-black">
      سفارش یافت نشد
    </div>
  );

  const statusInfo = getStatusInfo(order.status);

  return (
    <PageTransition>
      <div className="h-screen flex flex-col bg-lightGray dark:bg-dark overflow-hidden transition-colors" dir="rtl">
        <div className="px-6 pt-6 mb-1 shrink-0">
          <AppBar 
            title="جزئیات سفارش"
            subtitle={`شناسه: ${order.id}`}
            onBack={() => navigate('/orders')}
            className="mb-1"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-6">
          {/* وضعیت سفارش */}
          <section className="bg-white dark:bg-black/20 p-5 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-3">
              <div className={`w-10 h-10 ${statusInfo.bg} dark:bg-white/5 ${statusInfo.color} rounded-xl flex items-center justify-center`}>
                {statusInfo.icon}
              </div>
              <span className={`font-black text-sm ${statusInfo.color}`}>{statusInfo.label}</span>
            </div>
            <div className="flex flex-row items-center gap-2 text-muted dark:text-white/40">
              <Calendar size={14} />
              <span className="text-[10px] font-bold">{order.date} - {order.time}</span>
            </div>
          </section>

          {/* آیتم‌های سفارش */}
          <section className="space-y-3">
            <h3 className="text-xs font-black text-dark dark:text-white mr-2 mb-2">اقلام سفارش</h3>
            {order.items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-black/20 p-4 rounded-[28px] border border-gray-50 dark:border-white/5 flex flex-row items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-cover" />
                <div className="flex-1 text-right">
                  <h4 className="font-black text-sm text-dark dark:text-white">{item.name}</h4>
                  <p className="text-[10px] text-muted dark:text-white/40 font-bold mt-0.5">{item.subName}</p>
                  <div className="flex flex-row justify-between items-center mt-2">
                    <div className="flex items-center gap-1 text-xs font-black text-dark dark:text-white">
                      <span>{item.price.toLocaleString()}</span>
                      <span className="text-[10px] text-primary italic">T</span>
                    </div>
                    <div className="flex flex-row items-center gap-1.5 px-2 py-1 bg-primary/5 dark:bg-primary/10 rounded-lg">
                      <Coins size={10} className="text-primary" />
                      <span className="text-[9px] font-black text-primary">+{item.pointsEach} امتیاز</span>
                    </div>
                  </div>
                </div>
                <div className="w-8 h-8 bg-lightGray dark:bg-white/5 rounded-xl flex items-center justify-center text-xs font-black text-dark dark:text-white">
                  {item.quantity}x
                </div>
              </div>
            ))}
          </section>

          {/* اطلاعات پرداخت و آدرس */}
          <section className="bg-white dark:bg-black/20 p-6 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm space-y-5">
            <div className="flex flex-row items-start gap-4">
              <div className="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-primary shrink-0">
                <MapPin size={20} />
              </div>
              <div className="text-right">
                <h4 className="text-[11px] font-black text-muted dark:text-white/40 mb-1">آدرس تحویل</h4>
                <p className="text-xs font-black text-dark dark:text-white leading-relaxed">{order.address}</p>
              </div>
            </div>

            <div className="h-px bg-gray-50 dark:bg-white/5"></div>

            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-primary">
                  <CreditCard size={20} />
                </div>
                <div className="text-right">
                  <h4 className="text-[11px] font-black text-muted dark:text-white/40 mb-0.5">روش پرداخت</h4>
                  <p className="text-xs font-black text-dark dark:text-white">{order.paymentMethod}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <h4 className="text-[11px] font-black text-muted dark:text-white/40 mb-0.5">مجموع امتیاز هدیه</h4>
                <div className="flex flex-row items-center gap-1 text-primary">
                  <Coins size={14} />
                  <span className="text-sm font-black">+{order.points}</span>
                </div>
              </div>
            </div>
          </section>

          {/* فاکتور نهایی - Ultra Compact Style */}
          <section className="bg-dark rounded-[28px] p-4 text-white shadow-xl">
            <div className="space-y-1.5 px-1">
              {order.summary.discount > 0 ? (
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-1.5">
                   <div className="flex flex-col text-right">
                      <span className="text-[9px] opacity-30 font-bold">مجموع اقلام</span>
                      <span className="text-[10px] opacity-60 font-black" dir="ltr">{order.summary.subtotal.toLocaleString()} T</span>
                   </div>
                   <div className="flex flex-col text-left">
                      <span className="text-red-400 text-[9px] font-bold opacity-60">تخفیف</span>
                      <span className="text-red-400 text-[10px] font-black" dir="ltr">{order.summary.discount.toLocaleString()} T</span>
                   </div>
                </div>
              ) : (
                <div className="flex flex-row justify-between items-center text-[10px] opacity-40 font-bold mb-1">
                  <span>مجموع اقلام</span>
                  <span dir="ltr">{order.summary.subtotal.toLocaleString()} T</span>
                </div>
              )}
              
              <div className="flex flex-row justify-between items-center">
                <span className="font-black text-[11px] opacity-50">مبلغ نهایی</span>
                <div className="flex items-center gap-1 font-black text-lg text-primary leading-none">
                  <span>{order.summary.total.toLocaleString()}</span>
                  <span className="text-[10px] italic">T</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
};

export default OrderDetail;
