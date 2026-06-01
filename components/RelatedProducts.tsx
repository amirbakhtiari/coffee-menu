import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import { useRelatedProducts } from '../hooks/api/useProductsApi';
import { Product, CategoryType } from '../types';

interface RelatedProductCardProps {
  product: Product;
}

const RelatedProductCard: React.FC<RelatedProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(!product.image);
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/product/${product.id}`)}
      className="w-28 shrink-0 bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl p-2 cursor-pointer active:scale-95 hover:border-primary/20 dark:hover:border-primary/20 transition-all text-right select-none snap-start group"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary/10 flex items-center justify-center">
        {product.image && !imageError ? (
          <img 
            src={product.image} 
            alt={product.name} 
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary/30">
            <Coffee size={20} strokeWidth={1} />
          </div>
        )}
        
        {product.discountPercent && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-black px-1 rounded-full shadow-sm">
            {product.discountPercent}%
          </span>
        )}
      </div>
      
      <div className="mt-1 px-0.5">
        <h4 className="font-extrabold text-dark dark:text-white text-[10px] leading-tight truncate">{product.name}</h4>
        <p className="text-muted text-[8px] truncate opacity-60 m-0">{product.subName}</p>
        
        <div className="flex items-center justify-end gap-0.5 mt-1">
          <span className="text-primary font-black text-[11px]">{product.price.toLocaleString()}</span>
          <span className="text-[7.5px] text-primary/50 font-black italic">T</span>
        </div>
      </div>
    </div>
  );
};

interface RelatedProductsProps {
  productId: string;
  category?: CategoryType;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ productId, category }) => {
  const { data: relatedProducts, isLoading, isError } = useRelatedProducts(productId, category);

  if (isError) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center px-1">
          <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse" />
          <div className="h-3 w-14 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse" />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-none">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-28 shrink-0 bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl p-2 animate-pulse space-y-2">
              <div className="aspect-square rounded-xl bg-gray-250 dark:bg-white/5" />
              <div className="h-2 w-3/4 bg-gray-250 dark:bg-white/5 rounded mx-auto" />
              <div className="h-2 w-1/2 bg-gray-250 dark:bg-white/5 rounded mx-auto" />
              <div className="h-2.5 w-1/3 bg-gray-250 dark:bg-white/5 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center px-1">
        <h3 className="font-extrabold text-[13px] text-dark dark:text-white flex items-center gap-2">
          <Coffee size={16} className="text-primary" />
          <span>محصولات مرتبط</span>
        </h3>
        <span className="text-[9px] text-primary/75 font-bold animate-pulse">اسکرول کنید ←</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-none snap-x snap-mandatory scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
        {relatedProducts.map((p) => (
          <RelatedProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};
