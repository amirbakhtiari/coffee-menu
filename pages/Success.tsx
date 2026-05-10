
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Coffee, ArrowLeft } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Button from '../components/Button';

const Success: React.FC = () => {
  const navigate = useNavigate();
  const orderCount = parseInt(localStorage.getItem('orderCount') || '3');

  const getOrdinalText = (num: number) => {
    const ordinals: { [key: number]: string } = {
      1: 'اولین',
      2: 'دومین',
      3: 'سومین',
      4: 'چهارمین',
      5: 'پنجمین',
      6: 'ششمین',
      7: 'هفتمین',
      8: 'هشتمین',
      9: 'نهمین',
      10: 'دهمین'
    };
    return ordinals[num] || `${num}ـُمین`;
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-dark flex flex-col items-center justify-center px-10 text-center gap-12 transition-colors">
        <div className="relative">
          {/* دایره‌های متحرک پشت آیکون */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute inset-0 bg-primary/5 dark:bg-primary/10 rounded-full"
          />
          
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="relative w-32 h-32 bg-primary rounded-[40px] flex items-center justify-center text-white shadow-2xl shadow-primary/30"
          >
            <Check size={64} strokeWidth={4} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-4 -right-4 w-12 h-12 bg-white dark:bg-black/80 rounded-2xl flex items-center justify-center text-primary shadow-xl border border-primary/10 transition-colors"
          >
            <Coffee size={24} />
          </motion.div>
        </div>

        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-primary/10 px-4 py-1.5 rounded-full inline-block mx-auto mb-2"
          >
            <span className="text-primary font-black text-xs">این {getOrdinalText(orderCount)} سفارش شماست! ☕️</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-2xl font-black text-dark dark:text-white"
          >
            سفارش شما با موفقیت ثبت شد!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-muted dark:text-white/40 text-[13px] font-medium leading-relaxed"
          >
            از انتخاب شما متشکریم. باریستاهای ما در حال آماده‌سازی سفارش لذت‌بخش شما هستند. به زودی از طریق اعلان‌ها مطلع خواهید شد.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="w-full flex flex-col gap-4"
        >
          <Button 
            onClick={() => navigate('/')}
            className="w-full h-16 rounded-[24px]"
          >
            بازگشت به منوی اصلی
          </Button>
          
          <button 
            onClick={() => navigate('/messages')}
            className="flex items-center justify-center gap-2 text-primary text-[11px] font-black group"
          >
            <span>پیگیری وضعیت سفارش در پیام‌ها</span>
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Success;
