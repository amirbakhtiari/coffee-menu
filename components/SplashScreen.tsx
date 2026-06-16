import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Progress bar simulation matching the animation steps
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1.25;
      });
    }, 20);

    // Fade out after 2.4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const handleAnimationEnd = () => {
    onComplete();
  };

  return (
    <AnimatePresence onExitComplete={handleAnimationEnd}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: -40,
            transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-gradient-to-b from-[#161412] via-[#1C1816] to-[#0F0D0C] text-white overflow-hidden select-none"
        >
          {/* Top subtle decorative warm glow ambient effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#C67C4E]/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
            {/* Elegant glowing active ring container */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative mb-8"
            >
              {/* Outer soft ambient halo breathing */}
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-[#C67C4E]/20 rounded-full blur-xl scale-125"
              />

              {/* Glowing decorative orbit dot */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-1.5 border border-dashed border-[#C67C4E]/40 rounded-full"
              />

              {/* Luxury Geometric Coffee Bean & Steam Emblem */}
              <div className="relative w-28 h-28 bg-[#1A1614] rounded-full border-2 border-[#C67C4E]/60 flex items-center justify-center shadow-[0_8px_30px_rgb(198,124,78,0.15)] overflow-hidden">
                <div className="absolute inset-px bg-gradient-to-tr from-[#120F0D] to-[#25201C] rounded-full" />
                
                {/* Embedded Steam Lines */}
                <div className="absolute top-6 flex gap-1 justify-center z-10 w-full">
                  <motion.div
                    animate={{
                      y: [4, -8, 4],
                      opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-1 h-4 bg-[#C67C4E] rounded-full filter blur-[0.5px]"
                  />
                  <motion.div
                    animate={{
                      y: [6, -10, 6],
                      opacity: [0.3, 0.9, 0.3],
                    }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    className="w-1 h-5 bg-[#EDD6C8] rounded-full filter blur-[0.5px]"
                  />
                  <motion.div
                    animate={{
                      y: [3, -7, 3],
                      opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                    className="w-1 h-4 bg-[#C67C4E] rounded-full filter blur-[0.5px]"
                  />
                </div>

                {/* Minimalist Graphic Coffee Mug Shield */}
                <motion.svg
                  width="42"
                  height="42"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C67C4E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="z-10 mt-5 drop-shadow-[0_2px_8px_rgba(198,124,78,0.4)]"
                  animate={{
                    y: [0, -1, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Mug Body */}
                  <path d="M17 8H6a1 1 0 0 0-1 1v7c0 3.3 2.7 6 6 6h2a6 6 0 0 0 6-6V9a1 1 0 0 0-1-1z" fill="url(#coffee-gradient)" />
                  {/* Handle */}
                  <path d="M17 11h2.5a2.5 2.5 0 0 1 0 5H17" />
                  
                  {/* Color Gradient definitions */}
                  <defs>
                    <linearGradient id="coffee-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C67C4E" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#C67C4E" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                </motion.svg>
              </div>
            </motion.div>

            {/* Brand Title with beautiful staggered Persian Letter-spacing */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center relative"
            >
              <h1 className="text-3xl font-black tracking-wide text-white drop-shadow-md">
                کــافه لنــد
              </h1>
              
              <div className="flex justify-center items-center gap-1.5 mt-2">
                <span className="h-[1px] w-4 bg-[#C67C4E]/40" />
                <p className="text-xs font-medium text-[#EDD6C8] tracking-[0.05em] uppercase opacity-90">
                  منوی هوشمند و سفارش آنلاین
                </p>
                <span className="h-[1px] w-4 bg-[#C67C4E]/40" />
              </div>
            </motion.div>
          </div>

          {/* Slogan and Loading Indicator at Bottom */}
          <div className="w-full max-w-xs px-8 pb-14 flex flex-col items-center gap-6 relative z-10">
            {/* Elegant modern horizontal line progress bar */}
            <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden relative border border-white/[0.02]">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#C67C4E] to-[#EDD6C8] rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>

            {/* Dynamic premium slogan with fade-in */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex items-center gap-2"
            >
              <span className="text-sm font-semibold text-gray-400 font-sans tracking-wide">
                وقت یه قهوه خوبه!
              </span>
              <span className="text-base">☕</span>
            </motion.div>
          </div>

          {/* Bottom subtle aesthetic details of copyright or versioning */}
          <div className="absolute bottom-4 text-[9px] text-gray-600 font-mono tracking-widest uppercase pointer-events-none">
            LAND CAFE v2.4
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
