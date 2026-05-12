
import React, { useRef, useState } from 'react';
import { CategoryType } from '../types';
import { Coffee, Milk, Zap, Loader, ChevronLeft, Percent, History, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showIndicator, setShowIndicator] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      if (Math.abs(scrollRef.current.scrollLeft) > 20) {
        setShowIndicator(false);
      } else {
        setShowIndicator(true);
      }
    }
  };

  return (
    <div className="relative group">
      <AnimatePresence>
        {showIndicator && !loading && categories.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none flex items-center gap-1"
          >
            <div className="w-8 h-12 bg-gradient-to-r from-lightGray dark:from-dark via-lightGray/80 dark:via-dark/80 to-transparent absolute -left-2 top-1/2 -translate-y-1/2" />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="relative text-primary/40"
            >
              <ChevronLeft size={18} strokeWidth={3} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto no-scrollbar px-6 py-4 touch-pan-x"
      >
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="shrink-0 min-w-[95px] p-4 rounded-[28px] bg-white dark:bg-black/20 border border-gray-100 dark:border-white/5 flex flex-col items-center gap-3 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 animate-pulse"></div>
              <div className="w-14 h-2.5 rounded-full bg-gray-100 dark:bg-white/5 animate-pulse"></div>
            </div>
          ))
        ) : (
          categories.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Coffee;
            const active = selected === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={`flex flex-col items-center gap-2 shrink-0 min-w-[95px] p-4 rounded-[28px] transition-all duration-300 ${
                  active ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'bg-white dark:bg-black/20 text-muted dark:text-white/40 border border-gray-100 dark:border-white/5 hover:border-primary/20'
                }`}
              >
                <div className={`p-2 rounded-full transition-colors ${active ? 'bg-white/20' : 'bg-secondary/30 dark:bg-white/5 text-primary'}`}>
                  <Icon size={20} />
                </div>
                <span className="text-[10px] font-black whitespace-nowrap">{cat.label}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CategoryBar;
