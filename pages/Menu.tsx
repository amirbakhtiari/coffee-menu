
import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, List } from 'lucide-react';
import CategoryBar from '../components/CategoryBar';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/api/useProductsApi';
import { useCategories } from '../hooks/api/useCategoriesApi';
import { CategoryType } from '../types';
import PageTransition from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';

import AppBar from '../components/AppBar';

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(CategoryType.DISCOUNTED);
  
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
      <div className="px-6 pb-24 min-h-screen bg-lightGray dark:bg-dark flex flex-col transition-colors">
        <div className="pt-12 pb-4 -mx-6 px-6 mb-2 bg-lightGray dark:bg-dark transition-colors">
          <AppBar 
            title="منوی کامل" 
            subtitle="انتخاب از میان بهترین‌های کافه لند"
            onBack={() => navigate('/')}
            rightAction={
              <button 
                onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
                className="w-10 h-10 bg-white dark:bg-black/40 rounded-xl shadow-sm border border-gray-50 dark:border-white/5 flex items-center justify-center text-dark dark:text-white active:scale-90 transition-transform"
              >
                {viewMode === 'grid' ? <List size={20} /> : <LayoutGrid size={20} />}
              </button>
            }
          />
        </div>

        <div className="sticky top-0 z-50 bg-lightGray/95 dark:bg-dark/95 backdrop-blur-md -mx-6 mb-4">
          <CategoryBar 
            selected={selectedCategory} 
            onSelect={setSelectedCategory} 
            categories={categories}
            loading={categoriesLoading}
          />
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
              <div className="col-span-full py-10 flex flex-col items-center gap-2 opacity-30 select-none">
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
    </PageTransition>
  );
};

export default Menu;
