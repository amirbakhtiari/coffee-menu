
import React from 'react';
import { User, LogIn, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import Button from '../components/Button';

interface GuestProfileProps {
  onLoginClick: () => void;
}

const GuestProfile: React.FC<GuestProfileProps> = ({ onLoginClick }) => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="px-6 py-12 h-[100dvh] bg-lightGray dark:bg-dark flex flex-col items-center justify-center text-center gap-8 transition-colors overflow-hidden touch-none relative" dir="rtl">
        {/* Top Back Button */}
        <div className="absolute top-8 right-6 z-50">
          <button 
            onClick={() => navigate('/')} 
            className="w-12 h-12 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center shadow-md dark:shadow-none border border-gray-200 dark:border-white/10 active:scale-90 transition-transform"
            title="بازگشت به خانه"
          >
            <ChevronRight size={22} className="text-dark dark:text-white" />
          </button>
        </div>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="w-32 h-32 bg-white dark:bg-white/5 rounded-[44px] shadow-xl dark:shadow-none flex items-center justify-center text-gray-200 dark:text-white/10 border border-gray-50 dark:border-white/5">
            <User size={64} strokeWidth={1} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <LogIn size={20} />
          </div>
        </motion.div>

        <div className="space-y-3">
          <h1 className="text-xl font-black text-dark dark:text-white">شما هنوز ثبت‌نام نکرده‌اید</h1>
          <p className="text-muted dark:text-white/60 text-[13px] font-medium leading-relaxed px-6">
            برای پیگیری سفارش‌ها، استفاده از کد تخفیف و دسترسی به امکانات کامل، لطفاً وارد حساب خود شوید.
          </p>
        </div>

        <div className="w-full max-w-[280px]">
          <Button 
            onClick={onLoginClick}
            className="w-full h-16 rounded-[24px] flex items-center gap-3"
          >
            <LogIn size={18} />
            <span>ورود یا ثبت‌نام</span>
          </Button>
        </div>

        <p className="absolute bottom-10 text-[9px] text-muted font-black uppercase tracking-widest opacity-40">
          کافه لند - لذت یک قهوه هوشمند
        </p>
      </div>
    </PageTransition>
  );
};

export default GuestProfile;
