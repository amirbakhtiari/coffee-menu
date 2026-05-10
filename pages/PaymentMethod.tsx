
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, CreditCard, Banknote, ShieldCheck } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import AppBar from '../components/AppBar';

const PaymentMethod: React.FC = () => {
  const navigate = useNavigate();

  const handleSelect = (method: 'online' | 'in-person') => {
    if (method === 'online') {
      navigate('/online-order');
    } else {
      navigate('/offline-order');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-lightGray dark:bg-dark px-6 pt-12 pb-24 flex flex-col gap-10 text-right transition-colors">
        <AppBar 
          title="روش پرداخت"
          onBack={() => navigate(-1)}
        />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 mb-2">
            <h2 className="text-lg font-black text-dark dark:text-white leading-tight">نحوه پرداخت خود را انتخاب کنید</h2>
            <p className="text-muted dark:text-white/40 text-xs font-medium">لطفاً یکی از روش‌های زیر را برای تسویه حساب انتخاب نمایید</p>
          </div>

          <div className="grid gap-4">
            {/* گزینه پرداخت آنلاین */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect('online')}
              className="relative overflow-hidden bg-white dark:bg-black/20 p-6 rounded-[32px] border-2 border-transparent hover:border-primary/20 shadow-sm flex items-center gap-5 text-right group transition-all"
            >
              <div className="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <CreditCard size={28} />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-base text-dark dark:text-white">پرداخت آنلاین</h3>
                <p className="text-[11px] text-muted dark:text-white/40 font-medium mt-1">امن، سریع و با تایید هویت پیامکی</p>
              </div>
              <ChevronRight size={20} className="text-gray-300 dark:text-white/10 rotate-180" />
            </motion.button>

            {/* گزینه پرداخت حضوری */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect('in-person')}
              className="relative overflow-hidden bg-white dark:bg-black/20 p-6 rounded-[32px] border-2 border-transparent hover:border-primary/20 shadow-sm flex items-center gap-5 text-right group transition-all"
            >
              <div className="w-14 h-14 bg-dark/5 dark:bg-white/5 rounded-2xl flex items-center justify-center text-dark/40 dark:text-white/40 group-hover:bg-dark group-hover:bg-white/10 group-hover:text-white transition-colors">
                <Banknote size={28} />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-base text-dark dark:text-white">پرداخت حضوری</h3>
                <p className="text-[11px] text-muted dark:text-white/40 font-medium mt-1">تسویه حساب در محل صندوق کافه</p>
              </div>
              <ChevronRight size={20} className="text-gray-300 dark:text-white/10 rotate-180" />
            </motion.button>
          </div>
        </div>

        <div className="mt-auto bg-white/50 dark:bg-white/5 backdrop-blur-md p-6 rounded-[32px] border border-white dark:border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          <p className="text-[10px] text-dark/60 dark:text-white/60 font-black leading-relaxed">
            تمامی پرداخت‌ها در بستر امن بانکی انجام شده و اطلاعات شما کاملاً محافظت شده باقی می‌ماند.
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default PaymentMethod;
