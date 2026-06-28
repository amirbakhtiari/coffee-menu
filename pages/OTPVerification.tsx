
import React from 'react';
import { CheckCircle2, RefreshCcw, ChevronRight } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import Button from '../components/Button';
import OTPInput from '../components/OTPInput';

interface OTPVerificationProps {
  phone: string;
  timer: number;
  loading: boolean;
  error: string | null;
  onBack: () => void;
  onVerify: (data: { code: string }) => void;
  onResend: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ 
  phone, timer, loading, error, onBack, onVerify, onResend 
}) => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      otp: ['', '', '', '']
    }
  });

  const otpValue = watch('otp');
  const isComplete = otpValue.every(d => d !== '');

  const onSubmit = (data: { otp: string[] }) => {
    onVerify({ code: data.otp.join('') });
  };

  return (
    <PageTransition>
      <div className="px-6 py-8 h-[100dvh] bg-light-gray dark:bg-dark flex flex-col transition-colors overflow-hidden touch-none relative" dir="rtl">
        {/* Top Header Row */}
        <div className="flex items-center justify-between w-full">
          <button 
            type="button"
            onClick={onBack} 
            className="w-12 h-12 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center shadow-md dark:shadow-none border border-gray-200 dark:border-white/10 active:scale-90 transition-transform"
            title="بازگشت"
          >
            <ChevronRight size={22} className="text-dark dark:text-white" />
          </button>
        </div>

        {/* Center Content Group */}
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full gap-8">
          <div className="text-center space-y-3">
             <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-[24px] flex items-center justify-center text-primary mx-auto">
               <CheckCircle2 size={32} />
             </div>
             <h2 className="text-xl font-black text-dark dark:text-white">کد تایید را وارد کنید</h2>
             <p className="text-muted dark:text-white/60 text-[11px] font-medium leading-relaxed">کد ۴ رقمی به شماره <span className="text-dark dark:text-white font-black tracking-widest" dir="ltr">{phone}</span> ارسال شد.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-center">
              <motion.div
                animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <Controller
                  name="otp"
                  control={control}
                  rules={{ validate: (val) => val.every(d => d !== '') }}
                  render={({ field }) => (
                    <OTPInput 
                      value={field.value} 
                      onChange={field.onChange} 
                      length={4} 
                      error={!!error}
                    />
                  )}
                />
              </motion.div>
            </div>

            <div className="space-y-4">
              <Button 
                type="submit"
                loading={loading}
                disabled={!isComplete || loading}
                className="w-full h-16 rounded-[28px]"
              >
                تایید و ورود به حساب
              </Button>

              <button 
                type="button"
                disabled={timer > 0}
                onClick={onResend}
                className="flex items-center justify-center gap-2 w-full text-[11px] font-black text-primary disabled:opacity-50"
              >
                {timer > 0 ? (
                  <span>ارسال مجدد کد تا {timer} ثانیه دیگر</span>
                ) : (
                  <>
                    <RefreshCcw size={14} />
                    <span>ارسال مجدد کد تایید</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
};

export default OTPVerification;
