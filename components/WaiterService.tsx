
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, X, ConciergeBell, MessageCircleQuestion, Check } from 'lucide-react';

const WaiterService: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCalled, setIsCalled] = useState(false);

  const handleCallWaiter = () => {
    setIsCalled(true);
    setIsOpen(false);
    
    setTimeout(() => {
      setIsCalled(false);
    }, 3000);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[55] bg-black/10 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCalled && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="fixed top-6 inset-x-0 z-[150] flex justify-center px-6 pointer-events-none"
          >
            <div className="bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.45)] border border-white/50 dark:border-white/10 flex items-center gap-3 pointer-events-auto w-auto max-w-[280px]" dir="rtl">
              <div className="shrink-0 w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                <Check size={18} strokeWidth={3.5} />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[13px] font-black text-dark dark:text-white leading-tight mb-0.5">درخواست ثبت شد</span>
                <span className="text-[10px] font-bold text-muted dark:text-white/40 leading-none">ویتر بزودی می‌آید</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-28 left-4 z-[60] pointer-events-none">
        <div className="relative flex flex-col items-start pointer-events-auto">
          
          <AnimatePresence>
            {/* Removed internal bubble */}
          </AnimatePresence>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className="mb-4 flex flex-col items-start gap-4 px-2"
              >
                {/* درخواست ویتر */}
                <motion.button 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={handleCallWaiter}
                  className="group flex items-center gap-3 bg-white dark:bg-[#1A1A1A] p-2 pr-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.1)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:bg-white/90 dark:hover:bg-[#222] transition-all active:scale-95"
                  dir="rtl"
                >
                  <span className="text-[13px] font-black text-dark dark:text-white whitespace-nowrap">درخواست ویتر</span>
                  <div className="shrink-0 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <ConciergeBell size={18} />
                  </div>
                </motion.button>
                
                {/* راهنمایی منو */}
                <motion.button 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                  className="group flex items-center gap-3 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md p-2 pr-5 rounded-2xl border border-white/40 dark:border-white/5 opacity-80 hover:opacity-100 transition-all active:scale-95"
                  dir="rtl"
                >
                  <span className="text-[13px] font-black text-dark/50 dark:text-white/40 whitespace-nowrap">راهنمایی منو</span>
                  <div className="shrink-0 w-10 h-10 bg-dark/5 dark:bg-white/5 rounded-xl flex items-center justify-center text-dark/30 dark:text-white/20">
                    <MessageCircleQuestion size={18} />
                  </div>
                </motion.button>

                <div className="w-6 h-px bg-dark/5 dark:bg-white/10 ml-5" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            layout
            onClick={() => setIsOpen(!isOpen)}
            className={`relative w-11 h-11 rounded-[16px] flex items-center justify-center shadow-[0_10px_35px_rgba(0,0,0,0.2)] transition-all duration-500 border border-white/20 dark:border-white/10 ${
              isCalled 
                ? 'bg-green-500 text-white' 
                : 'bg-primary dark:bg-primary text-white shadow-md shadow-primary/20'
            }`}
            whileTap={{ scale: 0.9 }}
          >
            {/* طراحی مشابه AssistiveTouch: لایه‌های داخلی */}
            <div className={`absolute inset-0.5 rounded-[14px] border border-white/10 dark:border-white/5 pointer-events-none transition-opacity ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
            
            {isCalled ? (
              <Check size={20} strokeWidth={3} />
            ) : isOpen ? (
              <X size={18} strokeWidth={2.5} />
            ) : (
              <div className="relative">
                <ConciergeBell size={20} className="opacity-95" strokeWidth={2.2} />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full animate-pulse shadow-sm" />
              </div>
            )}
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default WaiterService;
