
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, LayoutGrid, Hash, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryBar from '../components/CategoryBar';
import ProductCard from '../components/ProductCard';
import { useProducts, useCategories } from '../hooks/api/useProductsApi';
import { CategoryType } from '../types';
import PageTransition from '../components/PageTransition';

const Home: React.FC = () => {
  const navigate = useNavigate();
  // تنظیم دسته پیش فرض روی تخفیف دارها
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(CategoryType.DISCOUNTED);

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const { products, loading } = useProducts(selectedCategory);

  const filteredProducts = products;

  return (
    <PageTransition>
      <div className="flex flex-col gap-2">
        <div className="bg-dark rounded-b-[40px] pt-12 pb-12 px-6 flex flex-col gap-4 relative shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          
          <div className="flex justify-between items-center gap-2 mb-2 relative z-10">
            <motion.button 
              onClick={() => navigate('/menu')} 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 bg-primary px-3 py-2 rounded-full text-white shadow-lg shadow-primary/30 border border-white/10 relative group overflow-hidden shrink-0"
            >
              <div className="bg-white/20 p-1 rounded-full">
                <LayoutGrid size={14} strokeWidth={3} />
              </div>
              <span className="text-[10px] font-black tracking-tight whitespace-nowrap">منوی کامل</span>
            </motion.button>

            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group flex items-center bg-white/[0.05] backdrop-blur-2xl rounded-[22px] p-1 border border-white/10 shadow-2xl cursor-default min-w-0"
            >
              <div className="flex flex-col items-start px-3 min-w-0">
                <span className="text-[7px] text-primary font-black uppercase tracking-[1px] mb-0.5 opacity-80 whitespace-nowrap">میز اختصاصی</span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shrink-0"></span>
                  <span className="text-[11px] text-white font-black truncate">میز ۱۲</span>
                </div>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-[#E89C6A] rounded-[18px] flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500 shrink-0">
                <Hash size={16} strokeWidth={3} />
              </div>
            </motion.div>

            <div className="relative shrink-0">
               <button onClick={() => navigate('/messages')} className="p-2.5 bg-white/10 rounded-xl text-white backdrop-blur-md border border-white/5 active:scale-90 transition-transform">
                 <Bell size={18} />
               </button>
               <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-dark"></span>
            </div>
          </div>

          <div className="text-white mb-2 relative z-10 text-right">
            <h1 className="text-[11px] opacity-60 font-black tracking-[2px] mb-1">کافه لند</h1>
            <p className="text-2xl font-black leading-tight">وقت یه قهوه خوبه! ☕</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <div className="px-6 flex justify-between items-center">
            <h2 className="text-base font-black text-dark dark:text-white">دسته‌بندی‌ها</h2>
            <button onClick={() => navigate('/menu')} className="text-[11px] text-primary font-black bg-primary/10 px-3 py-1.5 rounded-full">نمایش همه</button>
          </div>
          <CategoryBar selected={selectedCategory} onSelect={setSelectedCategory} categories={categories} loading={categoriesLoading} />
        </div>

        <div className="px-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-dark dark:text-white">
              {selectedCategory === CategoryType.DISCOUNTED ? 'پیشنهادهای شگفت‌انگیز' : 'محصولات این دسته'}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="bg-white h-48 rounded-[32px] animate-pulse"></div>)}
            </div>
          ) : (
            <>
              <motion.div 
                layout
                className="grid grid-cols-2 gap-4"
                initial="hidden"
                animate="show"
                variants={{
                  show: { transition: { staggerChildren: 0.1 } }
                }}
              >
                {filteredProducts.map(product => (
                  <motion.div 
                    key={product.id} 
                    variants={{
                      hidden: { opacity: 0, scale: 0.9 },
                      show: { opacity: 1, scale: 1 }
                    }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-16 flex flex-col items-center gap-4">
                  <p className="opacity-40 font-bold text-sm">محصولی یافت نشد</p>
                </div>
              )}

              {/* دکمه ادامه در انتهای لیست */}
              {!loading && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onClick={() => navigate('/menu')}
                  className="w-full mt-10 mb-8 bg-white dark:bg-dark border border-gray-100 dark:border-white/5 py-5 rounded-[28px] flex items-center justify-center gap-3 text-dark dark:text-white font-black text-sm shadow-sm active:scale-[0.98] transition-all group"
                >
                  <span>ادامه و مشاهده منوی کامل</span>
                  <div className="p-1.5 bg-primary/10 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                    <ChevronLeft size={16} />
                  </div>
                </motion.button>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;
