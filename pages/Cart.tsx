
import React, { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useCafeStore } from '../store/useCafeStore';
import { useCafeStatus } from '../hooks/api/useCafeApi';
import { Trash2, Plus, Minus, ChevronRight, ShoppingBag, AlertCircle, Coffee, StickyNote, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import AppBar from '../components/AppBar';

// کامپوننت داخلی برای مدیریت تصویر با قابلیت Placeholder
const CartImage = ({ src, name }: { src: string; name: string }) => {
  const [error, setError] = useState(!src);
  return (
    <div className="w-20 h-20 shrink-0 rounded-[22px] bg-secondary/10 dark:bg-white/5 flex items-center justify-center overflow-hidden shadow-sm">
      {src && !error ? (
        <img src={src} className="w-full h-full object-cover" alt={name} onError={() => setError(true)} />
      ) : (
        <Coffee size={24} className="text-primary/20" />
      )}
    </div>
  );
};

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, updateNote, totalAmount, totalOriginalAmount, totalDiscount, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingNote, setEditingNote] = useState<{ cartId: string; note: string } | null>(null);
  const [noteInput, setNoteInput] = useState('');

  const { data: cafeStatus } = useCafeStatus();
  const isClosed = cafeStatus?.isClosed || false;
  const setModalOpen = useCafeStore(state => state.setModalOpen);

  const handleOpenNoteModal = (cartId: string, currentNote?: string) => {
    setEditingNote({ cartId, note: currentNote || '' });
    setNoteInput(currentNote || '');
  };

  const handleSaveNote = () => {
    if (editingNote) {
      updateNote(editingNote.cartId, noteInput);
      setEditingNote(null);
    }
  };

  const handleClearCart = () => {
    clearCart();
    setShowConfirmModal(false);
  };

  const getSizeLabel = (size?: string) => {
    if (size === 'S') return 'کوچک';
    if (size === 'M') return 'متوسط';
    if (size === 'L') return 'بزرگ';
    return size;
  };

  return (
    <PageTransition>
      <div className="flex flex-col h-[100dvh] bg-lightGray dark:bg-dark overflow-hidden transition-colors">
        <div className="bg-white/95 dark:bg-dark/95 backdrop-blur-md px-6 pt-6 border-b border-gray-100 dark:border-white/5 shrink-0 z-30">
          <AppBar 
            title="سبد سفارش"
            className="mb-2"
            onBack={() => navigate('/')}
            rightAction={
              items.length > 0 ? (
                <button 
                  onClick={() => setShowConfirmModal(true)} 
                  className="w-10 h-10 flex items-center justify-center bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/10 dark:border-red-500/20 rounded-xl active:scale-90 shadow-sm transition-transform"
                >
                  <Trash2 size={18} />
                </button>
              ) : undefined
            }
          />
        </div>

        <main className="flex-1 overflow-y-auto no-scrollbar px-6 py-4">
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="h-full flex flex-col items-center justify-center gap-4"
              >
                 <div className="w-20 h-20 bg-white dark:bg-white/5 rounded-full flex items-center justify-center text-gray-200 dark:text-white/10 shadow-sm border border-gray-50 dark:border-white/5">
                   <ShoppingBag size={40} />
                 </div>
                 <div className="text-center">
                   <p className="text-dark dark:text-white font-black text-base">سبد خرید خالی است</p>
                   <p className="text-muted dark:text-white/40 text-[11px] mt-1 font-medium">هنوز محصولی انتخاب نکرده‌اید</p>
                 </div>
                 <button 
                   onClick={() => navigate('/')} 
                   className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black text-xs shadow-lg shadow-primary/20 active:scale-95 transition-all"
                 >
                   مشاهده منو و سفارش
                 </button>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-4 pb-10">
                {items.map(item => (
                    <motion.div 
                      key={item.cartId} 
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white dark:bg-black/20 p-3 rounded-[32px] flex gap-4 items-center shadow-sm border border-white dark:border-white/5"
                    >
                      <CartImage src={item.image} name={item.name} />
                      
                      <div className="flex-1 min-w-0 text-right">
                        <h3 className="font-black text-sm text-dark dark:text-white truncate leading-tight">{item.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1.5 mb-2">
                           <span className={`text-[8px] px-2 py-0.5 rounded-full font-black ${
                             item.selectedOptions?.size === 'S' ? 'bg-blue-50 text-blue-500' :
                             item.selectedOptions?.size === 'L' ? 'bg-orange-50 text-orange-500' :
                             'bg-secondary/30 text-primary'
                           }`}>
                             {getSizeLabel(item.selectedOptions?.size)}
                           </span>
                           {item.selectedOptions?.sugar && (
                             <span className="text-[8px] bg-gray-50 dark:bg-white/5 text-muted dark:text-white/40 px-2 py-0.5 rounded-full font-black">
                               {item.selectedOptions.sugar === '0%' ? 'بدون شکر' : item.selectedOptions.sugar === '50%' ? 'متوسط' : 'کامل'}
                             </span>
                           )}
                           {item.selectedOptions?.milk && item.selectedOptions.milk !== 'بدون شیر' && (
                             <span className="text-[8px] bg-gray-50 dark:bg-white/5 text-muted dark:text-white/40 px-2 py-0.5 rounded-full font-black">{item.selectedOptions.milk}</span>
                           )}
                        </div>
                      <div className="flex items-center gap-1 text-primary font-black text-sm leading-none">
                        <span>{item.price.toLocaleString()}</span>
                        <span className="text-[10px] italic font-black opacity-50 ml-0.5">T</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                       <div className="flex gap-1">
                         <button onClick={() => handleOpenNoteModal(item.cartId, item.note)} className={`p-1 transition-colors ${item.note ? 'text-primary' : 'text-gray-300 active:text-primary'}`}>
                           <StickyNote size={16} />
                         </button>
                         <button onClick={() => removeFromCart(item.cartId)} className="text-gray-300 p-1 active:text-red-500 transition-colors">
                           <Trash2 size={16} />
                         </button>
                       </div>
                       <div className="flex items-center bg-lightGray dark:bg-white/5 rounded-[18px] p-1 gap-2.5 border border-gray-100 dark:border-white/5">
                          <button 
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)} 
                            className="w-7 h-7 flex items-center justify-center bg-white dark:bg-dark rounded-xl text-primary shadow-sm active:scale-90 transition-transform"
                          >
                            <Minus size={14}/>
                          </button>
                          <span className="text-sm font-black w-4 text-center text-dark dark:text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)} 
                            className="w-7 h-7 flex items-center justify-center bg-primary rounded-xl text-white shadow-sm active:scale-90 transition-transform"
                          >
                            <Plus size={14}/>
                          </button>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </main>

        {items.length > 0 && (
          <footer className="shrink-0 bg-white dark:bg-[#121212] px-6 pt-2 pb-4 rounded-t-[28px] shadow-[0_-10px_30px_rgba(0,0,0,0.06)] border-t border-gray-100 dark:border-white/5 z-40">
            <div className="mb-3 px-1">
               {/* Subtotal & Discount - Ultra Compact */}
               {totalDiscount() > 0 ? (
                 <div className="flex justify-between items-center text-[10px] pb-2 border-b border-gray-50 dark:border-white/5 mb-2">
                    <div className="flex flex-col text-right">
                       <span className="text-muted dark:text-white/30 font-bold">مجموع اقلام</span>
                       <span className="text-dark dark:text-white/60 font-black" dir="ltr">{totalOriginalAmount().toLocaleString()} T</span>
                    </div>
                    <div className="flex flex-col text-left">
                       <span className="text-red-500/60 font-bold">تخفیف</span>
                       <span className="text-red-500 font-black" dir="ltr">{totalDiscount().toLocaleString()} T</span>
                    </div>
                 </div>
               ) : null}

               <div className="flex justify-between items-center">
                  <div className="flex flex-col text-right">
                     <span className="text-muted dark:text-white/40 text-[8px] font-black uppercase tracking-tight opacity-50">مبلغ قابل پرداخت</span>
                     <div className="flex items-center gap-1">
                       <span className="text-xl font-black text-dark dark:text-white leading-none">{totalAmount().toLocaleString()}</span>
                       <span className="text-[10px] text-dark dark:text-white font-black italic">T</span>
                     </div>
                  </div>
                  <div className="bg-primary/10 px-3 py-1.5 rounded-xl text-[9px] text-primary font-black border border-primary/10 flex items-center gap-1.5">
                    <span>{items.reduce((a,b) => a + b.quantity, 0)}</span>
                    <span className="opacity-60">آیتم</span>
                  </div>
               </div>
            </div>
            
            <button 
              onClick={() => {
                if (isClosed) {
                  setModalOpen(true);
                  return;
                }
                navigate('/payment-method');
              }}
              className="w-full h-12 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>تأیید و پرداخت</span>
              <ChevronRight size={16} className="rotate-180" />
            </button>
          </footer>
        )}

        <AnimatePresence>
          {editingNote && (
            <div className="fixed inset-0 z-[110] flex items-end justify-center">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setEditingNote(null)} 
                className="absolute inset-0 bg-dark/70 backdrop-blur-sm" 
              />
              <motion.div 
                initial={{ y: "100%" }} 
                animate={{ y: 0 }} 
                exit={{ y: "100%" }} 
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative bg-white dark:bg-dark w-full rounded-t-[40px] p-8 shadow-2xl flex flex-col gap-6 border-t border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <StickyNote size={20} />
                    </div>
                    <h3 className="text-lg font-black text-dark dark:text-white">یادداشت سفارش</h3>
                  </div>
                  <button onClick={() => setEditingNote(null)} className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-full text-dark dark:text-white">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-[11px] text-muted dark:text-white/40 font-bold px-2">توضیحات خاص خود را برای این آیتم بنویسید (مثلاً: داغ باشد، شکر کم و ...)</p>
                  <textarea
                    autoFocus
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="اینجا بنویسید..."
                    className="w-full h-32 bg-lightGray dark:bg-white/5 border-none rounded-[28px] p-6 text-sm font-bold text-dark dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-right"
                    dir="rtl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button onClick={handleSaveNote} className="bg-primary text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-primary/20 active:scale-95 transition-transform">ثبت یادداشت</button>
                  <button onClick={() => setEditingNote(null)} className="bg-gray-100 dark:bg-white/5 text-dark/70 dark:text-white/70 py-4 rounded-2xl font-black text-sm active:scale-95 transition-transform">انصراف</button>
                </div>
              </motion.div>
            </div>
          )}

          {showConfirmModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirmModal(false)} className="absolute inset-0 bg-dark/70 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white dark:bg-dark w-full max-w-[320px] rounded-[44px] p-8 shadow-2xl flex flex-col items-center text-center gap-6 border border-white/10">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center text-red-500"><AlertCircle size={32} /></div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-black text-dark dark:text-white leading-tight">حذف تمام آیتم‌ها؟</h3>
                  <p className="text-xs text-muted dark:text-white/40 font-medium">آیا مطمئن هستید که می‌خواهید سبد خرید را خالی کنید؟</p>
                </div>
                <div className="flex flex-col w-full gap-3">
                  <button onClick={handleClearCart} className="w-full bg-red-500 text-white py-4 rounded-[22px] font-black text-sm shadow-lg shadow-red-500/20 active:scale-95 transition-transform">بله، پاک شود</button>
                  <button onClick={() => setShowConfirmModal(false)} className="w-full bg-gray-100 dark:bg-white/5 text-dark/70 dark:text-white/70 py-4 rounded-[22px] font-black text-sm active:scale-95 transition-transform">انصراف</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default Cart;
