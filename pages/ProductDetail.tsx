
import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Minus, Plus, Coffee, Droplets, Milk, Check, Tag } from 'lucide-react';
import { fetchProductById } from '../services/apiService';
import { Product, ProductOptions } from '../types';
import { useCartStore } from '../store/useCartStore';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import AppBar from '../components/AppBar';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [actionSuccess, setActionSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  
  const { data: product, isLoading: loading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => id ? fetchProductById(id) : Promise.resolve(null),
    enabled: !!id,
  });

  const [size, setSize] = useState<ProductOptions['size']>('M');
  const [sugar, setSugar] = useState<ProductOptions['sugar']>('50%');
  const [milk, setMilk] = useState<ProductOptions['milk']>('معمولی');
  const [syrupType, setSyrupType] = useState<ProductOptions['syrupType']>('بدون سیروپ');
  const [syrupAmount, setSyrupAmount] = useState<ProductOptions['syrupAmount']>('۰');

  const setCartItemQuantity = useCartStore(state => state.setCartItemQuantity);
  const getSpecificItem = useCartStore(state => state.getSpecificItem);

  // محاسبه قیمت بر اساس سایز
  const calculatedUnitPrice = useMemo(() => {
    if (!product) return 0;
    let base = product.price;
    if (size === 'S') return base - 10000;
    if (size === 'L') return base + 15000;
    return base;
  }, [product, size]);

  const currentOptions: ProductOptions = useMemo(() => ({
    size, sugar, milk, syrupType, syrupAmount
  }), [size, sugar, milk, syrupType, syrupAmount]);

  const existingItem = id ? getSpecificItem(id, currentOptions) : undefined;

  useEffect(() => {
    if (product) {
      setImageError(!product.image);
    }
  }, [product]);

  useEffect(() => {
    if (existingItem) {
      setQuantity(existingItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [existingItem?.cartId, size]); // وابستگی به سایز اضافه شد

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-lightGray">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (!product) return <div className="p-20 text-center font-bold">محصول یافت نشد</div>;

  const handleAddToCart = async () => {
    if (!product) return;
    setActionSuccess(true);
    
    // ارسال محصول با قیمت محاسبه شده برای این سایز خاص
    const productWithSpecificPrice = { ...product, price: calculatedUnitPrice };
    setCartItemQuantity(productWithSpecificPrice, quantity, currentOptions);
    
    setTimeout(() => {
      navigate('/cart');
    }, 600);
  };

  return (
    <PageTransition>
      <div className="relative flex flex-col bg-white dark:bg-dark min-h-screen transition-colors">
        {/* تصویر ثابت در پس‌زمینه */}
        <div className="fixed top-0 left-0 right-0 h-[320px] max-w-md mx-auto z-0 bg-secondary/10 dark:bg-black flex items-center justify-center overflow-hidden">
          {!imageError ? (
            <img 
              src={product.image} 
              alt={product.name} 
              onError={() => setImageError(true)}
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-primary/20">
              <Coffee size={80} strokeWidth={1} />
              <span className="font-black tracking-[2px] text-[10px]">تصویر موجود نیست</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-dark via-transparent to-transparent opacity-60"></div>
        </div>

        {/* دکمه بازگشت ثابت */}
        <div className="fixed top-8 left-0 right-0 px-6 z-30 max-w-md mx-auto pointer-events-none">
          <div className="pointer-events-auto">
            <AppBar 
              title="" 
              showBack={true}
              onBack={() => navigate(-1)}
              className="mb-0"
            />
          </div>
        </div>

        {/* محتوای اسکرول شونده */}
        <div className="relative z-10 pt-[280px]">
          <div className="bg-white dark:bg-dark rounded-t-[44px] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] px-6 pt-8 pb-32 flex flex-col gap-8 border-t border-white/5">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-black text-dark dark:text-white">{product.name}</h1>
                <div className="bg-primary/10 px-3 py-1 rounded-full text-primary font-black text-[10px]">
                  سایز: {size === 'S' ? 'کوچک' : size === 'M' ? 'متوسط' : 'بزرگ'}
                </div>
              </div>
              <p className="text-muted dark:text-white/40 text-[11px] mt-1 font-medium">{product.subName}</p>
            </div>

            <div className="flex flex-col gap-8">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Coffee size={18} className="text-primary" />
                  <h3 className="font-black text-[15px] text-dark dark:text-white">اندازه فنجان</h3>
                </div>
                <div className="flex gap-4">
                  {[
                    { val: 'S' as const, label: 'کوچک', sz: 16, priceDiff: '۱۰,۰۰۰' }, 
                    { val: 'M' as const, label: 'متوسط', sz: 20, priceDiff: 'پایه' }, 
                    { val: 'L' as const, label: 'بزرگ', sz: 24, priceDiff: '۱۵,۰۰۰+' }
                  ].map((s) => (
                    <button 
                      key={s.val} 
                      onClick={() => setSize(s.val)} 
                      className={`flex-1 flex flex-col items-center justify-center gap-1 py-4 rounded-3xl transition-all border-2 ${size === s.val ? 'bg-primary/5 border-primary text-primary shadow-inner' : 'bg-gray-50 dark:bg-white/5 border-transparent text-muted dark:text-white/40 opacity-60'}`}
                    >
                      <Coffee size={s.sz} />
                      <span className="font-black text-[10px] uppercase">{s.label}</span>
                      <span className="text-[8px] font-bold opacity-50">{s.priceDiff}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Droplets size={18} className="text-primary" />
                  <h3 className="font-black text-[15px] text-dark dark:text-white">میزان شیرینی</h3>
                </div>
                <div className="flex bg-gray-50 dark:bg-white/5 p-1.2 rounded-[22px] border border-gray-100 dark:border-white/5">
                  {(['0%', '50%', '100%'] as const).map((sg) => (
                    <button key={sg} onClick={() => setSugar(sg)} className={`flex-1 py-3 rounded-[18px] font-black text-xs transition-all ${sugar === sg ? 'bg-white dark:bg-dark text-primary shadow-sm' : 'text-muted dark:text-white/40 opacity-50'}`}>
                      {sg === '0%' ? 'بدون شکر' : sg === '50%' ? 'متوسط' : 'کامل'}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Milk size={18} className="text-primary" />
                  <h3 className="font-black text-[15px] text-dark dark:text-white">نوع شیر</h3>
                </div>
                <div className="grid grid-cols-4 gap-2 bg-gray-50 dark:bg-white/5 p-1.2 rounded-[22px] border border-gray-100 dark:border-white/5">
                  {(['بدون شیر', 'معمولی', 'جو دوسر', 'سویا'] as const).map((mk) => (
                    <button key={mk} onClick={() => setMilk(mk)} className={`py-3 rounded-[18px] font-black text-[9px] transition-all ${milk === mk ? 'bg-white dark:bg-dark text-primary shadow-sm' : 'text-muted dark:text-white/40 opacity-50'}`}>
                      {mk}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div>
              <h2 className="font-black text-sm mb-3 text-dark dark:text-white">درباره این قهوه</h2>
              <p className="text-muted dark:text-white/60 text-[13px] leading-relaxed text-justify opacity-80 font-medium">{product.description}</p>
            </div>

            <div className="flex justify-between items-center bg-dark rounded-[36px] p-5 shadow-2xl mb-8">
              <div className="flex items-center gap-4 bg-white/5 p-1 rounded-2xl">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-white active:scale-90 transition-transform"><Minus size={18} /></button>
                <span className="font-black text-xl text-white min-w-[28px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white active:scale-90 transition-transform"><Plus size={18} /></button>
              </div>
              <div className="flex flex-col items-end pl-2">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-black text-white">{(calculatedUnitPrice * quantity).toLocaleString()}</span>
                  <span className="text-sm text-primary font-black italic ml-1">T</span>
                </div>
                <span className="text-[9px] text-primary font-black uppercase tracking-widest mt-1">قیمت نهایی</span>
              </div>
            </div>
          </div>
        </div>

        {/* دکمه افزودن نهایی */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/95 dark:bg-dark/95 backdrop-blur-2xl border-t border-gray-50 dark:border-white/5 flex gap-4 max-w-md mx-auto z-50 transition-colors">
            <Button 
              onClick={handleAddToCart} 
              loading={actionSuccess} 
              className={`flex-1 h-[68px] rounded-[28px] text-base transition-all duration-500 shadow-2xl ${existingItem ? 'bg-dark dark:bg-black/40' : 'bg-primary shadow-primary/30'}`}
            >
              {actionSuccess ? (
                <div className="flex items-center gap-3 animate-bounce">
                  <Check size={24} />
                  <span>تایید شد</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Coffee size={20} />
                  <span>{existingItem ? 'بروزرسانی در سبد' : 'افزودن به سبد سفارش'}</span>
                </div>
              )}
            </Button>
          </div>
      </div>
    </PageTransition>
  );
};

export default ProductDetail;
