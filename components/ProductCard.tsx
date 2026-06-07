
import React, { useState } from 'react';
import { Plus, Minus, Tag, Coffee } from 'lucide-react';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useCafeStore } from '../store/useCafeStore';
import { useCafeStatus } from '../hooks/api/useCafeApi';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'grid' }) => {
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

  if (variant === 'list') {
    return (
      <Link 
        to={`/product/${product.id}`} 
        className="relative bg-white dark:bg-black/20 rounded-[24px] p-2 flex flex-row-reverse gap-4 border border-gray-100 dark:border-white/5 shadow-sm group hover:shadow-md transition-all h-28"
      >
        <div className="relative w-24 shrink-0 overflow-hidden rounded-[18px] bg-secondary/10 flex items-center justify-center p-1">
          <div className="w-full h-full overflow-hidden rounded-[14px]">
            {product.image && !imageError ? (
              <img 
                src={product.image} 
                alt={product.name} 
                onError={() => setImageError(true)}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-primary/30">
                <Coffee size={24} strokeWidth={1} />
              </div>
            )}
          </div>
          
          <AnimatePresence>
            {product.discountPercent && (
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="absolute top-1 right-1 flex items-center gap-0.5 bg-red-500 px-1.5 py-0.5 rounded-full text-white text-[7px] font-black shadow-lg z-10"
              >
                <span>{product.discountPercent}%</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 flex flex-col justify-between py-1 text-right">
          <div>
            <h3 className="font-bold text-dark dark:text-white text-[14px] leading-tight line-clamp-1">{product.name}</h3>
            <p className="text-muted text-[10px] mt-0.5 line-clamp-1">{product.subName}</p>
          </div>
          
          <div className="flex flex-row-reverse justify-between items-end">
            <div className="flex flex-col items-end">
              {product.originalPrice && (
                <span className="text-[9px] text-muted line-through opacity-60 font-medium decoration-red-400">
                  {product.originalPrice.toLocaleString()}
                </span>
              )}
              <div className="flex items-center gap-0.5">
                <span className="text-primary font-black text-[14px]">{product.price.toLocaleString()}</span>
                <span className="text-[10px] text-primary/50 font-black italic">T</span>
              </div>
            </div>

            <div className="shrink-0">
              {quantity > 0 ? (
                <div className="flex items-center bg-secondary/15 rounded-lg p-0.5 gap-2 border border-primary/5 shadow-sm">
                  <button 
                    onClick={handleDecrement}
                    className="w-6 h-6 bg-white dark:bg-dark rounded-md flex items-center justify-center text-primary shadow-sm active:scale-90 transition-transform"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-[11px] font-black text-dark dark:text-white min-w-[14px] text-center">{quantity}</span>
                  <button 
                    onClick={handleIncrement}
                    className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-white shadow-sm active:scale-90 transition-transform"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleIncrement}
                  className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 active:scale-90 transition-transform hover:bg-primary/90"
                >
                  <Plus size={18} />
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
      className="relative bg-white dark:bg-black/20 rounded-[28px] p-2 flex flex-col gap-2 border border-gray-100 dark:border-white/5 shadow-sm group hover:shadow-md transition-all"
    >
      {/* بخش تصویر با سایز کوچک شده (aspect-square) */}
      <div className="relative aspect-square overflow-hidden rounded-[22px] bg-secondary/10 flex items-center justify-center p-1">
        <div className="w-full h-full overflow-hidden rounded-[18px]">
          {product.image && !imageError ? (
            <img 
              src={product.image} 
              alt={product.name} 
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-primary/30">
              <Coffee size={32} strokeWidth={1} />
              <span className="text-[7px] font-black uppercase tracking-widest">بدون عکس</span>
            </div>
          )}
        </div>
        
        {/* بج تخفیف */}
        <AnimatePresence>
          {product.discountPercent && (
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="absolute top-2 right-2 flex items-center gap-1 bg-red-500 px-2 py-0.5 rounded-full text-white text-[8px] font-black shadow-lg z-10"
            >
              <Tag size={8} />
              <span>{product.discountPercent}%</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="px-2 pb-1.5">
        <h3 className="font-bold text-dark dark:text-white text-[12px] leading-tight line-clamp-1">{product.name}</h3>
        <p className="text-muted text-[9px] mb-2 truncate">{product.subName}</p>
        
        <div className="flex justify-between items-end mt-auto gap-1">
          <div className="flex flex-col min-w-0">
            {product.originalPrice && (
              <span className="text-[8px] text-muted line-through opacity-60 font-medium decoration-red-400 truncate">
                {product.originalPrice.toLocaleString()}
              </span>
            )}
            <div className="flex items-center gap-0.5">
              <span className="text-primary font-black text-[12px] whitespace-nowrap">{product.price.toLocaleString()}</span>
              <span className="text-[8px] text-primary/50 font-black italic">T</span>
            </div>
          </div>
          
          <div className="shrink-0">
            {quantity > 0 ? (
              <div className="flex items-center bg-secondary/15 rounded-lg p-0.5 gap-1 border border-primary/5 shadow-sm">
                <button 
                  onClick={handleDecrement}
                  className="w-5 h-5 bg-white dark:bg-dark rounded-md flex items-center justify-center text-primary shadow-sm active:scale-90 transition-transform"
                >
                  <Minus size={10} />
                </button>
                <span className="text-[10px] font-black text-dark dark:text-white min-w-[12px] text-center">{quantity}</span>
                <button 
                  onClick={handleIncrement}
                  className="w-5 h-5 bg-primary rounded-md flex items-center justify-center text-white shadow-sm active:scale-90 transition-transform"
                >
                  <Plus size={10} />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleIncrement}
                className="w-7 h-7 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 active:scale-90 transition-transform hover:bg-primary/90"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
