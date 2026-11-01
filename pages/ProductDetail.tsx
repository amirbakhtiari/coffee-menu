import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Minus, Plus, Coffee, Droplets, Milk, Check, Tag } from 'lucide-react';
import { useProduct } from '../hooks/api/useProductsApi';
import { Product, ProductOptions } from '../types';
import { useCartStore } from '../store/useCartStore';
import { useCafeStore } from '../store/useCafeStore';
import { useCafeStatus } from '../hooks/api/useCafeApi';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import AppBar from '../components/AppBar';
import { RelatedProducts } from '../components/RelatedProducts';
import { useTranslation } from '../store/useLanguageStore';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, isRTL, dir } = useTranslation();
  const [actionSuccess, setActionSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  
  const { data: cafeStatus } = useCafeStatus();
  const isClosed = cafeStatus?.isClosed || false;
  const setModalOpen = useCafeStore(state => state.setModalOpen);
  
  const { data: product, isLoading: loading } = useProduct(id);

  // Scroll to top on mount / change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const [size, setSize] = useState<ProductOptions['size']>('M');
  const [sugar, setSugar] = useState<ProductOptions['sugar']>('50%');
  const [milk, setMilk] = useState<ProductOptions['milk']>('معمولی');
  const [syrupType, setSyrupType] = useState<ProductOptions['syrupType']>('بدون سیروپ');
  const [syrupAmount, setSyrupAmount] = useState<ProductOptions['syrupAmount']>('۰');

  const setCartItemQuantity = useCartStore(state => state.setCartItemQuantity);
  const getSpecificItem = useCartStore(state => state.getSpecificItem);

  // Price calculations based on cup size
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

  const handleAddToCart = () => {
    if (isClosed) {
      setModalOpen(true);
      return;
    }

    if (!product) return;

    setCartItemQuantity(product, quantity, currentOptions);
    setActionSuccess(true);
    setTimeout(() => {
      setActionSuccess(false);
    }, 1500);
  };

  const getSizeLabel = (val: 'S' | 'M' | 'L') => {
    if (val === 'S') return t('size_s');
    if (val === 'M') return t('size_m');
    return t('size_l');
  };

  if (loading || !product) {
    return (
      <PageTransition>
        <div className="flex flex-col min-h-screen bg-light-gray dark:bg-dark p-6" dir={dir}>
          <AppBar title="" showBack={true} />
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-muted dark:text-white/40 text-xs font-black">{t('loading')}</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="relative min-h-screen bg-white dark:bg-dark" dir={dir}>
        {/* تصویر محصول در بالای صفحه */}
        <div className="fixed top-0 left-0 right-0 h-[320px] max-w-md mx-auto z-0 bg-secondary/10 dark:bg-black flex items-center justify-center overflow-hidden">
          {product.image && !imageError ? (
            <img 
              src={product.image} 
              alt={product.name} 
              onError={() => setImageError(true)}
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-primary/20">
              <Coffee size={80} strokeWidth={1} />
              <span className="font-black tracking-[2px] text-[10px]">{t('no_image')}</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-dark via-transparent to-transparent opacity-60"></div>
        </div>

        {/* دکمه بازگشت */}
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
          <div className="bg-white dark:bg-dark rounded-t-[44px] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] px-6 pt-8 pb-32 flex flex-col gap-8 border-t border-white/5 text-start">
            <div>
              <div className="flex justify-between items-start">
                {/* نام محصول به عنوان نام اصیل قهوه حفظ می‌شود */}
                <h1 className="text-2xl font-black text-dark dark:text-white">{product.name}</h1>
                <div className="bg-primary/10 px-3 py-1 rounded-full text-primary font-black text-[10px]">
                  {t('cup_size_title')}: {getSizeLabel(size)}
                </div>
              </div>
              <p className="text-muted dark:text-white/40 text-[11px] mt-1 font-medium">{product.subName}</p>
            </div>

            <div className="flex flex-col gap-8">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Coffee size={18} className="text-primary" />
                  <h3 className="font-black text-[15px] text-dark dark:text-white">{t('cup_size_title')}</h3>
                </div>
                <div className="flex gap-4">
                  {[
                    { val: 'S' as const, label: t('size_s'), sz: 16, priceDiff: '-10,000' }, 
                    { val: 'M' as const, label: t('size_m'), sz: 20, priceDiff: t('price_base') }, 
                    { val: 'L' as const, label: t('size_l'), sz: 24, priceDiff: '+15,000' }
                  ].map((s) => (
                    <button 
                      key={s.val} 
                      onClick={() => setSize(s.val)} 
                      className={`flex-1 flex flex-col items-center justify-center gap-1 py-4 rounded-3xl transition-all border-2 cursor-pointer ${size === s.val ? 'bg-primary/5 border-primary text-primary shadow-inner' : 'bg-gray-50 dark:bg-white/5 border-transparent text-muted dark:text-white/40 opacity-60'}`}
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
                  <h3 className="font-black text-[15px] text-dark dark:text-white">{t('sweetness_title')}</h3>
                </div>
                <div className="flex bg-gray-50 dark:bg-white/5 p-1.2 rounded-[22px] border border-gray-100 dark:border-white/5">
                  {(['0%', '50%', '100%'] as const).map((sg) => (
                    <button key={sg} onClick={() => setSugar(sg)} className={`flex-1 py-3 rounded-[18px] font-black text-xs transition-all cursor-pointer ${sugar === sg ? 'bg-white dark:bg-dark text-primary shadow-sm' : 'text-muted dark:text-white/40 opacity-50'}`}>
                      {sg === '0%' ? t('sweetness_zero') : sg === '50%' ? t('sweetness_medium') : t('sweetness_full')}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Milk size={18} className="text-primary" />
                  <h3 className="font-black text-[15px] text-dark dark:text-white">{t('milk_title')}</h3>
                </div>
                <div className="grid grid-cols-4 gap-2 bg-gray-50 dark:bg-white/5 p-1.2 rounded-[22px] border border-gray-100 dark:border-white/5">
                  {[
                    { key: 'بدون شیر', label: t('milk_none') },
                    { key: 'معمولی', label: t('milk_regular') },
                    { key: 'جو دوسر', label: t('milk_oat') },
                    { key: 'سویا', label: t('milk_soy') },
                  ].map((mk) => (
                    <button 
                      key={mk.key} 
                      onClick={() => setMilk(mk.key as any)} 
                      className={`py-3 rounded-[18px] font-black text-[9px] transition-all cursor-pointer ${milk === mk.key ? 'bg-white dark:bg-dark text-primary shadow-sm' : 'text-muted dark:text-white/40 opacity-50'}`}
                    >
                      {mk.label}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div>
              <h2 className="font-black text-sm mb-3 text-dark dark:text-white">{t('about_coffee_title')}</h2>
              <p className="text-muted dark:text-white/60 text-[13px] leading-relaxed opacity-80 font-medium">{product.description}</p>
            </div>

            {product && (
              <RelatedProducts productId={product.id} category={product.category} />
            )}

            <div className="flex justify-between items-center bg-dark rounded-[36px] p-5 shadow-2xl mt-8 mb-6">
              <div className="flex items-center gap-4 bg-white/5 p-1 rounded-2xl">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer"><Minus size={18} /></button>
                <span className="font-black text-xl text-white min-w-[28px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer"><Plus size={18} /></button>
              </div>
              <div className="flex flex-col items-end pl-2">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-black text-white">{(calculatedUnitPrice * quantity).toLocaleString()}</span>
                  <span className="text-xs text-primary font-black ml-1">{t('currency')}</span>
                </div>
                <span className="text-[9px] text-primary font-black uppercase tracking-widest mt-1">{t('total_payable')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* دکمه افزودن نهایی */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-dark/95 backdrop-blur-2xl border-t border-gray-100 dark:border-white/5 max-w-md mx-auto z-50 transition-colors shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
          <button 
            onClick={handleAddToCart} 
            disabled={actionSuccess} 
            className={`w-full h-14 px-4 rounded-2xl flex items-center justify-between text-sm font-bold transition-all duration-300 shadow-lg active:scale-[0.98] cursor-pointer ${
              existingItem 
                ? 'bg-dark dark:bg-black/50 text-white shadow-black/20' 
                : 'bg-primary text-white shadow-primary/30 hover:bg-primary/95'
            }`}
          >
            {actionSuccess ? (
              <div className="flex items-center justify-center gap-2 w-full animate-bounce">
                <Check size={20} className="stroke-[2.5]" />
                <span className="font-black text-base">{t('item_added_success')}</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 dark:bg-white/10 flex items-center justify-center shrink-0">
                    <Coffee size={18} className="text-white" />
                  </div>
                  <span className="font-black text-[14px] text-white">
                    {existingItem ? t('add_to_cart_btn') : t('add_to_cart_btn')}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-[1px] bg-white/20 rounded-full" />
                  <div className="flex items-center gap-1.5 bg-black/15 dark:bg-white/10 px-3.5 py-1.5 rounded-xl">
                    <span className="font-black text-sm text-white">
                      {(calculatedUnitPrice * quantity).toLocaleString()}
                    </span>
                    <span className="text-[11px] font-medium text-white/90">{t('currency')}</span>
                  </div>
                </div>
              </>
            )}
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductDetail;
