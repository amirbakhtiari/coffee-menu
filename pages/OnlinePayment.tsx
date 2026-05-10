
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, User, ShieldCheck, RefreshCcw, AlertCircle, CreditCard, Check, X } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import AppBar from '../components/AppBar';
import Button from '../components/Button';
import OTPInput from '../components/OTPInput';
import { useCartStore } from '../store/useCartStore';

type CheckoutStep = 'info_form' | 'otp_verification';

const OnlinePayment: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const startPaymentProcess = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/gateway-transition');
    }, 1000);
  };

  const isFormValid = 
    formData.firstName.trim().length >= 2 && 
    formData.lastName.trim().length >= 2 && 
    /^09\d{9}$/.test(formData.phone);

  return (
    <PageTransition>
      <div className="min-h-screen bg-lightGray dark:bg-dark px-6 pt-12 pb-24 flex flex-col gap-6 text-right">
        <AppBar 
          title="اطلاعات پرداخت"
          onBack={handleBack}
        />

        <div className="flex-1 flex flex-col pt-4">
          <AnimatePresence mode="wait">
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <div className="p-4 rounded-2xl flex items-center gap-3 border bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20 text-amber-700 dark:text-amber-400">
                   <AlertCircle size={18} />
                   <p className="text-[10px] font-black leading-relaxed">
                     لطفاً اطلاعات خود را برای صدور فاکتور و پرداخت آنلاین وارد کنید.
                   </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-dark/60 dark:text-white/40 mr-2 flex items-center gap-1">
                      نام <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="مثلاً رضا"
                      className="w-full bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 rounded-2xl p-4 text-sm font-black text-dark dark:text-white focus:border-primary outline-none transition-all shadow-sm"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-dark/60 dark:text-white/40 mr-2 flex items-center gap-1">
                      نام خانوادگی <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="مثلاً محمدی"
                      className="w-full bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 rounded-2xl p-4 text-sm font-black text-dark dark:text-white focus:border-primary outline-none transition-all shadow-sm"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-dark/60 dark:text-white/40 mr-2 flex items-center gap-1">
                      شماره موبایل <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        placeholder="09123456789"
                        maxLength={11}
                        className="w-full bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 rounded-2xl p-4 pr-12 text-sm font-black text-dark dark:text-white focus:border-primary outline-none transition-all shadow-sm ltr"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                      />
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-white/20" size={18} />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                   <Button 
                    loading={loading}
                    disabled={!isFormValid}
                    onClick={startPaymentProcess}
                    className="w-full h-16 rounded-[24px]"
                   >
                     تایید و پرداخت آنلاین
                   </Button>
                </div>
              </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};

export default OnlinePayment;
