import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CalendarRange, ArrowLeft, Coffee, Flame, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCafeStore } from '../store/useCafeStore';

export const CafeClosedModal: React.FC = () => {
  const navigate = useNavigate();
  const { isModalOpen, setModalOpen, getWorkingHoursText } = useCafeStore();

  if (!isModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Deep blur backdrop background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setModalOpen(false)}
          className="absolute inset-0 bg-black/65 backdrop-blur-md"
        />

        {/* Modal Card Layout */}
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="bg-white dark:bg-[#1C1C1E] border border-gray-100 dark:border-white/5 rounded-[36px] w-full max-w-sm p-6 relative overflow-hidden shadow-2xl text-right z-10"
          dir="rtl"
        >
          {/* Ambient Glowing Spot */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full translate-x-8 -translate-y-8 blur-2xl pointer-events-none" />
          
          <div className="flex flex-col items-center text-center mt-2">
            {/* Soft pulsing coffee cup icon */}
            <div className="w-16 h-16 bg-amber-550/10 dark:bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 animate-bounce">
              <Coffee size={30} strokeWidth={2} />
            </div>

            <span className="text-[10px] uppercase font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full mb-2">
              بازه خارج از فرآیند سرویس‌دهی
            </span>

            <h3 className="text-lg font-black text-dark dark:text-white mb-2">
              کافه لند در حال حاضر بسته است ☕
            </h3>

            <p className="text-gray-500 dark:text-white/60 text-xs leading-relaxed max-w-[280px] mb-6">
              مشتری گرامی، شیفت کاری جاری کافه لند به پایان رسیده است. در حال حاضر امکان ثبت سفارش آنلاین وجود ندارد، اما می‌توانید همین حالا کاندید دریافت میز دلخواه خود باشید و آن را برای شیفت‌های بعدی رزرو کنید!
            </p>

            {/* Current Day Schedule Banner */}
            <div className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 p-4 rounded-2xl flex flex-col gap-2.5 mb-6 text-right" dir="rtl">
              <div className="flex items-center gap-2 text-dark dark:text-white">
                <Clock size={16} className="text-amber-550 shrink-0" />
                <span className="text-xs font-extrabold">برنامه زمان‌بندی امروز کافه</span>
              </div>
              <div className="text-[11px] font-bold text-gray-500 dark:text-white/40 pr-6">
                {getWorkingHoursText()}
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold pr-6">
                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                <span>بخش پذیرش و رزرواسیون سالن فعال است</span>
              </div>
            </div>

            {/* Primary Reserve Table Button */}
            <button
              onClick={() => {
                setModalOpen(false);
                navigate('/tables');
              }}
              className="w-full py-4 bg-primary text-white font-black text-xs rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-3"
            >
              <span>مشاهده و رزرو آنلاین میز</span>
              <ArrowLeft size={14} strokeWidth={2.5} />
            </button>

            {/* Cancel/Browse Menu without ordering */}
            <button
              onClick={() => setModalOpen(false)}
              className="w-full py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-500 dark:text-white/40 font-bold text-xs rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              صرفاً مشاهده گالری منو
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
