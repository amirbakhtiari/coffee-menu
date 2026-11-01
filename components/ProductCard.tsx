
import React, { useState } from 'react';
import { Plus, Minus, Tag, Coffee } from 'lucide-react';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useCafeStore } from '../store/useCafeStore';
import { useCafeStatus } from '../hooks/api/useCafeApi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../store/useLanguageStore';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'grid' }) => {
  const { t, isRTL } = useTranslation();
  const updateProductQuantity = useCartStore(state => state.updateProductQuantity);
  const quantity = useCartStore(state => state.getItemQuantity(product.id));
  const [imageError, setImageError] = useState(!product.image);

  const { data: cafeStatus } = useCafeStatus();
  const isClosed = cafeStatus?.isClosed || false;
  const setModalOpen = useCafeStore(state => state.setModalOpen);

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isClosed) {
      setModalOpen(true);
      return;
    }
    updateProductQuantity(product, 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateProductQuantity(product, -1);
  };

  const discountBadgeText = isRTL ? `٪${product.discountPercent}` : `${product.discountPercent}%`;
  const discountLabelText = isRTL 
    ? `٪${product.discountPercent} ${t('discount_suffix')}` 
    : `${product.discountPercent}% ${t('discount_suffix')}`;

  if (variant === 'list') {
    return (
      <Link 
        to={`/product/${product.id}`} 
        className="relative bg-transparent hover:bg-black/[0.02] dark:hover:bg-white/[0.02] rounded-2xl p-2 flex flex-row gap-3 transition-colors min-h-[96px] group"
      >
        <div className="relative w-22 h-22 shrink-0 overflow-hidden rounded-[16px] bg-secondary/15 dark:bg-white/[0.03] flex items-center justify-center p-0.5">
          <div className="w-full h-full overflow-hidden rounded-[14px]">
            {product.image && !imageError ? (
              <img 
                src={product.image} 
                alt={product.name} 
                onError={() => setImageError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-primary/30">
                <Coffee size={22} strokeWidth={1} />
                <span className="text-[7px] font-black">{t('no_image')}</span>
              </div>
            )}
          </div>
          
          <AnimatePresence>
            {product.discountPercent && (
              <motion.div 
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-1.5 end-1.5 flex items-center gap-0.5 bg-red-500 px-1.5 py-0.5 rounded-full text-white text-[8.5px] font-black shadow-md shadow-red-500/25 z-10"
              >
                <span>{discountBadgeText}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 flex flex-col justify-between py-1 text-start min-w-0">
          <div>
            {/* حفظ دقیق نام محصول به عنوان نام اختصاصی قهوه طبق درخواست کاربر */}
            <h3 className="font-bold text-dark dark:text-white text-[13.5px] leading-tight line-clamp-1">{product.name}</h3>
            <p className="text-muted text-[10px] mt-0.5 line-clamp-1">{product.subName}</p>
          </div>
          
          <div className="flex justify-between items-end gap-2">
            <div className="flex flex-col justify-end min-w-0">
              {product.originalPrice ? (
                <div className="flex items-center gap-1.5 mb-0.5 leading-none">
                  <span className="text-[9.5px] text-muted line-through opacity-60 font-medium decoration-red-400">
                    {product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-[7.5px] bg-red-500/10 dark:bg-red-500/20 text-red-500 font-black px-1.5 py-0.5 rounded-full">
                    {discountLabelText}
                  </span>
                </div>
              ) : null}
              <div className="flex items-baseline gap-1 leading-none">
                <span className="text-primary font-black text-[14.5px]">{product.price.toLocaleString()}</span>
                <span className="text-[9.5px] text-primary/70 font-bold">{t('currency')}</span>
              </div>
            </div>

            <div className="shrink-0">
              {quantity > 0 ? (
                <div className="flex items-center bg-secondary/20 dark:bg-white/10 rounded-full p-0.5 gap-1 border border-primary/10">
                  <button 
                    onClick={handleDecrement}
                    className="w-5.5 h-5.5 bg-white dark:bg-dark rounded-full flex items-center justify-center text-primary active:scale-90 transition-transform"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="text-[11px] font-black text-dark dark:text-white min-w-[14px] text-center">{quantity}</span>
                  <button 
                    onClick={handleIncrement}
                    className="w-5.5 h-5.5 bg-primary rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
                  >
                    <Plus size={11} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleIncrement}
                  className="w-7.5 h-7.5 bg-primary rounded-full flex items-center justify-center text-white active:scale-90 transition-transform hover:bg-primary/90"
                >
                  <Plus size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="relative bg-white/70 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.06] rounded-[20px] p-2 flex flex-col justify-between transition-all h-full group"
    >
      {/* بخش تصویر با نسبت متناسب */}
      <div className="relative aspect-square overflow-hidden rounded-[16px] bg-secondary/15 dark:bg-white/[0.03] flex items-center justify-center p-1">
        <div className="w-full h-full overflow-hidden rounded-[13px]">
          {product.image && !imageError ? (
            <img 
              src={product.image} 
              alt={product.name} 
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-primary/30">
              <Coffee size={30} strokeWidth={1} />
              <span className="text-[7px] font-black uppercase tracking-widest">{t('no_image')}</span>
            </div>
          )}
        </div>
        
        {/* بج تخفیف شیک */}
        <AnimatePresence>
          {product.discountPercent && (
            <motion.div 
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-2 end-2 flex items-center gap-0.5 bg-red-500 px-1.5 py-0.5 rounded-full text-white text-[8.5px] font-black shadow-md shadow-red-500/25 z-10"
            >
              <span>{discountBadgeText}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="px-1 pt-1.5 pb-0.5 flex flex-col flex-1 justify-between gap-1.5 text-start">
        <div>
          {/* حفظ دقیق نام محصول به عنوان نام اختصاصی قهوه طبق درخواست کاربر */}
          <h3 className="font-bold text-dark dark:text-white text-[13px] leading-snug line-clamp-1">{product.name}</h3>
          <p className="text-muted text-[9.5px] mt-0.5 truncate opacity-70">{product.subName}</p>
        </div>
        
        <div className="flex justify-between items-end gap-1 pt-1 border-t border-gray-100/50 dark:border-white/[0.03]">
          <div className="flex flex-col min-w-0 justify-end">
            {product.originalPrice ? (
              <div className="flex items-center gap-1 leading-none mb-0.5">
                <span className="text-[9px] text-muted line-through opacity-65 font-medium decoration-red-400 truncate">
                  {product.originalPrice.toLocaleString()}
                </span>
                <span className="text-[7px] bg-red-500/10 dark:bg-red-500/20 text-red-500 font-black px-1 py-0.5 rounded">
                  {discountBadgeText}
                </span>
              </div>
            ) : (
              <span className="text-[8px] invisible leading-none mb-0.5 select-none">0</span>
            )}
            <div className="flex items-baseline gap-1 leading-none">
              <span className="text-primary font-black text-[13px] whitespace-nowrap">{product.price.toLocaleString()}</span>
              <span className="text-[8.5px] text-primary/70 font-bold">{t('currency')}</span>
            </div>
          </div>
          
          <div className="shrink-0">
            {quantity > 0 ? (
              <div className="flex items-center bg-secondary/20 dark:bg-white/10 rounded-full p-0.5 gap-0.5 border border-primary/10">
                <button 
                  onClick={handleDecrement}
                  className="w-4.5 h-4.5 bg-white dark:bg-dark rounded-full flex items-center justify-center text-primary active:scale-90 transition-transform"
                >
                  <Minus size={9} />
                </button>
                <span className="text-[9.5px] font-black text-dark dark:text-white min-w-[10px] text-center">{quantity}</span>
                <button 
                  onClick={handleIncrement}
                  className="w-4.5 h-4.5 bg-primary rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
                >
                  <Plus size={9} />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleIncrement}
                className="w-7.5 h-7.5 bg-primary rounded-full flex items-center justify-center text-white active:scale-90 transition-transform hover:bg-primary/90"
              >
                <Plus size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
