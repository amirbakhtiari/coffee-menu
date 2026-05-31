
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useCartStore } from '../store/useCartStore';

const GatewayTransition: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const totalAmount = useCartStore(state => state.totalAmount);
  const clearCart = useCartStore(state => state.clearCart);

  const type = searchParams.get('type');
  const tableId = searchParams.get('tableId');
  const phone = searchParams.get('phone') || '';

  useEffect(() => {
    const timer = setTimeout(() => {
      if (type === 'table' && tableId) {
        // Update table reservation status in mock storage
        const saved = localStorage.getItem('cafe_tables_status');
        if (saved) {
          try {
            const list = JSON.parse(saved);
            const updated = list.map((t: any) => {
              if (t.id === parseInt(tableId)) {
                // Short Persian-formatted current time (like 20:15)
                const PersianTime = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
                return {
                  ...t,
                  isReserved: true,
                  reservedBy: `شما (۰${phone.slice(-10)})`,
                  reserveTime: `بیعانه ساعت ${PersianTime}`
                };
              }
              return t;
            });
            localStorage.setItem('cafe_tables_status', JSON.stringify(updated));
          } catch (e) {
            console.error('Error updating tables storage', e);
          }
        }
        navigate(`/payment-result?status=success&type=table&tableId=${tableId}`);
      } else {
        // Simulate normal food order success
        const currentCount = parseInt(localStorage.getItem('orderCount') || '2');
        localStorage.setItem('orderCount', (currentCount + 1).toString());
        clearCart();
        navigate('/payment-result?status=success');
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate, clearCart, type, tableId, phone]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-dark flex flex-col items-center justify-center text-center gap-10 px-8" dir="rtl">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-28 h-28 border-4 border-primary/10 border-t-primary rounded-full shadow-2xl shadow-primary/5"
          />
          <div className="absolute inset-0 flex items-center justify-center text-primary">
            <CreditCard size={36} className="animate-pulse" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-black text-dark dark:text-white">در حال انتقال به درگاه بانکی</h3>
          <p className="text-sm text-muted dark:text-white/40 font-bold">
            مبلغ قابل پرداخت: <span className="text-dark dark:text-white font-mono">{type === 'table' ? '۵۰,۰۰۰' : totalAmount().toLocaleString()} تومان</span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-[12px] font-black text-muted dark:text-white/30 uppercase tracking-widest">لطفاً از این صفحه خارج نشوید</p>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div 
                key={i}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }} 
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5, 
                  delay: i * 0.2 
                }} 
                className="w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/20" 
              />
            ))}
          </div>
        </div>

        <div className="fixed bottom-12 opacity-20">
           <img src="/logo-simple.png" alt="Logo" className="h-6 grayscale" />
        </div>
      </div>
    </PageTransition>
  );
};

export default GatewayTransition;
