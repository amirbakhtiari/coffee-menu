
import React, { useRef, useState, useEffect } from 'react';
import { CategoryType } from '../types';
import { Coffee, Milk, Zap, Loader, ChevronLeft, ChevronRight, Percent, History, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../store/useLanguageStore';

interface CategoryBarProps {
  selected: CategoryType;
  onSelect: (cat: CategoryType) => void;
  categories?: { id: CategoryType; label: string; icon: string }[];
  loading?: boolean;
}

const ICON_MAP: Record<string, React.FC<any>> = {
  'History': History,
  'Percent': Percent,
  'Coffee': Coffee,
  'Droplets': Droplets,
  'Zap': Zap,
  'Loader': Loader,
  'Milk': Milk,
};

const CategoryBar: React.FC<CategoryBarProps> = ({ selected, onSelect, categories = [], loading = false }) => {
  const { t, isRTL } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showIndicator, setShowIndicator] = useState(true);

  const getCategoryLabel = (cat: { id: CategoryType; label: string }) => {
    switch (cat.id) {
      case CategoryType.PREVIOUS_ORDERS:
        return t('cat_previous_orders');
      case CategoryType.DISCOUNTED:
        return t('cat_discounted');
      case CategoryType.CAPPUCCINO:
        return t('cat_cappuccino');
      case CategoryType.LATTE:
        return t('cat_latte');
      case CategoryType.ESPRESSO:
        return t('cat_espresso');
      case CategoryType.MOCHA:
        return t('cat_mocha');
      default:
        return cat.label;
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      if (Math.abs(scrollRef.current.scrollLeft) > 20) {
        setShowIndicator(false);
      } else {
        setShowIndicator(true);
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      // Find the active element using querySelector
      const activeEl = scrollRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  }, [selected]);

  const IndicatorIcon = isRTL ? ChevronLeft : ChevronRight;
  const indicatorPositionClass = isRTL ? 'left-2' : 'right-2';
  const gradientClass = isRTL 
    ? 'bg-gradient-to-r from-lightGray dark:from-dark via-lightGray/80 dark:via-dark/80 to-transparent -left-2' 
    : 'bg-gradient-to-l from-lightGray dark:from-dark via-lightGray/80 dark:via-dark/80 to-transparent -right-2';

  return (
    <div className="relative group">
      <AnimatePresence>
        {showIndicator && !loading && categories.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute ${indicatorPositionClass} top-1/2 -translate-y-1/2 z-10 pointer-events-none flex items-center gap-1`}
          >
            <div className={`w-8 h-12 absolute top-1/2 -translate-y-1/2 ${gradientClass}`} />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="relative text-primary/40"
            >
              <IndicatorIcon size={18} strokeWidth={3} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-2.5 overflow-x-auto no-scrollbar px-6 py-2 touch-pan-x overscroll-x-contain"
      >
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="shrink-0 min-w-[80px] pt-2 px-2 pb-2.5 rounded-[22px] bg-white/50 dark:bg-black/20 border border-gray-100 dark:border-white/5 flex flex-col items-center gap-1.5 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/5"></div>
              <div className="w-10 h-2 rounded-full bg-gray-100 dark:bg-white/5 animate-pulse"></div>
            </div>
          ))
        ) : (
          categories.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Coffee;
            const active = selected === cat.id;
            return (
              <button
                key={cat.id}
                data-active={active}
                onClick={() => onSelect(cat.id)}
                className={`flex flex-col items-center gap-1.5 shrink-0 min-w-[84px] pt-2 px-2 pb-2.5 rounded-[22px] transition-all duration-300 ${
                  active 
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-102' 
                    : 'bg-white/80 dark:bg-black/30 text-muted dark:text-white/40 border border-gray-100/50 dark:border-white/5 hover:border-primary/20 hover:bg-white dark:hover:bg-black/40'
                }`}
              >
                <div className={`p-1.5 rounded-full transition-colors ${active ? 'bg-white/20' : 'bg-secondary/30 dark:bg-white/5 text-primary'}`}>
                  <Icon size={16} />
                </div>
                <span className="text-[10px] font-black whitespace-nowrap tracking-tight">{getCategoryLabel(cat)}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CategoryBar;
