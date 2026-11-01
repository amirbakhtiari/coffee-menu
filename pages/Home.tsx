import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, LayoutGrid, Hash, ChevronLeft, Info, List, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryBar from '../components/CategoryBar';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/api/useProductsApi';
import { useCategories } from '../hooks/api/useCategoriesApi';
import { CategoryType } from '../types';
import PageTransition from '../components/PageTransition';
import { useNotificationStore } from '../store/useNotificationStore';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import { useCafeStatus, useUpdateCafeOverride } from '../hooks/api/useCafeApi';
import HaloDivider from '../components/HaloDivider';
import { useTranslation } from '../store/useLanguageStore';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(CategoryType.DISCOUNTED);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isPinned, setIsPinned] = useState(false);
  
  const { data: cafeStatus } = useCafeStatus();
  const updateCafeOverride = useUpdateCafeOverride();
  const isClosed = cafeStatus?.isClosed || false;

  const { t, setLanguageModalOpen, langItem, isRTL } = useTranslation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return t('greeting_morning');
    if (hour >= 12 && hour < 17) return t('greeting_noon');
    if (hour >= 17 && hour < 20) return t('greeting_evening');
    return t('greeting_night');
  };

  useEffect(() => {
    const handleScroll = () => {
      // Pin CategoryBar when header has scrolled out of view (~100px)
      if (window.scrollY > 100) {
        setIsPinned(true);
      } else {
        setIsPinned(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  // Scroll to safety boundary when category changes
  useEffect(() => {
    if (window.scrollY > 100) {
      window.scrollTo(0, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [selectedCategory]);

  // Swipe to change categories in RTL vs LTR
  const handleSwipeLeft = () => {
    if (!categories || categories.length === 0) return;
    const currentIndex = categories.findIndex(c => c.id === selectedCategory);
    if (isRTL) {
      if (currentIndex !== -1 && currentIndex < categories.length - 1) {
        setSelectedCategory(categories[currentIndex + 1].id);
      }
    } else {
      if (currentIndex > 0) {
        setSelectedCategory(categories[currentIndex - 1].id);
      }
    }
  };

  const handleSwipeRight = () => {
    if (!categories || categories.length === 0) return;
    const currentIndex = categories.findIndex(c => c.id === selectedCategory);
    if (isRTL) {
      if (currentIndex > 0) {
        setSelectedCategory(categories[currentIndex - 1].id);
      }
    } else {
      if (currentIndex !== -1 && currentIndex < categories.length - 1) {
        setSelectedCategory(categories[currentIndex + 1].id);
      }
    }
  };

  const swipeContainerRef = useSwipeGesture({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 50,
  });

  const { products, loading, hasMore, fetchMoreProducts, isFetchingNextPage } = useProducts(selectedCategory);

  const observer = useRef<IntersectionObserver>();
  const lastProductElementRef = useCallback((node: HTMLDivElement) => {
    if (loading || isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMoreProducts();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, fetchMoreProducts, isFetchingNextPage]);

  return (
    <PageTransition>
      <div className="flex flex-col">
        {/* Top Header Card */}
        <div 
          className="bg-white dark:bg-dark rounded-b-[32px] pt-7 pb-4 px-6 flex flex-col gap-3 relative shadow-sm dark:shadow-none border-b border-gray-100/40 dark:border-white/5 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 start-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          
          <div className="flex justify-between items-center gap-2 mb-1 relative z-10">
            {/* Direct Switch to Grid/List Layout Mode */}
            <motion.button 
              onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')} 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 border border-white/15 active:scale-90 transition-all flex items-center justify-center shrink-0 cursor-pointer"
              title={viewMode === 'grid' ? t('view_mode_list') : t('view_mode_grid')}
            >
              {viewMode === 'grid' ? <List size={18} strokeWidth={2.5} /> : <LayoutGrid size={18} strokeWidth={2.5} />}
            </motion.button>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/tables')}
              className="group flex items-center bg-gray-50 dark:bg-white/[0.05] hover:bg-gray-100/60 dark:hover:bg-white/[0.08] backdrop-blur-2xl rounded-[22px] p-1 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-2xl cursor-pointer active:scale-95 transition-all duration-200 min-w-0"
              title={t('table_badge_title')}
            >
              <div className="flex flex-col items-start px-3 min-w-0">
                <span className="text-[7px] text-primary font-black uppercase tracking-[1px] mb-0.5 opacity-80 whitespace-nowrap">
                  {t('table_badge_title')}
                </span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shrink-0"></span>
                  <span className="text-[11px] text-dark dark:text-white font-black truncate">
                    {t('table_badge_val')}
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-[#E89C6A] rounded-[16px] flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500 shrink-0">
                <Hash size={14} strokeWidth={3} />
              </div>
            </motion.div>

            <div className="relative shrink-0 flex items-center gap-1.5">
               {/* دکمه تغییر زبان در کنار دکمه اطلاعات کافه */}
               <button 
                 type="button"
                 onClick={() => setLanguageModalOpen(true)} 
                 className="p-2 bg-gray-100 dark:bg-white/10 rounded-xl text-dark dark:text-white backdrop-blur-md border border-gray-200 dark:border-white/5 active:scale-90 transition-transform flex items-center gap-1 cursor-pointer"
                 title={t('lang_modal_title')}
               >
                 <Globe size={18} />
                 <span className="text-[11px] leading-none select-none">{langItem.flag}</span>
               </button>

               <button 
                 type="button"
                 onClick={() => navigate('/cafe-info')} 
                 className="p-2 bg-gray-100 dark:bg-white/10 rounded-xl text-dark dark:text-white backdrop-blur-md border border-gray-200 dark:border-white/5 active:scale-90 transition-transform cursor-pointer"
                 title={t('cafe_info_title')}
               >
                 <Info size={18} />
               </button>
               <div className="relative">
                 <button 
                   type="button"
                   onClick={() => navigate('/messages')} 
                   className="p-2 bg-gray-100 dark:bg-white/10 rounded-xl text-dark dark:text-white backdrop-blur-md border border-gray-200 dark:border-white/5 active:scale-90 transition-transform cursor-pointer"
                   title={t('messages_title')}
                 >
                   <Bell size={18} />
                 </button>
                 <span className="absolute top-1.5 end-1.5 w-1.5 h-1.5 bg-primary rounded-full border border-white dark:border-dark"></span>
               </div>
            </div>
          </div>

          <div className="text-dark dark:text-white mb-0.5 relative z-10 text-start">
            <h1 className="text-[10px] text-muted font-black tracking-[2px] mb-0.5">{t('app_name')}</h1>
            <p className="text-lg font-black leading-tight">{getGreeting()} {t('greeting_tagline')}</p>
          </div>

          {/* نوار وضعیت تعاملی کافه با قابلیت ترجمه چندزبانه */}
          <div className="relative z-10 flex items-center justify-between mt-0.5 pt-2 border-t border-gray-100/40 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isClosed ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isClosed ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              </span>
              <span className="text-[11px] font-black text-dark dark:text-white">
                {isClosed ? t('cafe_closed_status') : t('cafe_open_status')}
              </span>
            </div>

            <button
              onClick={() => {
                updateCafeOverride.mutate(!isClosed);
              }}
              className={`text-[9px] font-black px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                isClosed
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
              }`}
            >
              {isClosed ? t('simulate_open') : t('simulate_closed')}
            </button>
          </div>
        </div>

        {/* Sticky categories bar that remains pinned to top while scrolling */}
        <div className={`sticky top-0 z-50 transition-all duration-300 w-full ${
          isPinned 
            ? 'bg-light-gray/80 dark:bg-dark/85 backdrop-blur-xl shadow-sm border-b border-gray-200/30 dark:border-white/5 py-1.5 px-0' 
            : 'bg-transparent py-4 px-3'
        }`}>
          <div className={`mx-auto w-full transition-all duration-300 overflow-hidden ${
            isPinned 
              ? 'bg-transparent border border-transparent shadow-none rounded-none' 
              : 'bg-white/80 dark:bg-black/25 backdrop-blur-md shadow-sm border border-gray-100/70 dark:border-white/5 rounded-[24px]'
          }`}>
            <CategoryBar 
              selected={selectedCategory} 
              onSelect={setSelectedCategory} 
              categories={categories} 
              loading={categoriesLoading} 
            />
          </div>
        </div>

        {/* Full Menu Item Grid / List Visualizer */}
        <div ref={swipeContainerRef} className="px-4 pb-4 mt-3 select-none touch-pan-y">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-black text-dark dark:text-white">
              {selectedCategory === CategoryType.DISCOUNTED ? t('featured_offers') : t('featured_items')}
            </h2>
            <span className="text-[10px] font-black text-muted dark:text-white/40 bg-white dark:bg-white/5 py-1 px-3 rounded-lg shadow-sm border border-gray-100 dark:border-white/5">
              {products.length} {t('products_count')}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={viewMode === 'grid' ? "grid grid-cols-2 gap-2" : "flex flex-col gap-0"}
            >
              {products.map((product, index) => (
                <React.Fragment key={product.id}>
                  <motion.div 
                    ref={index === products.length - 1 ? lastProductElementRef : undefined}
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} variant={viewMode} />
                  </motion.div>

                  {/* خط جداکننده به صورت هاله ای از رنگ کشیده شده از یک سمت به سمت دیگر */}
                  {viewMode === 'list' && index < products.length - 1 && (
                    <HaloDivider />
                  )}

                  {viewMode === 'grid' && index % 2 === 1 && index < products.length - 1 && (
                    <div className="col-span-2 w-full">
                      <HaloDivider />
                    </div>
                  )}
                </React.Fragment>
              ))}

              {(loading || isFetchingNextPage) && (
                <>
                  {[1, 2, 3, 4].map(i => (
                    <div key={`loading-${i}`} className={viewMode === 'grid' ? "bg-white/70 dark:bg-white/[0.03] p-2.5 rounded-[20px] flex flex-col gap-2 animate-pulse" : "bg-transparent p-2 rounded-[18px] flex flex-row gap-2.5 animate-pulse h-24"}>
                      <div className={viewMode === 'grid' ? "aspect-square w-full rounded-[14px] bg-gray-200/60 dark:bg-white/5" : "w-20 shrink-0 rounded-[14px] bg-gray-200/60 dark:bg-white/5"}></div>
                      <div className="flex-1 flex flex-col justify-center gap-2">
                        <div className="h-3 w-3/4 rounded-full bg-gray-200/60 dark:bg-white/5"></div>
                        <div className="h-2 w-1/2 rounded-full bg-gray-200/40 dark:bg-white/5"></div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {!hasMore && products.length > 0 && (
                <div className="col-span-full pt-8 pb-2 flex flex-col items-center gap-2 opacity-30 select-none text-center">
                  <div className="w-10 h-px bg-current" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('end_of_menu')}</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          
          {!loading && products.length === 0 && (
            <div className="text-center py-20 text-muted italic text-sm font-medium">{t('no_products')}</div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;
