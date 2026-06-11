import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

interface BookingConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const BookingConfirmModal: React.FC<BookingConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/65 backdrop-blur-md"
        />

        {/* Modal Card Layout */}
        <motion.div
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="bg-white dark:bg-[#1C1C1E] border border-gray-100 dark:border-white/5 rounded-[32px] w-full max-w-sm p-6 relative overflow-hidden shadow-2xl text-right z-10"
          dir="rtl"
        >
          {/* Ambient Glowing Spot */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full translate-x-8 -translate-y-8 blur-2xl pointer-events-none" />

          <div className="flex flex-col items-center text-center">
            {/* Animated Confirm Icon Indicator */}
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
              <ShieldCheck size={28} strokeWidth={2.2} />
            </div>

            <h3 className="text-[15px] font-black text-dark dark:text-white mb-2">
              تایید قوانین و شرایط عمومی رزرو 🧾
            </h3>

            <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed max-w-[280px] mb-6 font-semibold">
              آیا از مطالعه دقیق شرایط و پذیرش تمامی قوانین رزرو موفت کافه لند اطمینان کامل دارید؟ با ادامه فرآیند، وارد مرحله تنظیم زمان‌بندی حضور خواهید شد.
            </p>

            {/* Little warning reminder Box */}
            <div className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-150 dark:border-white/5 p-4 rounded-2xl text-right mb-6" dir="rtl">
              <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400">
                <span className="shrink-0 mt-0.5 text-xs">⚠️</span>
                <span className="text-[10px] font-black leading-relaxed">خیلی مهم: لغو خودکار پس از ۱۰ دقیقه تأخیر</span>
              </div>
              <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed font-semibold">
                برای رعایت اخلاق سالنی و احترام به سایر مراجعه‌کنندگان، در صورت عدم حضور پس از گذشت ۱۰ دقیقه از زمان مقرر، رزرو به طور خودکار آزاد شده و به حالت قبل بازمی‌گردد.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 bg-gray-105/90 dark:bg-white/10 text-gray-650 dark:text-gray-300 text-[11px] font-bold rounded-2xl active:scale-95 transition-all text-center focus:outline-none cursor-pointer"
              >
                انصراف و لغو
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 py-3.5 bg-primary text-white text-[11px] font-black rounded-2xl active:scale-95 transition-all text-center flex items-center justify-center gap-1 shadow-lg shadow-primary/15 focus:outline-none cursor-pointer"
              >
                بله، اطمینان دارم
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
