
import React from 'react';
import { Smartphone, ArrowRight, ChevronRight, Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import PageTransition from '../components/PageTransition';
import Button from '../components/Button';

interface PhoneLoginProps {
  onBack: () => void;
  onSubmit: (data: { mobile: string }) => void;
  loading: boolean;
}

const PhoneLogin: React.FC<PhoneLoginProps> = ({ onBack, onSubmit, loading }) => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      mobile: ''
    }
  });

  const mobile = watch('mobile');
  const isValid = /^09\d{9}$/.test(mobile);

  return (
    <PageTransition>
      <div className="px-6 pt-12 min-h-screen bg-lightGray dark:bg-dark flex flex-col gap-10 transition-colors" dir="rtl">
        <button onClick={onBack} className="w-12 h-12 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center shadow-sm dark:shadow-none self-start border border-transparent dark:border-white/5">
          <ChevronRight size={22} className="dark:text-white" />
        </button>
        
        <div className="space-y-2 text-right">
          <h2 className="text-2xl font-black text-dark dark:text-white">ورود به حساب</h2>
          <p className="text-muted dark:text-white/60 text-xs font-medium">شماره موبایل خود را وارد کنید تا کد تایید ارسال شود.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
           <div className="relative">
              <Controller
                name="mobile"
                control={control}
                rules={{ required: true, pattern: /^09\d{9}$/ }}
                render={({ field }) => (
                  <input 
                    {...field}
                    type="tel" 
                    placeholder="09123456789"
                    maxLength={11}
                    className="w-full bg-white dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-3xl p-5 pr-14 text-base font-black text-dark dark:text-white focus:border-primary outline-none transition-all shadow-sm dark:shadow-none ltr"
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                  />
                )}
              />
              <Smartphone className="absolute right-5 top-1/2 -translate-y-1/2 text-primary" size={24} />
           </div>

           <Button 
             type="submit"
             loading={loading}
             disabled={!isValid || loading}
             className="w-full h-16 rounded-[28px]"
           >
             {loading ? (
               <Loader2 size={24} className="animate-spin" />
             ) : (
               <>
                 <span>ارسال کد تایید</span>
                 <ArrowRight size={18} className="rotate-180" />
               </>
             )}
           </Button>
        </form>
      </div>
    </PageTransition>
  );
};

export default PhoneLogin;
