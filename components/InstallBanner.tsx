
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Coffee, Share, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

const InstallBanner: React.FC = () => {
  const { isInstallable, handleInstallClick, dismissInstall } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // تشخیص آیفون/آیپد
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (isIOS && !isStandalone) {
      // بعد از ۳ ثانیه راهنمای iOS را نشان بده
      const timer = setTimeout(() => setShowIOSGuide(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {/* بنر استاندارد اندروید/دسکتاپ */}
      {isInstallable && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 left-4 right-4 z-[100] max-w-md mx-auto"
        >
          <div className="bg-dark/95 backdrop-blur-xl border border-white/10 rounded-[24px] p-4 shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
              <Coffee size={24} />
            </div>
            
            <div className="flex-1 text-right">
              <h4 className="text-white text-[13px] font-black">نصب اپلیکیشن کافه لند</h4>
              <p className="text-white/50 text-[10px] font-medium">دسترسی سریع‌تر و آفلاین به منو</p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleInstallClick}
                className="bg-primary text-white px-4 py-2 rounded-xl text-[11px] font-black active:scale-95 transition-transform"
              >
                نصب
              </button>
              <button 
                onClick={dismissInstall}
                className="p-2 text-white/30 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* راهنمای اختصاصی iOS (چون دکمه اینستال ندارند) */}
      {showIOSGuide && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-6 right-6 z-[100] max-w-md mx-auto"
        >
          <div className="bg-white rounded-[32px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Download size={20} />
                </div>
                <h4 className="text-dark text-sm font-black text-right">نصب روی آیفون</h4>
              </div>
              <button onClick={() => setShowIOSGuide(false)} className="text-muted"><X size={18} /></button>
            </div>
            
            <div className="space-y-3 text-right">
              <div className="flex items-center gap-3 text-[12px] text-muted font-medium bg-gray-50 p-3 rounded-2xl">
                <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm text-[10px] font-black text-primary shrink-0">۱</span>
                <p>دکمه اشتراک <Share size={14} className="inline mx-1 text-blue-500" /> را در نوار پایین مرورگر بزنید.</p>
              </div>
              <div className="flex items-center gap-3 text-[12px] text-muted font-medium bg-gray-50 p-3 rounded-2xl">
                <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm text-[10px] font-black text-primary shrink-0">۲</span>
                <p>گزینه <span className="text-dark font-black">Add to Home Screen</span> <PlusSquare size={14} className="inline mx-1" /> را انتخاب کنید.</p>
              </div>
            </div>

            <div className="bg-orange-50 p-3 rounded-2xl text-[10px] text-orange-600 font-bold text-center">
              ⚠️ برای دریافت نوتیفیکیشن، نصب برنامه الزامی است.
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallBanner;
