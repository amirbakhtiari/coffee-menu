
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, LayoutGrid, Hash, ChevronLeft, Info, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryBar from '../components/CategoryBar';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/api/useProductsApi';
import { useCategories } from '../hooks/api/useCategoriesApi';
import { CategoryType } from '../types';
import PageTransition from '../components/PageTransition';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(CategoryType.DISCOUNTED);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isPinned, setIsPinned] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'صبح بخیر! ☀️';
    if (hour >= 12 && hour < 17) return 'ظهر بخیر! 🌤️';
    if (hour >= 17 && hour < 20) return 'عصر بخیر! ☕';
    return 'شب بخیر! 🌙';
  };

  useEffect(() => {
    const handleScroll = () => {
      // Pin CategoryBar when header has scrolled out of view (typically ~150px)
      if (window.scrollY > 130) {
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
          className="bg-white dark:bg-dark rounded-b-[40px] pt-12 pb-8 px-6 flex flex-col gap-4 relative shadow-sm dark:shadow-none border-b border-gray-100/40 dark:border-white/5 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          
          <div className="flex justify-between items-center gap-2 mb-2 relative z-10">
            {/* Direct Switch to Grid/List Layout Mode */}
            <motion.button 
              onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')} 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 border border-white/15 active:scale-90 transition-all flex items-center justify-center shrink-0"
              title={viewMode === 'grid' ? 'نمایش خطی' : 'نمایش شبکه‌ای'}
            >
              {viewMode === 'grid' ? <List size={18} strokeWidth={2.5} /> : <LayoutGrid size={18} strokeWidth={2.5} />}
            </motion.button>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group flex items-center bg-gray-50 dark:bg-white/[0.05] backdrop-blur-2xl rounded-[22px] p-1 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-2xl cursor-default min-w-0"
            >
              <div className="flex flex-col items-start px-3 min-w-0">
                <span className="text-[7px] text-primary font-black uppercase tracking-[1px] mb-0.5 opacity-80 whitespace-nowrap">میز اختصاصی</span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shrink-0"></span>
                  <span className="text-[11px] text-dark dark:text-white font-black truncate">میز ۱۲</span>
                </div>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-[#E89C6A] rounded-[18px] flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500 shrink-0">
                <Hash size={16} strokeWidth={3} />
              </div>
            </motion.div>

            <div className="relative shrink-0 flex gap-2">
               <button onClick={() => navigate('/cafe-info')} className="p-2.5 bg-gray-100 dark:bg-white/10 rounded-xl text-dark dark:text-white backdrop-blur-md border border-gray-200 dark:border-white/5 active:scale-90 transition-transform">
                 <Info size={18} />
               </button>
               <div className="relative">
                 <button onClick={() => navigate('/messages')} className="p-2.5 bg-gray-100 dark:bg-white/10 rounded-xl text-dark dark:text-white backdrop-blur-md border border-gray-200 dark:border-white/5 active:scale-90 transition-transform">
                   <Bell size={18} />
                 </button>
                 <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-dark"></span>
               </div>
            </div>
          </div>

          <div className="text-dark dark:text-white mb-2 relative z-10 text-right">
            <h1 className="text-[11px] text-muted font-black tracking-[2px] mb-1">کافه لند</h1>
            <p className="text-2xl font-black leading-tight">{getGreeting()} وقت یه قهوه خوبه! ☕</p>
          </div>
        </div>

        {/* Sticky categories bar that remains pinned to top while scrolling (modern morph layout) */}
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
        <div className="px-6 pb-24 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-dark dark:text-white">
              {selectedCategory === CategoryType.DISCOUNTED ? 'پیشنهادهای شگفت‌انگیز لند' : 'آیتم‌های برگزیده'}
            </h2>
            <span className="text-[10px] font-black text-muted dark:text-white/40 bg-white dark:bg-white/5 py-1 px-3 rounded-lg shadow-sm border border-gray-100 dark:border-white/5">
              {products.length} محصول
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={viewMode === 'grid' ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}
            >
              {products.map((product, index) => (
                <motion.div 
                  key={product.id}
                  ref={index === products.length - 1 ? lastProductElementRef : undefined}
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} variant={viewMode} />
                </motion.div>
              ))}

              {(loading || isFetchingNextPage) && (
                <>
                  {[1, 2, 3, 4].map(i => (
                    <div key={`loading-${i}`} className={viewMode === 'grid' ? "bg-white dark:bg-black/20 p-3.5 rounded-[32px] flex flex-col gap-2 border border-gray-100 dark:border-white/5 shadow-sm animate-pulse" : "bg-white dark:bg-black/20 p-3.5 rounded-[24px] flex flex-row-reverse gap-4 border border-gray-100 dark:border-white/5 shadow-sm animate-pulse h-28"}>
                      <div className={viewMode === 'grid' ? "aspect-square w-full rounded-[22px] bg-gray-100 dark:bg-white/5" : "w-24 shrink-0 rounded-[18px] bg-gray-100 dark:bg-white/5"}></div>
                      <div className="flex-1 flex flex-col justify-center gap-2">
                        <div className="h-3 w-3/4 rounded-full bg-gray-100 dark:bg-white/5"></div>
                        <div className="h-2 w-1/2 rounded-full bg-gray-50 dark:bg-white/5"></div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {!hasMore && products.length > 0 && (
                <div className="col-span-full py-10 flex flex-col items-center gap-2 opacity-30 select-none text-right">
                  <div className="w-10 h-px bg-current" />
                  <span className="text-[10px] font-black uppercase tracking-widest">پایان منو</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          
          {!loading && products.length === 0 && (
            <div className="text-center py-20 text-muted italic text-sm font-medium">محصولی در این دسته‌بندی یافت نشد.</div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;
