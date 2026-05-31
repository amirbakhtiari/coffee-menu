
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import AppBar from '../components/AppBar';
import Button from '../components/Button';
import { useCartStore } from '../store/useCartStore';

type OfflineStep = 'selection' | 'phone_input';

const OfflinePayment: React.FC = () => {
  const navigate = useNavigate();
  const clearCart = useCartStore(state => state.clearCart);
  
  const [step, setStep] = useState<OfflineStep>('selection');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFinalConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      // Increment order count in localStorage
      const currentCount = parseInt(localStorage.getItem('orderCount') || '2'); // Start at 2 because there are 2 dummy orders
      localStorage.setItem('orderCount', (currentCount + 1).toString());
      
      clearCart();
      setLoading(false);
      navigate('/success');
    }, 1200);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-lightGray px-6 pt-12 pb-24 flex flex-col gap-6 text-right">
        <AppBar 
          title={
            step === 'selection' ? 'نوع ثبت سفارش' : 
            'ثبت شماره همراه'
          }
          onBack={() => {
            if (step === 'selection') navigate(-1);
            else setStep('selection');
          }}
        />

        <div className="flex-1 flex flex-col pt-4">
          <AnimatePresence mode="wait">
            {step === 'selection' ? (
              <motion.div 
                key="selection"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col gap-8 h-full justify-center"
              >
                <div className="text-center space-y-3 mb-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-[28px] flex items-center justify-center text-primary mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-xl font-black text-dark leading-tight">تمایل به ثبت شماره دارید؟</h2>
                  <p className="text-muted text-[11px] font-medium px-4 opacity-70 leading-relaxed">
                    با ثبت شماره موبایل، فاکتور برای شما پیامک شده و در قرعه‌کشی‌های کافه آرسیا شرکت داده می‌شوید.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => setStep('phone_input')}
                    className="w-full h-16 bg-primary text-white rounded-[24px] font-black text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <span>بله، شماره وارد می‌کنم</span>
                  </button>

                  <button 
                    onClick={handleFinalConfirm}
                    disabled={loading}
                    className="w-full h-16 bg-white border border-gray-100 text-dark rounded-[24px] font-black text-sm active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <span className="opacity-50 italic">در حال ثبت سفارش...</span>
                    ) : (
                      <span>خیر، مستقیماً ثبت شود</span>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-8"
              >
                <div className="flex flex-col items-center text-center gap-6 mb-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-[28px] flex items-center justify-center text-primary">
                    <Phone size={36} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-black text-dark leading-tight">درج شماره همراه</h2>
                    <p className="text-muted text-[11px] font-medium px-4 opacity-70">
                      شماره خود را جهت دریافت پیامک فاکتور وارد کنید.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-dark/60 mr-2">شماره موبایل</label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        placeholder="09123456789"
                        maxLength={11}
                        className="w-full bg-white border border-gray-100 rounded-2xl p-4 pr-12 text-sm font-black text-dark focus:border-primary outline-none transition-all shadow-sm ltr"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      />
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    </div>
                  </div>

                  <Button 
                    loading={loading}
                    disabled={!/^09\d{9}$/.test(phone)}
                    onClick={handleFinalConfirm}
                    className="w-full h-16 rounded-[24px]"
                  >
                    تایید و ثبت نهایی
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};

export default OfflinePayment;
