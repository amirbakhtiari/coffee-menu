import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../store/useLanguageStore';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const { t, isRTL, dir } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Crisp, modern, smooth loading progress (1.8s duration)
    const startTime = Date.now();
    const duration = 1800;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(currentProgress);

      if (elapsed < duration) {
        requestAnimationFrame(updateProgress);
      }
    };

    const animFrame = requestAnimationFrame(updateProgress);

    // Fade out at 2.2 seconds for a fast, modern and respectful user experience
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2200);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(timer);
    };
  }, []);

  const handleAnimationEnd = () => {
    onComplete();
  };

  // Convert number to Persian digits for clean local typography
  const toPersianDigits = (num: number): string => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return Math.round(num).toString().replace(/\d/g, (d) => persianDigits[parseInt(d, 10)]);
  };

  return (
    <AnimatePresence onExitComplete={handleAnimationEnd}>
      {isVisible && (
        <motion.div
          key="minimal-splash"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 0.99,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-[#FAF8F5] text-[#1E1B18] overflow-hidden select-none font-sans"
        >
          {/* Subtle warm ambient light gradients */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F2ECE3] rounded-full blur-[90px] pointer-events-none opacity-80" />
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#F5EFE6] rounded-full blur-[80px] pointer-events-none opacity-60" />

          {/* Top spacer with subtle minimal category cue */}
          <div className="pt-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/70 border border-[#EBE5DC] backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#9A6D47]" />
              <span className="text-[11px] font-medium tracking-wide text-[#7A6F66]">
                منوی دیجیتال و سفارش هوشمند
              </span>
            </motion.div>
          </div>

          {/* Main Visual Centerpiece: Minimalist Coffee Emblem */}
          <div className="flex flex-col items-center justify-center px-6 relative z-10 w-full max-w-sm -mt-6">
            
            {/* Modern Architectural Icon Tile */}
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-24 h-24 rounded-[28px] bg-white border border-[#ECE5DC] shadow-[0_10px_30px_rgba(154,109,71,0.06)] flex items-center justify-center mb-8"
            >
              {/* Inner delicate border line */}
              <div className="absolute inset-1.5 rounded-[22px] border border-[#F5EFE8] pointer-events-none" />

              {/* Minimal Line-Art Coffee Cup with Rising Steam */}
              <svg
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#9A6D47] relative z-10"
              >
                {/* Modern clean cup body */}
                <path d="M18 8H6a1 1 0 0 0-1 1v6a5 5 0 0 0 5 5h4a5 5 0 0 0 5-5V9a1 1 0 0 0-1-1Z" />
                {/* Clean geometric handle */}
                <path d="M18 10h1.5a2.5 2.5 0 0 1 0 5H18" />
                {/* Minimalist steam curls with gentle CSS animation */}
                <motion.path
                  d="M9 3v2.5"
                  initial={{ opacity: 0.4, y: 1 }}
                  animate={{ opacity: [0.4, 0.9, 0.4], y: [-1, 1, -1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.path
                  d="M12 2v3.5"
                  initial={{ opacity: 0.5, y: -1 }}
                  animate={{ opacity: [0.5, 1, 0.5], y: [1, -1, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                />
                <motion.path
                  d="M15 3v2.5"
                  initial={{ opacity: 0.4, y: 1 }}
                  animate={{ opacity: [0.4, 0.9, 0.4], y: [-1, 1, -1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                />
              </svg>
            </motion.div>

            {/* Brand Title: Crisp Persian & Minimal Latin */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <h1 className="text-3xl font-black text-[#1E1B18] tracking-tight">
                {t('app_name')}
              </h1>

              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="h-[1px] w-5 bg-[#DDD5CA]" />
                <p className="text-[10px] tracking-[0.28em] uppercase font-bold text-[#9A6D47] font-sans">
                  CAFE LAND
                </p>
                <span className="h-[1px] w-5 bg-[#DDD5CA]" />
              </div>

              <p className="text-xs text-[#82786F] mt-2.5 font-normal">
                {t('app_tagline')}
              </p>
            </motion.div>
          </div>

          {/* Bottom Loading Indicator & Brand Signature */}
          <div className="w-full max-w-xs px-8 pb-10 flex flex-col items-center gap-6 relative z-10">
            
            {/* Minimalist Linear Progress Bar */}
            <div className="w-full flex flex-col items-center gap-2">
              <div className="w-full h-1 bg-[#EBE5DC] rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-[#9A6D47] rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>

              <div className="flex justify-between items-center w-full text-[11px] text-[#A1978E] font-medium px-0.5">
                <span>{t('loading')}</span>
                <span className="font-sans font-semibold text-[#8C623E]">
                  {isRTL ? `${toPersianDigits(progress)}٪` : `${Math.round(progress)}%`}
                </span>
              </div>
            </div>

            {/* Minimalist Editorial Credits */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center gap-2 pt-2 text-[11px] text-[#A69C91]"
            >
              <span>قدرت گرفته از</span>
              <span className="font-sans font-bold text-[#1E1B18] tracking-wider text-xs">
                abrKaffe
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
