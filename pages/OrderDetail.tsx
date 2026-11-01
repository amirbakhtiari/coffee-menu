import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Package, 
  Calendar, 
  CreditCard, 
  Coins, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MapPin, 
  Coffee, 
  ShoppingBag, 
  Sparkles, 
  PackageCheck, 
  Smile, 
  RefreshCw, 
  PhoneCall,
  Store,
  Check
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import AppBar from '../components/AppBar';
import { useOrder } from '../hooks/api/useOrdersApi';
import { OrderTimelineStep } from '../types';
import { useTranslation } from '../store/useLanguageStore';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, isRTL, dir } = useTranslation();

  const { data: order, isLoading: loading } = useOrder(id);

  // Allow interactive demonstration/simulation of the timeline steps
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(2);

  const localizedDefaultSteps: OrderTimelineStep[] = [
    {
      id: 'step-1',
      stepNumber: 1,
      title: t('timeline_step1_title'),
      desc: t('timeline_step1_desc'),
      time: '18:15',
      status: 'completed'
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: t('timeline_step2_title'),
      desc: t('timeline_step2_desc'),
      time: '18:18',
      status: 'completed'
    },
    {
      id: 'step-3',
      stepNumber: 3,
      title: t('timeline_step3_title'),
      desc: t('timeline_step3_desc'),
      time: '18:22',
      status: 'current'
    },
    {
      id: 'step-4',
      stepNumber: 4,
      title: t('timeline_step4_title'),
      desc: t('timeline_step4_desc'),
      time: '18:30',
      status: 'upcoming'
    },
    {
      id: 'step-5',
      stepNumber: 5,
      title: t('timeline_step5_title'),
      desc: t('timeline_step5_desc'),
      time: '18:35',
      status: 'upcoming'
    }
  ];

  useEffect(() => {
    if (order) {
      if (order.status === 'delivered') {
        setCurrentStepIdx(4);
      } else if (order.currentStepIndex !== undefined) {
        setCurrentStepIdx(order.currentStepIndex);
      } else {
        setCurrentStepIdx(2);
      }
    }
  }, [order]);

  const rawSteps = localizedDefaultSteps;

  // Build reactive steps matching currentStepIdx
  const activeSteps: OrderTimelineStep[] = rawSteps.map((step, idx) => {
    let status: 'completed' | 'current' | 'upcoming' = 'upcoming';
    if (idx < currentStepIdx) {
      status = 'completed';
    } else if (idx === currentStepIdx) {
      status = 'current';
    } else {
      status = 'upcoming';
    }
    return { ...step, status };
  });

  const getStepIcon = (index: number, status: 'completed' | 'current' | 'upcoming') => {
    if (status === 'completed') {
      return <Check size={16} strokeWidth={3} className="text-white" />;
    }
    switch (index) {
      case 0:
        return <PackageCheck size={16} strokeWidth={2.5} />;
      case 1:
        return <CheckCircle2 size={16} strokeWidth={2.5} />;
      case 2:
        return <Coffee size={16} strokeWidth={2.5} />;
      case 3:
        return <Sparkles size={16} strokeWidth={2.5} />;
      case 4:
        return <Smile size={16} strokeWidth={2.5} />;
      default:
        return <Clock size={16} strokeWidth={2.5} />;
    }
  };

  const handleAdvanceStep = () => {
    setCurrentStepIdx(prev => (prev < activeSteps.length - 1 ? prev + 1 : 0));
  };

  const progressPercent = Math.round(((currentStepIdx + 1) / activeSteps.length) * 100);

  if (loading || !order) {
    return (
      <PageTransition>
        <div className="px-6 pt-12 pb-32 min-h-screen bg-lightGray dark:bg-dark text-start transition-colors" dir={dir}>
          <AppBar title={t('order_detail_title')} onBack={() => navigate(-1)} />
          <div className="flex flex-col gap-4 mt-6 animate-pulse">
            <div className="h-32 bg-white dark:bg-black/20 rounded-[32px] w-full" />
            <div className="h-64 bg-white dark:bg-black/20 rounded-[32px] w-full" />
            <div className="h-40 bg-white dark:bg-black/20 rounded-[32px] w-full" />
          </div>
        </div>
      </PageTransition>
    );
  }

  const linePositionClass = isRTL ? 'right-[18px]' : 'left-[18px]';

  return (
    <PageTransition>
      <div className="px-6 pt-12 pb-32 min-h-screen bg-lightGray dark:bg-dark text-start transition-colors select-none" dir={dir}>
        <AppBar 
          title={t('order_detail_title')}
          subtitle={`${t('order_code_label')}: #${order.id}`}
          onBack={() => navigate(-1)}
          rightAction={
            <button
              onClick={handleAdvanceStep}
              className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-[10px] font-black flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
              title="Next Step"
            >
              <RefreshCw size={12} className={currentStepIdx < 4 ? 'animate-spin-slow' : ''} />
              <span>{t('step_next_btn')}</span>
            </button>
          }
        />

        <div className="flex flex-col gap-5 mt-2">
          
          {/* کارت وضعیت کلی و زمان تخمینی */}
          <section className="bg-white dark:bg-black/20 p-5 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Package size={18} />
                </div>
                <div>
                  <h2 className="text-xs font-black text-dark dark:text-white leading-tight">
                    {t('order_code_label')} #{order.id}
                  </h2>
                  <span className="text-[10px] text-muted dark:text-white/40 font-bold">
                    {order.date}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                  currentStepIdx === 4
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-primary/10 text-primary border border-primary/20'
                }`}>
                  {currentStepIdx === 4 ? t('order_status_delivered') : t('order_status_pending')}
                </span>
                <span className="text-[10px] font-bold mt-0.5">{order.time || '18:15'}</span>
              </div>
            </div>

            {/* Estimated time pill */}
            <div className="bg-primary/5 dark:bg-primary/10 border border-primary/15 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span className="text-xs font-black text-dark dark:text-white">
                  {currentStepIdx === 4 ? t('timeline_step5_title') : activeSteps[currentStepIdx]?.title}
                </span>
              </div>
              <span className="text-xs font-black text-primary font-mono" dir="ltr">{progressPercent}%</span>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </section>

          {/* بخش اصلی: تایم‌لاین مرحله‌به‌مرحله سفارش */}
          <section className="bg-white dark:bg-black/20 p-6 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-50 dark:border-white/5">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                <h3 className="text-sm font-black text-dark dark:text-white">{t('timeline_title')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStepIdx(0)}
                className="text-[10px] font-bold text-muted hover:text-primary dark:text-white/40 cursor-pointer"
              >
                {t('step_reset_btn')}
              </button>
            </div>

            {/* Vertical Timeline Tree */}
            <div className="relative pt-2 pb-1 space-y-6">
              {activeSteps.map((step, idx) => {
                const isCompleted = step.status === 'completed';
                const isCurrent = step.status === 'current';
                const isLast = idx === activeSteps.length - 1;

                return (
                  <div key={step.id} className="relative flex items-start gap-4">
                    {/* Connecting Vertical Line */}
                    {!isLast && (
                      <div 
                        className={`absolute top-9 ${linePositionClass} w-0.5 h-[calc(100%+10px)] -translate-x-1/2 transition-colors duration-500 ${
                          isCompleted ? 'bg-primary' : isCurrent ? 'bg-gradient-to-b from-primary to-gray-200 dark:to-white/10' : 'bg-gray-100 dark:bg-white/5'
                        }`}
                      />
                    )}

                    {/* Step Icon Node */}
                    <div className="relative z-10 shrink-0">
                      {isCurrent ? (
                        <div className="relative w-9 h-9 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 ring-4 ring-primary/20">
                          {getStepIcon(idx, step.status)}
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                          </span>
                        </div>
                      ) : isCompleted ? (
                        <div className="w-9 h-9 rounded-2xl bg-primary/90 text-white flex items-center justify-center shadow-sm">
                          {getStepIcon(idx, step.status)}
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-muted/60 flex items-center justify-center">
                          {getStepIcon(idx, step.status)}
                        </div>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className={`flex-1 rounded-2xl p-3.5 transition-all text-start ${
                      isCurrent 
                        ? 'bg-primary/5 dark:bg-primary/10 border border-primary/20 shadow-sm' 
                        : isCompleted
                        ? 'bg-gray-50/50 dark:bg-white/[0.02] border border-gray-50 dark:border-white/5'
                        : 'opacity-50'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-xs font-black ${
                            isCurrent 
                              ? 'text-primary' 
                              : isCompleted 
                              ? 'text-dark dark:text-white' 
                              : 'text-muted dark:text-white/50'
                          }`}>
                            {step.title}
                          </h4>
                          {isCurrent && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-primary text-white">
                              {t('step_status_current')}
                            </span>
                          )}
                        </div>
                        {step.time && (
                          <span className="text-[10px] font-bold text-muted dark:text-white/40 whitespace-nowrap">
                            {step.time}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] leading-relaxed text-muted dark:text-white/60 font-bold">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* آیتم‌های سفارش - توجه: نام اختصاصی محصولات بدون تغییر حفظ می‌شود */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black text-dark dark:text-white">{t('order_items_title')}</h3>
              <span className="text-[10px] font-bold text-muted dark:text-white/40">
                {order.items.length} {t('products_count')}
              </span>
            </div>

            {order.items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-black/20 p-4 rounded-[28px] border border-gray-50 dark:border-white/5 flex flex-row items-center gap-4 shadow-sm">
                <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/5">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/30">
                      <Coffee size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-start">
                  {/* نام محصول به صورت نام اورجینال قهوه حفظ می‌شود */}
                  <h4 className="font-black text-sm text-dark dark:text-white">{item.name}</h4>
                  <p className="text-[10px] text-muted dark:text-white/40 font-bold mt-0.5">{item.subName || item.volume}</p>
                  <div className="flex flex-row justify-between items-center mt-2">
                    <div className="flex items-center gap-1 text-xs font-black text-dark dark:text-white">
                      <span>{item.price.toLocaleString()}</span>
                      <span className="text-[10px] text-primary">{t('currency')}</span>
                    </div>
                    <div className="flex flex-row items-center gap-1.5 px-2 py-1 bg-primary/5 dark:bg-primary/10 rounded-lg">
                      <Coins size={10} className="text-primary" />
                      <span className="text-[9px] font-black text-primary">+{item.pointsEach || 10} {t('points_label')}</span>
                    </div>
                  </div>
                </div>
                <div className="w-8 h-8 bg-lightGray dark:bg-white/5 rounded-xl flex items-center justify-center text-xs font-black text-dark dark:text-white">
                  {item.quantity}x
                </div>
              </div>
            ))}
          </section>

          {/* فاکتور نهایی */}
          <section className="bg-dark rounded-[28px] p-5 text-white shadow-xl space-y-3">
            <h4 className="text-xs font-black text-white/80 pb-1 border-b border-white/10">{t('invoice_summary')}</h4>
            <div className="space-y-2 border-b border-white/10 pb-3">
              <div className="flex justify-between items-center text-xs opacity-60 font-bold">
                <span>{t('subtotal')}</span>
                <span>{(order.summary?.subtotal || order.totalPrice).toLocaleString()} {t('currency')}</span>
              </div>
              {order.discount && order.discount > 0 && (
                <div className="flex justify-between items-center text-xs text-red-400 font-bold">
                  <span>{t('loyalty_discount')}</span>
                  <span>-{order.discount.toLocaleString()} {t('currency')}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="font-black text-xs opacity-80">{t('total_payable')}</span>
              <div className="flex items-center gap-1 font-black text-xl text-primary leading-none">
                <span>{(order.summary?.total || (order.totalPrice - (order.discount || 0))).toLocaleString()}</span>
                <span className="text-xs">{t('currency')}</span>
              </div>
            </div>
          </section>

          {/* کلیدهای اقدام سریع */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => navigate('/messages')}
              className="py-3 px-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 text-dark dark:text-white text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <span>{t('messages_title')}</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="py-3 px-4 rounded-2xl bg-primary text-white text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-primary/20 cursor-pointer"
            >
              <Coffee size={15} />
              <span>{t('browse_menu_btn')}</span>
            </button>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default OrderDetail;
