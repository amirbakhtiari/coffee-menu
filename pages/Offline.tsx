
import React from 'react';
import { WifiOff, RefreshCw, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

const Offline: React.FC = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-lightGray flex flex-col items-center justify-center px-10 text-center gap-8">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <div className="w-32 h-32 bg-white rounded-[40px] shadow-xl flex items-center justify-center text-muted border border-gray-100">
          <WifiOff size={48} strokeWidth={1.5} />
        </div>
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-4 -right-4 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg"
        >
          <Coffee size={20} />
        </motion.div>
      </motion.div>

      <div className="space-y-3">
        <h1 className="text-xl font-black text-dark">اتصال برقرار نشد</h1>
        <p className="text-muted text-[13px] font-medium leading-relaxed px-4">
          به نظر می‌رسد دسترسی شما به اینترنت قطع شده است. لطفاً وضعیت شبکه خود را بررسی کنید.
        </p>
      </div>

      <button 
        onClick={handleRetry}
        className="flex items-center gap-3 bg-white px-8 py-4 rounded-[24px] shadow-lg shadow-black/5 border border-gray-100 text-primary font-black text-sm active:scale-95 transition-all group"
      >
        <RefreshCw size={18} className="group-active:rotate-180 transition-transform duration-500" />
        <span>تلاش مجدد</span>
      </button>

      <p className="fixed bottom-10 text-[10px] text-muted font-black uppercase tracking-widest opacity-30">
        حالت آفلاین کافه لند
      </p>
    </div>
  );
};

export default Offline;
