
import React from 'react';
import { CheckCircle2, RefreshCcw, ChevronRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Button from '../components/Button';
import OTPInput from '../components/OTPInput';

interface OTPVerificationProps {
  phone: string;
  otp: string[];
  setOtp: (val: string[]) => void;
  timer: number;
  loading: boolean;
  onBack: () => void;
  onVerify: () => void;
  onResend: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ 
  phone, otp, setOtp, timer, loading, onBack, onVerify, onResend 
}) => {
  return (
    <PageTransition>
      <div className="px-6 pt-12 min-h-screen bg-lightGray dark:bg-dark flex flex-col items-center gap-12 transition-colors">
        <button onClick={onBack} className="w-12 h-12 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center shadow-sm dark:shadow-none self-start border border-transparent dark:border-white/5">
          <ChevronRight size={22} className="dark:text-white" />
        </button>

        <div className="text-center space-y-3">
           <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-[32px] flex items-center justify-center text-primary mx-auto">
             <CheckCircle2 size={40} />
           </div>
           <h2 className="text-xl font-black text-dark dark:text-white">کد تایید را وارد کنید</h2>
           <p className="text-muted dark:text-white/60 text-[11px] font-medium leading-relaxed">کد ۴ رقمی به شماره <span className="text-dark dark:text-white font-black tracking-widest">{phone}</span> ارسال شد.</p>
        </div>

        <OTPInput value={otp} onChange={setOtp} length={4} />

        <div className="w-full space-y-4">
           <Button 
             loading={loading}
             disabled={otp.some(d => d === '')}
             onClick={onVerify}
             className="w-full h-16 rounded-[28px]"
           >
             تایید و ورود به حساب
           </Button>

           <button 
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
      </div>
    </PageTransition>
  );
};

export default OTPVerification;
