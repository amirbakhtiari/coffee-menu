
import React from 'react';
import { Smartphone, ArrowRight, ChevronRight, Loader2, Coffee } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import PageTransition from '../components/PageTransition';
import Button from '../components/Button';

interface PhoneLoginProps {
  onBack: () => void;
  onSubmit: (data: { mobile: string }) => void;
  loading: boolean;
}

const toEnglishDigits = (str: string): string => {
  const persianDigits = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicDigits = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  
  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(persianDigits[i], i.toString()).replace(arabicDigits[i], i.toString());
  }
  return result;
};

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
      <div className="px-6 py-8 h-[100dvh] bg-lightGray dark:bg-dark flex flex-col transition-colors overflow-hidden touch-none relative" dir="rtl">
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
          <div className="flex flex-col items-center gap-5">
            {/* Branding Icon Container */}
            <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 text-primary rounded-[28px] flex items-center justify-center shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent" />
              <Coffee size={36} strokeWidth={2.2} />
            </div>

            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-black text-dark dark:text-white">ورود به حساب</h2>
              <p className="text-muted dark:text-white/60 text-xs font-medium px-4">
                شماره موبایل خود را وارد کنید تا کد تایید ارسال شود.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                    onChange={(e) => {
                      const eng = toEnglishDigits(e.target.value);
                      const converted = eng.replace(/\D/g, '');
                      field.onChange(converted);
                    }}
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
                <div className="flex items-center justify-center gap-2">
                  <span>ارسال کد تایید</span>
                  <ArrowRight size={18} className="rotate-180" />
                </div>
              )}
            </Button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
};

export default PhoneLogin;
