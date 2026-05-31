
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, ArrowLeft, ClipboardList } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Button from '../components/Button';

const PaymentResult: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const tableId = searchParams.get('tableId');
  const isSuccess = status === 'success';

  const isTableType = type === 'table';

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-dark px-8 flex flex-col items-center justify-center text-center" dir="rtl">
        
        <div className={`w-32 h-32 ${isSuccess ? 'bg-green-500 shadow-green-500/20' : 'bg-red-500 shadow-red-500/20'} rounded-[44px] flex items-center justify-center text-white shadow-2xl mb-8`}>
          {isSuccess ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 10, stiffness: 100 }}
            >
              <Check size={56} strokeWidth={3} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 10, stiffness: 100 }}
            >
              <X size={56} strokeWidth={3} />
            </motion.div>
          )}
        </div>

        <div className="space-y-3 mb-12">
          <h2 className="text-2.5xl font-black text-dark dark:text-white leading-tight">
            {isSuccess 
              ? (isTableType ? 'رزرو مـیز بـا موفـقیت ثبت شد ☕' : 'پرداخت موفقیت‌آمیز') 
              : (isTableType ? 'رزرو ناموفق میز' : 'پرداخت ناموفق')}
          </h2>
          <p className="text-xs text-muted dark:text-white/40 font-bold max-w-[280px] mx-auto leading-relaxed">
            {isSuccess 
              ? (isTableType 
                  ? `ببیعانه رزرو میز شماره ${tableId} با موفقیت ثبت شد. این میز تا یک ساعت آینده منتظر حضور صمیمانه شماست تا با اسکن زنده سفارش خود را آغاز کنید.`
                  : 'تراکنش شما با موفقیت ثبت شد. سفارش شما اکنون در مرحله آماده‌سازی قرار دارد.') 
              : 'متأسفانه مشکلی در فرآیند پرداخت به وجود آمد. مبلغ کسر شده تا ۷۲ ساعت آینده به حساب شما بازمی‌گردد.'}
          </p>
        </div>

        {isSuccess && (
          <div className="w-full bg-lightGray dark:bg-white/5 p-6 rounded-[32px] border border-gray-100 dark:border-white/5 mb-10 space-y-4">
             <div className="flex justify-between items-center text-sm">
                <span className="text-muted dark:text-white/40 font-bold">شماره پیگیری</span>
                <span className="text-dark dark:text-white font-black font-mono">TRX-948520</span>
             </div>
             <div className="h-px bg-gray-200/50 dark:bg-white/10" />
             <div className="flex justify-between items-center text-sm">
                <span className="text-muted dark:text-white/40 font-bold">زمان تراکنش</span>
                <span className="text-dark dark:text-white font-black font-mono">
                  {new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
             </div>
          </div>
        )}

        <div className="w-full space-y-4">
          {isSuccess ? (
            isTableType ? (
              <Button 
                onClick={() => navigate('/tables')}
                className="w-full h-16 rounded-2xl flex items-center justify-center gap-2 group text-sm font-black"
                id="view-reserved-table-btn"
              >
                <span>مشاهده وضعیت میزها</span>
                <ClipboardList size={18} className="group-hover:rotate-12 transition-transform" />
              </Button>
            ) : (
              <Button 
                onClick={() => navigate('/success')}
                className="w-full h-16 rounded-2xl flex items-center justify-center gap-2 group"
              >
                <span>جزئیات دقیق سفارش</span>
                <ClipboardList size={18} className="group-hover:rotate-12 transition-transform" />
              </Button>
            )
          ) : (
            <Button 
              onClick={() => navigate(isTableType ? '/tables' : '/online-order')}
              className="w-full h-16 rounded-2xl text-sm font-black"
            >
              تلاش مجدد
            </Button>
          )}

          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 w-full py-4 text-xs font-black text-muted dark:text-white/30 hover:text-dark dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>بازگشت به صفحه اصلی</span>
          </button>
        </div>

      </div>
    </PageTransition>
  );
};

export default PaymentResult;
