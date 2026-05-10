import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, User, Calendar, Smartphone, Check, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import PageTransition from '../components/PageTransition';
import AppBar from '../components/AppBar';
import { useUserProfileApi } from '../hooks/api/useUserApi';
import Dropdown from '../components/ui/Dropdown';

interface ProfileFormData {
  fullName: string;
  mobile: string;
  birthDate: string;
  year: string;
  month: string;
  day: string;
}

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { profile: userProfile, isLoading, updateProfile, isUpdating } = useUserProfileApi();

  const { control, handleSubmit, setValue, watch, reset } = useForm<ProfileFormData>({
    defaultValues: {
      fullName: '',
      mobile: '',
      birthDate: '',
      year: '۱۳۷۰',
      month: '۰۱',
      day: '۰۱',
    }
  });

  const selectedMonth = watch('month');

  useEffect(() => {
    if (userProfile) {
      const parts = userProfile.birthDate.split('/');
      reset({
        fullName: userProfile.fullName,
        mobile: userProfile.mobile,
        birthDate: userProfile.birthDate,
        year: parts[0] || '۱۳۷۰',
        month: parts[1] || '۰۱',
        day: parts[2] || '۰۱',
      });
    }
  }, [userProfile, reset]);

  const years = Array.from({ length: 1405 - 1300 + 1 }, (_, i) => (1405 - i).toString());
  const months = [
    { value: '۰۱', label: 'فروردین' },
    { value: '۰۲', label: 'اردیبهشت' },
    { value: '۰۳', label: 'خرداد' },
    { value: '۰۴', label: 'تیر' },
    { value: '۰۵', label: 'مرداد' },
    { value: '۰۶', label: 'شهریور' },
    { value: '۰۷', label: 'مهر' },
    { value: '۰۸', label: 'آبان' },
    { value: '۰۹', label: 'آذر' },
    { value: '۱۰', label: 'دی' },
    { value: '۱۱', label: 'بهمن' },
    { value: '۱۲', label: 'اسفند' },
  ];

  const getDaysInMonth = (month: string) => {
    const m = parseInt(month.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()));
    if (m <= 6) return 31;
    if (m <= 11) return 30;
    return 29;
  };

  const daysCount = getDaysInMonth(selectedMonth);
  const days = Array.from({ length: daysCount }, (_, i) => (i + 1).toString().padStart(2, '0').replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]));

  const onSubmit = (data: ProfileFormData) => {
    const finalData = {
      fullName: data.fullName,
      birthDate: `${data.year}/${data.month}/${data.day}`
    };
    updateProfile(finalData, {
      onSuccess: () => navigate('/profile')
    });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <PageTransition>
      <div className="px-6 pt-12 pb-32 min-h-screen bg-lightGray dark:bg-dark transition-colors" dir="rtl">
        <AppBar 
          title="ویرایش پروفایل"
          subtitle="اطلاعات کاربری خود را به‌روزرسانی کنید"
          onBack={() => navigate('/profile')}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white dark:bg-black/20 rounded-[32px] p-8 shadow-sm dark:shadow-none border border-gray-50 dark:border-white/5 space-y-8">
            {/* نام و نام خانوادگی */}
            <div className="space-y-3">
              <label className="flex flex-row items-center gap-2 text-[11px] font-black text-muted dark:text-white/40 mr-1">
                <User size={14} className="text-primary" />
                <span>نام و نام خانوادگی</span>
              </label>
              <Controller
                name="fullName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <input 
                    {...field}
                    type="text"
                    className="w-full bg-lightGray dark:bg-black/40 border-none rounded-2xl py-4 px-6 text-sm font-black text-dark dark:text-white focus:ring-2 focus:ring-primary/20 text-right outline-none transition-colors"
                  />
                )}
              />
            </div>

            {/* شماره موبایل */}
            <div className="space-y-3 opacity-60">
              <label className="flex flex-row items-center gap-2 text-[11px] font-black text-muted dark:text-white/40 mr-1">
                <Smartphone size={14} />
                <span>شماره موبایل (غیر قابل تغییر)</span>
                <ShieldCheck size={12} className="text-green-500 mr-auto" />
              </label>
              <Controller
                name="mobile"
                control={control}
                render={({ field }) => (
                  <input 
                    {...field}
                    type="text"
                    readOnly
                    className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-2xl py-4 px-6 text-sm font-bold text-muted dark:text-white/20 text-right outline-none cursor-not-allowed"
                    dir="ltr"
                  />
                )}
              />
            </div>

            {/* تاریخ تولد */}
            <div className="space-y-4">
              <label className="flex flex-row items-center gap-2 text-[11px] font-black text-muted dark:text-white/40 mr-1">
                <Calendar size={14} className="text-primary" />
                <span>تاریخ تولد</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                <Controller
                  name="year"
                  control={control}
                  render={({ field }) => (
                    <Dropdown 
                      label="سال"
                      value={field.value}
                      onChange={field.onChange}
                      options={years}
                    />
                  )}
                />

                <Controller
                  name="month"
                  control={control}
                  render={({ field }) => (
                    <Dropdown 
                      label="ماه"
                      value={field.value}
                      onChange={field.onChange}
                      options={months}
                    />
                  )}
                />

                <Controller
                  name="day"
                  control={control}
                  render={({ field }) => (
                    <Dropdown 
                      label="روز"
                      value={field.value}
                      onChange={field.onChange}
                      options={days}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isUpdating}
            className={`w-full py-5 rounded-[24px] font-black text-sm flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98] ${
              isUpdating ? 'bg-muted text-white cursor-wait' : 'bg-primary text-white shadow-primary/25 hover:bg-primary/90'
            }`}
          >
            {isUpdating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>در حال ذخیره...</span>
              </div>
            ) : (
              <>
                <Check size={20} />
                <span>تایید و ذخیره تغییرات</span>
              </>
            )}
          </button>
        </form>
      </div>
    </PageTransition>
  );
};

export default EditProfile;
