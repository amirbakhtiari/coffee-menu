
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
  const isSuccess = status === 'success';

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-dark px-8 flex flex-col items-center justify-center text-center">
        
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
          <h2 className="text-3xl font-black text-dark dark:text-white">
            {isSuccess ? 'پرداخت موفقیت‌آمیز' : 'پرداخت ناموفق'}
          </h2>
          <p className="text-sm text-muted dark:text-white/40 font-bold max-w-[280px] mx-auto leading-relaxed">
            {isSuccess 
              ? 'تراکنش شما با موفقیت ثبت شد. سفارش شما اکنون در مرحله آماده‌سازی قرار دارد.' 
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
                <span className="text-dark dark:text-white font-black font-mono">۱۴:۴۵:۲۳</span>
             </div>
          </div>
        )}

        <div className="w-full space-y-4">
          {isSuccess ? (
            <Button 
              onClick={() => navigate('/success')}
              className="w-full h-16 rounded-2xl flex items-center justify-center gap-2 group"
            >
              <span>جزئیات دقیق سفارش</span>
              <ClipboardList size={18} className="group-hover:rotate-12 transition-transform" />
            </Button>
          ) : (
            <Button 
              onClick={() => navigate('/online-order')}
              className="w-full h-16 rounded-2xl"
            >
              تلاش مجدد
            </Button>
          )}

          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 w-full py-4 text-sm font-black text-muted dark:text-white/30 hover:text-dark dark:hover:text-white transition-colors"
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
