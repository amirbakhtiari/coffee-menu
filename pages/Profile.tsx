
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, LogOut, ChevronLeft, History, Crown, Settings2, Moon, Sun, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { requestNotificationPermission, scheduleTestNotification } from '../services/notificationService';
import { useTheme } from '../ThemeContext';
import PageTransition from '../components/PageTransition';
import AppBar from '../components/AppBar';
import GuestProfile from './GuestProfile';
import PhoneLogin from './PhoneLogin';
import OTPVerification from './OTPVerification';
import { useUserProfileApi } from '../hooks/api/useUserApi';
import { useAuthApi } from '../hooks/api/useAuthApi';
import { useNotificationStore } from '../store/useNotificationStore';
import { useCafeStore } from '../store/useCafeStore';

type AuthStep = 'guest' | 'phone' | 'otp';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { warning } = useNotificationStore();
  const { isLoggedIn, setIsLoggedIn } = useCafeStore();
  
  const { profile: userProfile, isLoading: profileLoading } = useUserProfileApi();
  const { requestOtp, isRequestingOtp, verifyOtp, isVerifyingOtp, verifyOtpError } = useAuthApi();

  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  
  const [authStep, setAuthStep] = useState<AuthStep>('guest');
  const [phone, setPhone] = useState('');
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  useEffect(() => {
    let interval: any;
    if (authStep === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [authStep, timer]);

  const handleRequestNotificationPermission = async () => {
    if (isIOS && !isStandalone) {
      warning('در آیفون، نوتیفیکیشن فقط بعد از نصب برنامه فعال می‌شود.');
      return;
    }
    const granted = await requestNotificationPermission();
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission);
    }
  };

  const handleSendCode = (data: { mobile: string }) => {
    setPhone(data.mobile);
    requestOtp(data.mobile, {
      onSuccess: () => {
        setAuthStep('otp');
        setTimer(60);
      }
    });
  };

  const handleVerifyOtp = (data: { code: string }) => {
    console.log('Attempting to verify OTP:', data.code);
    verifyOtp({ mobile: phone, code: data.code }, {
      onSuccess: () => {
        console.log('Login successful, setting isLoggedIn to true');
        setIsLoggedIn(true);
      }
    });
  };

  if (!isLoggedIn) {
    switch (authStep) {
      case 'guest': return <GuestProfile onLoginClick={() => setAuthStep('phone')} />;
      case 'phone': return <PhoneLogin onBack={() => setAuthStep('guest')} onSubmit={handleSendCode} loading={isRequestingOtp} />;
      case 'otp': return <OTPVerification phone={phone} timer={timer} loading={isVerifyingOtp} error={verifyOtpError ? (verifyOtpError as Error).message : null} onBack={() => setAuthStep('phone')} onVerify={handleVerifyOtp} onResend={() => setTimer(60)} />;
    }
  }

  if (profileLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-lightGray dark:bg-dark">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  if (!userProfile) return null;

  return (
    <PageTransition>
      <div className="px-6 pt-12 pb-32 min-h-screen bg-lightGray dark:bg-dark transition-colors" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <AppBar 
            title="پروفایل"
            subtitle="امیر عزیز، خوش آمدی"
            showBack={false}
            rightAction={
              <div className="w-10 h-10 bg-white dark:bg-black/40 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm flex items-center justify-center text-primary relative overflow-hidden">
                <User size={20} />
              </div>
            }
          />

          {/* باشگاه مشتریان */}
          <motion.section 
            onClick={() => navigate('/loyalty')}
            whileTap={{ scale: 0.98 }}
            className={`rounded-[32px] p-6 text-white shadow-2xl relative overflow-hidden transition-all duration-500 cursor-pointer ${
            userProfile.tier === 'gold' ? 'bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-dark shadow-gold/20' :
            userProfile.tier === 'silver' ? 'bg-gradient-to-br from-[#757F9A] to-[#D7DDE8] text-dark shadow-silver/20' :
            'bg-gradient-to-br from-dark to-[#2A2A2A] text-white shadow-black/20'
          }`}>
            <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 ${
              userProfile.tier === 'gold' ? 'bg-white' : 'bg-primary'
            }`}></div>
            
            <div className="relative z-10 text-right">
              <div className="flex flex-row items-center justify-between mb-6">
                <div className="flex flex-row items-center gap-3">
                  <div className={`w-10 h-10 backdrop-blur-md rounded-xl flex items-center justify-center border ${
                    userProfile.tier === 'gold' ? 'bg-dark/10 border-dark/10 text-dark' :
                    userProfile.tier === 'silver' ? 'bg-dark/10 border-dark/10 text-dark' :
                    'bg-primary/20 border-primary/20 text-primary'
                  }`}>
                    <Crown size={20} />
                  </div>
                  <h2 className="font-black text-sm">باشگاه مشتریان</h2>
                </div>
                <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${
                  userProfile.tier === 'gold' ? 'bg-dark text-white' :
                  userProfile.tier === 'silver' ? 'bg-dark text-white' :
                  'bg-primary text-white'
                }`}>
                  {userProfile.tier === 'gold' ? 'سطح طلایی' : 
                   userProfile.tier === 'silver' ? 'سطح نقره‌ای' : 'سطح برنزی'}
                </span>
              </div>

              <div className="flex flex-row justify-between items-end">
                <div>
                  <span className={`text-[10px] font-bold block mb-1 ${
                    userProfile.tier === 'gold' || userProfile.tier === 'silver' ? 'text-dark/60' : 'text-white/60'
                  }`}>امتیاز فعلی شما</span>
                  <span className="text-3xl font-black">
                    {userProfile.points.toLocaleString()} 
                    <span className={`text-xs font-bold mr-1 ${
                      userProfile.tier === 'gold' || userProfile.tier === 'silver' ? 'text-dark/40' : 'text-white/40'
                    }`}>امتیاز</span>
                  </span>
                </div>
                <button className={`backdrop-blur-sm border transition-colors px-4 py-2 rounded-xl text-[10px] font-black ${
                  userProfile.tier === 'gold' ? 'bg-dark/10 border-dark/10 hover:bg-dark/20 text-dark' :
                  userProfile.tier === 'silver' ? 'bg-dark/10 border-dark/10 hover:bg-dark/20 text-dark' :
                  'bg-white/10 border-white/10 hover:bg-white/20 text-white'
                }`}>
                  مشاهده جوایز
                </button>
              </div>
              
              <div className={`mt-6 w-full h-1.5 rounded-full overflow-hidden ${
                userProfile.tier === 'gold' || userProfile.tier === 'silver' ? 'bg-dark/10' : 'bg-white/10'
              }`}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: userProfile.tier === 'gold' ? '100%' : userProfile.tier === 'silver' ? '70%' : '45%' }}
                  className={`h-full ${
                    userProfile.tier === 'gold' ? 'bg-dark' :
                    userProfile.tier === 'silver' ? 'bg-dark' :
                    'bg-primary'
                  }`}
                />
              </div>
              <p className={`text-[9px] mt-2 font-bold ${
                userProfile.tier === 'gold' || userProfile.tier === 'silver' ? 'text-dark/40' : 'text-white/40'
              }`}>
                {userProfile.tier === 'gold' ? 'شما در بالاترین سطح هستید' : 
                 userProfile.tier === 'silver' ? '۳۰۰ امتیاز تا سطح طلایی' : '۵۵۰ امتیاز تا سطح نقره‌ای'}
              </p>
            </div>
          </motion.section>

          {/* اطلاعات پروفایل */}
          <section className="bg-white dark:bg-black/20 rounded-[32px] p-6 shadow-sm border border-gray-50 dark:border-white/5 relative overflow-hidden">
            <div className="flex flex-row items-center justify-between mb-6">
              <div className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-primary">
                  <User size={22} />
                </div>
                <div>
                  <h2 className="font-black text-sm text-dark dark:text-white">اطلاعات شخصی</h2>
                  <p className="text-[9px] text-muted font-bold">مشخصات حساب کاربری شما</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/edit-profile')}
                className="flex flex-row items-center gap-2 px-3 py-2 bg-primary/5 dark:bg-primary/10 text-primary rounded-xl text-[10px] font-black active:scale-95 transition-transform"
              >
                <Settings2 size={14} />
                <span>ویرایش</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-row justify-between items-center py-1">
                <span className="text-[10px] text-muted font-bold">نام و نام خانوادگی</span>
                <span className="text-xs text-dark dark:text-white font-black">{userProfile.fullName}</span>
              </div>
              <div className="flex flex-row justify-between items-center py-1">
                <span className="text-[10px] text-muted font-bold">شماره موبایل</span>
                <span className="text-xs text-dark dark:text-white font-black" dir="ltr">{userProfile.mobile}</span>
              </div>
              <div className="flex flex-row justify-between items-center py-1">
                <span className="text-[10px] text-muted font-bold">تاریخ تولد</span>
                <span className="text-xs text-dark dark:text-white font-black">{userProfile.birthDate}</span>
              </div>
            </div>
          </section>

          {/* تنظیمات ظاهر */}
          <div className="space-y-3">
            <button 
              onClick={toggleTheme}
              className="w-full bg-white dark:bg-black/20 p-5 rounded-[28px] border border-gray-50 dark:border-white/5 flex flex-row items-center justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex flex-row items-center gap-4">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  theme === 'dark' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-indigo-500/10 text-indigo-500'
                }`}>
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </div>
                <div className="text-right">
                  <span className="font-black text-dark dark:text-white text-sm">حالت نمایش</span>
                  <p className="text-[9px] text-muted font-bold">{theme === 'dark' ? 'تاریک' : 'روشن'}</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-gray-100 dark:bg-white/10 rounded-full relative p-1 transition-colors">
                 <motion.div 
                   animate={{ x: theme === 'dark' ? -24 : 0 }}
                   className="w-4 h-4 bg-white dark:bg-primary rounded-full shadow-sm"
                 />
              </div>
            </button>
          </div>

          {/* منو آیتم‌ها */}
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/orders')}
              className="w-full bg-white dark:bg-black/20 p-5 rounded-[28px] border border-gray-50 dark:border-white/5 flex flex-row items-center justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex flex-row items-center gap-4">
                <div className="w-11 h-11 bg-orange-50 dark:bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                  <History size={20} />
                </div>
                <span className="font-black text-dark dark:text-white text-sm">سفارشات من</span>
              </div>
              <ChevronLeft size={20} className="text-gray-200 dark:text-white/10" />
            </button>

            <button 
              onClick={handleRequestNotificationPermission}
              className="w-full bg-white dark:bg-black/20 p-5 rounded-[28px] border border-gray-50 dark:border-white/5 flex flex-row items-center justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex flex-row items-center gap-4">
                <div className="w-11 h-11 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                  <Bell size={20} />
                </div>
                <span className="font-black text-dark dark:text-white text-sm">اعلان‌های سیستم</span>
              </div>
              <span className="text-[10px] font-black text-primary">{permission === 'granted' ? 'فعال' : 'غیرفعال'}</span>
            </button>

            <button 
              onClick={() => { setIsLoggedIn(false); setAuthStep('guest'); setPhone(''); }}
              className="w-full bg-white dark:bg-black/20 p-5 rounded-[28px] border border-gray-50 dark:border-white/5 flex flex-row items-center justify-between group active:scale-[0.98] transition-all hover:bg-red-50/20"
            >
              <div className="flex flex-row items-center gap-4">
                <div className="w-11 h-11 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                  <LogOut size={20} />
                </div>
                <span className="font-black text-dark dark:text-white text-sm">خروج از حساب</span>
              </div>
              <ChevronLeft size={20} className="text-red-200 dark:text-red-500/20" />
            </button>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Profile;
