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

const toEnglishDigits = (str: string): string => {
  const persianDigits = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicDigits = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  
  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(persianDigits[i], i.toString()).replace(arabicDigits[i], i.toString());
  }
  return result;
};

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { profile: userProfile, isLoading, updateProfile, isUpdating } = useUserProfileApi();
  const { requestOtp, isRequestingOtp, verifyOtp, isVerifyingOtp } = useAuthApi();
  const { success, error } = useNotificationStore();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState<string[]>(['', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [pendingProfileData, setPendingProfileData] = useState<ProfileFormData | null>(null);

  const { control, handleSubmit, setValue, watch, reset, setError, clearErrors, formState: { errors } } = useForm<ProfileFormData>({
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
        mobile: toEnglishDigits(userProfile.mobile),
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
    clearErrors('fullName');
    clearErrors('mobile');

    let hasError = false;

    if (!data.fullName.trim()) {
      setError('fullName', { type: 'manual', message: 'لطفاً نام و نام خانوادگی خود را وارد کنید.' });
      hasError = true;
    }

    const normalizedMobile = toEnglishDigits(data.mobile);
    const numericPhone = normalizedMobile.replace(/\D/g, '');
    if (!numericPhone) {
      setError('mobile', { type: 'manual', message: 'لطفاً شماره موبایل خود را وارد کنید.' });
      hasError = true;
    } else if (!/^09\d{9}$/.test(numericPhone)) {
      setError('mobile', { type: 'manual', message: 'لطفاً یک شماره موبایل معتبر شروع با ۰۹ وارد کنید.' });
      hasError = true;
    }

    if (hasError) return;

    const isMobileChanged = normalizedMobile !== toEnglishDigits(userProfile?.mobile || '');

    if (isMobileChanged) {
      setPendingProfileData({
        ...data,
        mobile: normalizedMobile
      });
      requestOtp(normalizedMobile, {
        onSuccess: () => {
          setShowOtpModal(true);
          setOtpTimer(60);
          setOtpCode(['', '', '', '']);
          setOtpError(null);
        },
        onError: (err: any) => {
          setError('mobile', { type: 'manual', message: err?.message || 'خطا در ارسال کد فعال‌سازی.' });
        }
      });
    } else {
      const finalData = {
        fullName: data.fullName,
        birthDate: `${data.year}/${data.month}/${data.day}`,
        mobile: normalizedMobile,
      };
      updateProfile(finalData, {
        onSuccess: () => {
          success('تغییرات با موفقیت ذخیره شد.');
          navigate('/profile');
        },
        onError: (err: any) => {
          setError('fullName', { type: 'manual', message: err?.message || 'خطا در ذخیره‌سازی اطلاعات.' });
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
      <div className="h-[100dvh] flex flex-col bg-light-gray dark:bg-dark overflow-hidden transition-colors" dir="rtl">
        {/* Sticky Header Wrapper */}
        <div className="px-6 pt-6 pb-2 shrink-0 z-50 bg-light-gray/95 dark:bg-dark/95 backdrop-blur-md transition-colors border-b border-gray-100/50 dark:border-white/5">
          <AppBar 
            title="ویرایش پروفایل"
            subtitle="به‌روزرسانی مشخصات کاربری"
            onBack={() => navigate('/profile')}
            className="mb-0"
          />
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-28 pt-2">
          <form id="edit-profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white dark:bg-black/20 rounded-[32px] p-6 shadow-sm dark:shadow-none border border-gray-50 dark:border-white/5 space-y-6">
              {/* نام و نام خانوادگی */}
              <div className="space-y-2.5">
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
                      onChange={(e) => {
                        field.onChange(e);
                        if (errors.fullName) clearErrors('fullName');
                      }}
                      className={`w-full bg-white dark:bg-black/40 border rounded-2xl py-4 px-6 text-sm font-black text-dark dark:text-white focus:ring-4 text-right outline-none transition-all shadow-sm ${
                        errors.fullName 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
                          : 'border-gray-200/80 dark:border-white/10 focus:border-primary/50 focus:ring-primary/10'
                      }`}
                    />
                  )}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-[10px] font-bold mr-1 mt-1 flex items-center gap-1 animate-pulse">
                    <span>●</span>
                    <span>{errors.fullName.message}</span>
                  </p>
                )}
              </div>

              {/* شماره موبایل */}
              <div className="space-y-2.5">
                <label className="flex flex-row items-center gap-2 text-[11px] font-black text-muted dark:text-white/40 mr-1">
                  <Smartphone size={14} className="text-primary" />
                  <span>شماره موبایل</span>
                  <span className="text-[10px] text-muted/60 dark:text-white/30 mr-auto font-bold">(جهت تغییر، شماره جدید را وارد کنید)</span>
                </label>
                <Controller
                  name="mobile"
                  control={control}
                  render={({ field }) => (
                    <input 
                      {...field}
                      type="tel"
                      className={`w-full bg-white dark:bg-black/40 border rounded-2xl py-4 px-6 text-sm font-black text-dark dark:text-white focus:ring-4 text-left outline-none transition-all shadow-sm font-sans ${
                        errors.mobile 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
                          : 'border-gray-200/80 dark:border-white/10 focus:border-primary/50 focus:ring-primary/10'
                      }`}
                      dir="ltr"
                      onChange={(e) => {
                        const eng = toEnglishDigits(e.target.value);
                        const converted = eng.replace(/\D/g, '');
                        field.onChange(converted);
                        if (errors.mobile) clearErrors('mobile');
                      }}
                    />
                  )}
                />
                {errors.mobile && (
                  <p className="text-red-500 text-[10px] font-bold mr-1 mt-1 flex items-center gap-1 animate-pulse">
                    <span>●</span>
                    <span>{errors.mobile.message}</span>
                  </p>
                )}
              </div>

              {/* تاریخ تولد */}
              <div className="space-y-3">
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
              className={`w-full py-5 rounded-[24px] font-black text-sm flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98] mt-6 ${
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
