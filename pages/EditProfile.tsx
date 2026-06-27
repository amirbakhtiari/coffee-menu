import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, User, Calendar, Smartphone, Check, ShieldCheck, Loader2, X, RefreshCw, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import PageTransition from '../components/PageTransition';
import AppBar from '../components/AppBar';
import { useUserProfileApi } from '../hooks/api/useUserApi';
import { useAuthApi } from '../hooks/api/useAuthApi';
import { useNotificationStore } from '../store/useNotificationStore';
import OTPInput from '../components/OTPInput';
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
  const { requestOtp, isRequestingOtp, verifyOtp, isVerifyingOtp } = useAuthApi();
  const { success, error } = useNotificationStore();

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState<string[]>(['', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [pendingProfileData, setPendingProfileData] = useState<ProfileFormData | null>(null);

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

  useEffect(() => {
    let interval: any;
    if (showOtpModal && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, otpTimer]);

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

  const handleResendOtp = () => {
    if (!pendingProfileData) return;
    requestOtp(pendingProfileData.mobile, {
      onSuccess: () => {
        setOtpTimer(60);
        setOtpCode(['', '', '', '']);
        setOtpError(null);
        success('کد فعال‌سازی مجدداً ارسال شد.');
      },
      onError: (err: any) => {
        setOtpError(err?.message || 'خطا در ارسال مجدد کد تایید');
      }
    });
  };

  const handleVerifyOtp = () => {
    if (!pendingProfileData) return;
    const codeStr = otpCode.join('');
    if (codeStr.length < 4) {
      setOtpError('لطفا کد تایید ۴ رقمی را به طور کامل وارد کنید.');
      return;
    }

    verifyOtp({ mobile: pendingProfileData.mobile, code: codeStr }, {
      onSuccess: () => {
        // OTP verified successfully! Now call updateProfile to persist the changes
        const finalData = {
          fullName: pendingProfileData.fullName,
          birthDate: `${pendingProfileData.year}/${pendingProfileData.month}/${pendingProfileData.day}`,
          mobile: pendingProfileData.mobile,
        };

        updateProfile(finalData, {
          onSuccess: () => {
            success('اطلاعات کاربری و شماره موبایل شما با موفقیت به‌روزرسانی شد.');
            setShowOtpModal(false);
            setIsEditingPhone(false);
            navigate('/profile');
          },
          onError: (err: any) => {
            setOtpError(err?.message || 'خطا در ذخیره‌سازی اطلاعات کاربری');
          }
        });
      },
      onError: (err: any) => {
        setOtpError(err?.message || 'کد وارد شده صحیح نیست. کد آزمایشی ۱۲۳۴ می‌باشد.');
      }
    });
  };

  const onSubmit = (data: ProfileFormData) => {
    const isMobileChanged = data.mobile !== userProfile?.mobile;

    if (isMobileChanged) {
      const numericPhone = data.mobile.replace(/\D/g, '');
      if (!/^09\d{9}$/.test(numericPhone)) {
        error('لطفاً یک شماره موبایل معتبر شروع با ۰۹ وارد کنید.');
        return;
      }

      setPendingProfileData(data);
      requestOtp(data.mobile, {
        onSuccess: () => {
          setShowOtpModal(true);
          setOtpTimer(60);
          setOtpCode(['', '', '', '']);
          setOtpError(null);
        },
        onError: (err: any) => {
          error(err?.message || 'خطا در ارسال کد فعال‌سازی');
        }
      });
    } else {
      const finalData = {
        fullName: data.fullName,
        birthDate: `${data.year}/${data.month}/${data.day}`,
        mobile: data.mobile,
      };
      updateProfile(finalData, {
        onSuccess: () => {
          success('تغییرات با موفقیت ذخیره شد.');
          navigate('/profile');
        }
      });
    }
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
                    className="w-full bg-white dark:bg-black/40 border border-gray-200/80 dark:border-white/10 rounded-2xl py-4 px-6 text-sm font-black text-dark dark:text-white focus:border-primary/50 focus:bg-white dark:focus:bg-black/60 focus:ring-4 focus:ring-primary/10 text-right outline-none transition-all shadow-sm"
                  />
                )}
              />
            </div>

            {/* شماره موبایل */}
            <div className="space-y-3">
              <label className="flex flex-row items-center gap-2 text-[11px] font-black text-muted dark:text-white/40 mr-1">
                <Smartphone size={14} className="text-primary" />
                <span>شماره موبایل</span>
                {isEditingPhone ? (
                  <span className="text-[10px] text-primary font-black mr-auto animate-pulse">در حال ویرایش...</span>
                ) : (
                  <ShieldCheck size={12} className="text-green-500 mr-auto" />
                )}
              </label>
              <div className={`relative flex items-center rounded-2xl transition-all border ${
                isEditingPhone 
                  ? 'border-primary bg-white dark:bg-black/60 shadow-lg shadow-primary/5' 
                  : 'border-gray-200/80 dark:border-white/10 bg-lightGray/50 dark:bg-black/40'
              }`}>
                <Controller
                  name="mobile"
                  control={control}
                  render={({ field }) => (
                    <input 
                      {...field}
                      type="tel"
                      readOnly={!isEditingPhone}
                      className={`w-full bg-transparent border-none py-4 pl-14 pr-6 text-sm font-black text-dark dark:text-white text-left outline-none transition-all ${
                        !isEditingPhone 
                          ? 'text-muted/60 dark:text-white/40 cursor-not-allowed' 
                          : 'text-dark dark:text-white font-black'
                      }`}
                      dir="ltr"
                      onChange={(e) => {
                        const converted = e.target.value.replace(/\D/g, '');
                        field.onChange(converted);
                      }}
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setIsEditingPhone(!isEditingPhone)}
                  className={`absolute left-3 p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                    isEditingPhone 
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20' 
                      : 'bg-primary/5 dark:bg-primary/10 text-primary hover:bg-primary/15'
                  }`}
                  title={isEditingPhone ? 'قفل و تایید' : 'ویرایش شماره'}
                >
                  {isEditingPhone ? (
                    <Check size={15} className="stroke-[3]" />
                  ) : (
                    <Edit2 size={15} className="stroke-[2.5]" />
                  )}
                </button>
              </div>
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
            disabled={isUpdating || isRequestingOtp}
            className={`w-full py-5 rounded-[24px] font-black text-sm flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98] ${
              isUpdating || isRequestingOtp ? 'bg-muted text-white cursor-wait' : 'bg-primary text-white shadow-primary/25 hover:bg-primary/90'
            }`}
          >
            {isUpdating || isRequestingOtp ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>در حال پردازش...</span>
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

      {/* OTP verification modal overlay */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#121214] border border-gray-100 dark:border-white/10 rounded-[32px] p-6 w-full max-w-sm shadow-2xl relative text-center space-y-6"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="absolute top-4 left-4 p-1.5 rounded-full bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-dark dark:hover:text-white transition-colors cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-white/5"
              >
                <X size={16} />
              </button>

              <div className="space-y-2 pt-4 text-right">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Smartphone size={22} className="animate-pulse" />
                </div>
                <h3 className="text-base font-black text-dark dark:text-white text-center">تایید شماره همراه جدید</h3>
                <p className="text-[11px] text-gray-550 dark:text-gray-400 leading-relaxed font-semibold text-center">
                  کد تایید ۴ رقمی به شماره جدید شما ارسال شد. لطفاً آن را جهت تایید شماره جدید وارد نمایید.
                </p>
              </div>

              {/* OTP Input Fields */}
              <div className="flex justify-center py-2" dir="ltr">
                <OTPInput
                  value={otpCode}
                  onChange={(val) => {
                    setOtpCode(val);
                    setOtpError(null);
                  }}
                  error={!!otpError}
                />
              </div>

              {otpError && (
                <p className="text-red-500 text-[11px] font-black animate-pulse leading-relaxed">
                  {otpError}
                </p>
              )}

              {/* Resend and timer section */}
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/[0.02] p-3 rounded-2xl border border-gray-100/40 dark:border-white/5">
                <span className="bg-orange-500/5 text-primary tracking-wide px-2 py-1 rounded-lg">کد تستی فعال‌سازی: ١٢٣٤</span>
                {otpTimer > 0 ? (
                  <span className="font-mono text-gray-400">ارسال مجدد تا {otpTimer} ثانیه</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-primary hover:underline cursor-pointer flex items-center gap-1"
                  >
                    ارسال مجدد کد تایید
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="flex-1 py-3.5 bg-gray-100 dark:bg-white/10 text-gray-650 dark:text-gray-300 text-[11px] font-bold rounded-2xl active:scale-95 transition-all text-center"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp}
                  className="flex-1 py-3.5 bg-primary text-white text-[11px] font-black rounded-2xl active:scale-95 transition-all text-center shadow-lg shadow-primary/10 flex items-center justify-center gap-1"
                >
                  {isVerifyingOtp ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'تایید شماره'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default EditProfile;
