import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Users, 
  MapPin, 
  CalendarClock, 
  CheckCircle2, 
  XCircle, 
  Sparkle, 
  CircleDot, 
  Coffee, 
  RefreshCw,
  Loader2,
  AlertCircle,
  FileText,
  Phone,
  KeyRound,
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  Check,
  ChevronDown
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import AppBar from '../components/AppBar';
import { BookingConfirmModal } from '../components/BookingConfirmModal';
import { useNotificationStore } from '../store/useNotificationStore';
import { useTables, useToggleTable, useResetTables } from '../hooks/api/useTablesApi';
import { Table } from '../types';


const toEnglishDigits = (str: string): string => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
  return str.split('').map(char => {
    const pIdx = persianDigits.indexOf(char);
    if (pIdx > -1) return String(pIdx);
    const aIdx = arabicDigits.indexOf(char);
    if (aIdx > -1) return String(aIdx);
    return char;
  }).join('');
};

const TableBlueprint: React.FC<{ capacity: number; isReserved: boolean; zone: any }> = ({ capacity, isReserved, zone }) => {
  const isVip = zone === 'بخش VIP';
  
  const renderChairs = () => {
    const chairs = [];
    const radius = 21;
    const count = Math.min(Math.max(capacity, 2), 8);
    
    // Color config
    const cushionClass = isReserved
      ? 'fill-rose-200/60 dark:fill-rose-950/40 text-rose-400/80 dark:text-rose-700/80'
      : isVip
        ? 'fill-amber-150 dark:fill-amber-950/40 text-amber-500 dark:text-amber-400'
        : 'fill-emerald-200/50 dark:fill-emerald-950/40 text-emerald-400 dark:text-emerald-500';

    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count;
      const cx = 35 + radius * Math.cos(angle);
      const cy = 35 + radius * Math.sin(angle);
      const angleDeg = (angle * 180) / Math.PI;
      
      chairs.push(
        <g 
          key={i} 
          transform={`translate(${cx}, ${cy}) rotate(${angleDeg + 90})`}
          className={`${isReserved ? 'text-rose-300 dark:text-rose-800' : isVip ? 'text-amber-400 dark:text-amber-500' : 'text-emerald-400 dark:text-emerald-500'}`}
        >
          {/* Chair Seat Cushion */}
          <rect
            x="-4.5"
            y="-3.5"
            width="9"
            height="7"
            rx="1.5"
            className={cushionClass}
          />
          {/* Chair Backrest Arc */}
          <path
            d="M -5 -3 Q 0 -6.5 5 -3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
      );
    }
    return chairs;
  };

  const centerColor = isReserved
    ? 'text-rose-400/20 dark:text-rose-500/10 stroke-rose-300 dark:stroke-rose-800'
    : isVip
      ? 'text-amber-400/10 dark:text-amber-500/10 stroke-amber-300 dark:stroke-amber-700/80'
      : 'text-emerald-400/10 dark:text-emerald-500/15 stroke-emerald-300 dark:stroke-emerald-700/80';

  const innerPlateColor = isReserved
    ? 'fill-rose-100/30 dark:fill-rose-950/20'
    : isVip
      ? 'fill-amber-100/30 dark:fill-amber-950/20'
      : 'fill-emerald-100/30 dark:fill-emerald-950/20';

  return (
    <div className={`w-15 h-15 relative flex items-center justify-center rounded-2xl border transition-all duration-350 shrink-0 ${
      isReserved 
        ? 'bg-rose-500/5 border-rose-100/40 dark:border-rose-950/25' 
        : isVip
          ? 'bg-amber-500/5 border-amber-100/40 dark:border-amber-950/25'
          : 'bg-emerald-500/5 border-emerald-100/40 dark:border-emerald-950/25'
    }`}>
      <svg className="w-[62px] h-[62px]" viewBox="0 0 70 70">
        {renderChairs()}
        
        {/* Main Table top-view */}
        <circle
          cx="35"
          cy="35"
          r="14"
          className={`transition-all duration-500 fill-current ${centerColor}`}
          strokeWidth="1.2"
        />
        
        {/* Table Inner plate decoration */}
        <circle
          cx="35"
          cy="35"
          r="8.5"
          className={`transition-all duration-500 ${innerPlateColor}`}
        />

        {/* Cafe Cup of Coffee top-view (cute touch!) */}
        <g 
          className={`transition-all duration-500 ${isReserved ? 'text-rose-300/60 dark:text-rose-700/60' : isVip ? 'text-amber-500/70 dark:text-amber-400/60' : 'text-emerald-500/70 dark:text-emerald-400/60'}`}
          transform="translate(35, 35) rotate(-45)"
        >
          {/* Coffee liquid */}
          <circle
            cx="0"
            cy="0"
            r="3"
            fill="currentColor"
            opacity="0.2"
          />
          {/* Cup Rim */}
          <circle
            cx="0"
            cy="0"
            r="3.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
          />
          {/* Cup Handle */}
          <path
            d="M 3.2 -1 Q 4.7 0 3.2 1"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};

export const Tables: React.FC = () => {
  const navigate = useNavigate();
  const { success, info, error: notifyError } = useNotificationStore();

  // React Query Hooks
  const { data: tables = [], isLoading, isError, error, refetch } = useTables();
  const toggleTableMutation = useToggleTable();
  const resetTablesMutation = useResetTables();

  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'reserved' | 'vip'>('all');
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);

  const shamsiDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
      const value = d.toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' });
      const weekday = d.toLocaleDateString('fa-IR', { weekday: 'long' });
      const dayNum = d.toLocaleDateString('fa-IR', { day: 'numeric' });
      const month = d.toLocaleDateString('fa-IR', { month: 'long' });
      
      let label = weekday;
      if (i === 0) label = 'امروز';
      else if (i === 1) label = 'فردا';
      
      dates.push({ value, label, dayNum, month, weekday });
    }
    return dates;
  }, []);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Booking Flow Steps:
  // 'details' -> 'rules' -> 'schedule' -> 'phone' -> 'otp' -> 'deposit'
  const [bookingStep, setBookingStep] = useState<'details' | 'rules' | 'schedule' | 'phone' | 'otp' | 'deposit'>('details');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(59);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [reserveDate, setReserveDate] = useState(shamsiDates[0].value);
  const [reserveTime, setReserveTime] = useState('۱۷:۰۰');
  const [reservePurpose, setReservePurpose] = useState<'birthday' | 'meeting' | 'gathering' | 'other'>('gathering');
  const [timeSlot, setTimeSlot] = useState<'morning' | 'afternoon' | 'evening'>('evening');
  const [isPurposeDropdownOpen, setIsPurposeDropdownOpen] = useState(false);

  // Notify when available state for busy tables
  const [notifyPhone, setNotifyPhone] = useState('');
  const [isNotifyRequested, setIsNotifyRequested] = useState(false);
  const [notifyPhoneSubmitAttempted, setNotifyPhoneSubmitAttempted] = useState(false);

  // Derive selected table from the live Query data
  const selectedTable = tables.find(t => t.id === selectedTableId) || null;

  // Track active steps & reset states on table selection changes
  useEffect(() => {
    setBookingStep('details');
    setMobileNumber('');
    setOtpCode('');
    setOtpTimer(59);
    setRulesAccepted(false);
    setReserveDate(shamsiDates[0].value);
    setReserveTime('۱۷:۰۰');
    setReservePurpose('gathering');
    setTimeSlot('evening');
    setIsPurposeDropdownOpen(false);
    setNotifyPhone('');
    setIsNotifyRequested(false);
    setNotifyPhoneSubmitAttempted(false);
  }, [selectedTableId, shamsiDates]);

  // Handle click outside of the purpose dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPurposeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle OTP request countdown simulation
  useEffect(() => {
    let interval: any;
    if (bookingStep === 'otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [bookingStep, otpTimer]);

  const handleToggleReserve = async (tableId: number) => {
    try {
      const tableToToggle = tables.find(t => t.id === tableId);
      if (!tableToToggle) return;

      const nextReservedState = !tableToToggle.isReserved;
      
      await toggleTableMutation.mutateAsync(tableId);
      
      if (nextReservedState) {
        success(`میز ${tableToToggle.number} با موفقیت رزرو شد`);
      } else {
        info(`میز ${tableToToggle.number} آزاد شد`);
      }
      setSelectedTableId(null);
    } catch (err: any) {
      notifyError(err?.message || 'خطایی در تغییر وضعیت میز رخ داد');
    }
  };

  const handleResetTables = async () => {
    try {
      await resetTablesMutation.mutateAsync();
      success('وضعیت تمامی میزها به حالت اول برگشت');
    } catch (err: any) {
      notifyError('خطایی در بازنشانی اطلاعات رخ داد');
    }
  };

  // Derive normalized clean phone number and check validation
  const cleanMobile = toEnglishDigits(mobileNumber).replace(/\D/g, '');
  const normalizedMobile = cleanMobile.startsWith('98') && cleanMobile.length === 12
    ? '0' + cleanMobile.substring(2)
    : cleanMobile.startsWith('0098') && cleanMobile.length === 14
      ? '0' + cleanMobile.substring(4)
      : cleanMobile.length === 10 && cleanMobile.startsWith('9')
        ? '0' + cleanMobile
        : cleanMobile;
  const isPhoneValid = /^09\d{9}$/.test(normalizedMobile);

  // Stats calculate
  const totalCount = tables.length;
  const reservedCount = tables.filter(t => t.isReserved).length;
  const freeCount = totalCount - reservedCount;

  // Filter logic
  const filteredTables = tables.filter(t => {
    if (activeFilter === 'free') return !t.isReserved;
    if (activeFilter === 'reserved') return t.isReserved;
    if (activeFilter === 'vip') return t.zone === 'بخش VIP';
    return true;
  });

  // Verification SMS triggers
  const sendVerificationSms = () => {
    // Convert to English digits first
    const convertedDigits = toEnglishDigits(mobileNumber);
    // Remove all non-digit characters (including spaces, brackets, plus signs, dashes)
    let cleanPhone = convertedDigits.replace(/\D/g, '');

    // Common Iranian mobile number normalizations:
    // 1. If starting with International country code (e.g. 989123456789 or 00989123456789)
    if (cleanPhone.startsWith('98') && cleanPhone.length === 12) {
      cleanPhone = '0' + cleanPhone.substring(2);
    } else if (cleanPhone.startsWith('0098') && cleanPhone.length === 14) {
      cleanPhone = '0' + cleanPhone.substring(4);
    } 
    // 2. If user omitted the leading zero (e.g. 9123456789 instead of 09123456789)
    else if (cleanPhone.length === 10 && cleanPhone.startsWith('9')) {
      cleanPhone = '0' + cleanPhone;
    }

    // Now validate against the standard /^09\d{9}$/ (11-digit Iranian mobile starting with 09)
    const isPhoneValid = /^09\d{9}$/.test(cleanPhone);
    if (!isPhoneValid) {
      notifyError(`شماره وارد شده (${mobileNumber}) معتبر نیست. لطفا یک شماره معتبر مانند ۰۹۱۲۳۴۵۶۷۸۹ وارد کنید.`);
      return;
    }

    setMobileNumber(cleanPhone); // Save the clean normalized number
    setOtpTimer(59);
    setBookingStep('otp');
    success('کد فعال‌سازی آزمایشی (۱۲۳۴) برای شما ارسال گردید');
  };

  const confirmVerificationCode = () => {
    if (otpCode !== '1234') {
      notifyError('کد فعال‌سازی نامعتبر است. کد آزمایشی ۱۲۳۴ می‌باشد.');
      return;
    }
    setBookingStep('deposit');
    success('شماره همراه شما تایید شد');
  };

  const handleRegisterNotification = () => {
    if (!selectedTable) return;
    setNotifyPhoneSubmitAttempted(true);

    if (!notifyPhone || notifyPhone.trim() === '') {
      return;
    }

    const convertedDigits = toEnglishDigits(notifyPhone);
    let cleanPhone = convertedDigits.replace(/\D/g, '');

    if (cleanPhone.startsWith('98') && cleanPhone.length === 12) {
      cleanPhone = '0' + cleanPhone.substring(2);
    } else if (cleanPhone.startsWith('0098') && cleanPhone.length === 14) {
      cleanPhone = '0' + cleanPhone.substring(4);
    } else if (cleanPhone.length === 10 && cleanPhone.startsWith('9')) {
      cleanPhone = '0' + cleanPhone;
    }

    const isPhoneValid = /^09\d{9}$/.test(cleanPhone);
    if (!isPhoneValid) {
      return;
    }

    setNotifyPhone(cleanPhone);
    setIsNotifyRequested(true);
  };

  const handleIntegratePaymentRedirect = () => {
    if (!selectedTable) return;
    
    let purpText = 'دورهمی دوستانه';
    if (reservePurpose === 'birthday') purpText = 'جشن تولد';
    if (reservePurpose === 'meeting') purpText = 'جلسه کاری و تولید';
    if (reservePurpose === 'other') purpText = 'تفریح و گپ';

    // Redirect to simulated gateway path
    navigate(`/gateway-transition?type=table&tableId=${selectedTable.id}&phone=${mobileNumber}&date=${encodeURIComponent(reserveDate)}&time=${encodeURIComponent(reserveTime)}&purpose=${encodeURIComponent(purpText)}`);
  };

  return (
    <PageTransition>
      <div className="px-5 pb-8 min-h-screen bg-light-gray dark:bg-dark text-dark dark:text-white flex flex-col transition-colors" dir="rtl">
        {/* Top Sticky Header */}
        <div className="pt-6 pb-3 -mx-5 px-5 bg-white/95 dark:bg-dark/95 backdrop-blur-md sticky top-0 z-40 transition-colors border-b border-gray-100 dark:border-white/5 shadow-sm">
          <AppBar 
            title="وضعیت میزها"
            subtitle="سرویس‌دهی و رزرو آنلاین میزهای کافه"
            onBack={() => navigate('/')}
            className="mb-0"
            rightAction={
              <button 
                id="reset-tables"
                disabled={resetTablesMutation.isPending || isLoading}
                onClick={handleResetTables} 
                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/10 text-gray-500 dark:text-gray-400 rounded-xl border border-gray-100 dark:border-white/5 active:rotate-180 transition-all duration-500 shadow-sm disabled:opacity-50 cursor-pointer"
                title="بازنشانی جدول‌ها"
              >
                {resetTablesMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin text-primary" />
                ) : (
                  <RefreshCw size={16} />
                )}
              </button>
            }
          />
        </div>

        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="space-y-4 flex-1 mt-4">
            {/* Bento placeholder */}
            <div className="bg-white dark:bg-black/25 rounded-3xl p-5 border border-gray-100 dark:border-white/5 h-36 animate-pulse" />
            {/* Filter scrollbar placeholder */}
            <div className="flex gap-2 pb-2 overflow-hidden">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-9 w-24 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 animate-pulse shrink-0" />
              ))}
            </div>
            {/* Grid layout placeholder */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="bg-white dark:bg-black/20 rounded-[28px] p-4 border border-gray-100 dark:border-white/5 h-[135px] animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {/* Error State View */}
        {isError && !isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-4">
            <div className="p-4 bg-red-500/10 text-red-500 rounded-full">
              <AlertCircle size={32} />
            </div>
            <div>
              <h3 className="text-sm font-black text-dark dark:text-white">خطا در بروزرسانی اطلاعات از سرور</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 max-w-[260px] mx-auto leading-relaxed">
                {error?.message || 'مشکلی در اتصال به سیستم مرکزی کافه پیش آمده است.'}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-5 py-2.5 bg-primary text-white text-xs font-black rounded-xl active:scale-95 transition-all shadow-md shadow-primary/20"
            >
              تلاش مجدد اتصال
            </button>
          </div>
        )}

        {/* Real Dynamic UI content */}
        {!isLoading && !isError && (
          <>
            {/* Bento Dynamic Dashboard Stats Panel */}
            <div className="mt-4 bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-[32px] p-5 shadow-xl shadow-gray-100/30 dark:shadow-none relative overflow-hidden transition-all duration-300">
              {/* Soft glowing ambient light */}
              <div className="absolute top-0 left-0 w-36 h-36 bg-gradient-to-tr from-primary/10 to-emerald-500/5 dark:from-primary/10 dark:to-transparent rounded-full -translate-x-12 -translate-y-12 blur-3xl pointer-events-none" />
              
              {/* Live Signal Line header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/[0.06] mb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-black text-dark dark:text-white">وضعیت زنده سالن کافه</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-gray-400 dark:text-white/40 font-bold bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded-lg border border-gray-100 dark:border-white/5">
                  <Sparkle size={10} className="text-primary" />
                  <span>بروزرسانی خودکار</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-5 relative z-10">
                {/* Visual statistics grid / 3 Bento Pillars */}
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <div className="bg-gray-50/60 dark:bg-white/[0.012] border border-gray-100/70 dark:border-white/[0.04] p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-colors">
                    <span className="text-[9px] font-bold text-gray-400 dark:text-white/35 mb-1">کل میزها</span>
                    <span className="text-lg font-black text-dark dark:text-white font-mono leading-none">{totalCount}</span>
                    <span className="text-[7.5px] font-bold text-gray-400/80 mr-0.5 mt-1">میز</span>
                  </div>

                  <div className="bg-emerald-50/30 dark:bg-emerald-500/[0.02] border border-emerald-100/40 dark:border-emerald-500/10 p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-colors">
                    <span className="text-[9px] font-bold text-emerald-600/80 dark:text-emerald-400/70 mb-1">آزاد</span>
                    <span className="text-lg font-black text-emerald-555 dark:text-emerald-400 font-mono leading-none">{freeCount}</span>
                    <span className="text-[7.5px] font-bold text-emerald-500/80 mr-0.5 mt-1"> آماده</span>
                  </div>

                  <div className="bg-rose-50/30 dark:bg-rose-500/[0.02] border border-rose-100/40 dark:border-rose-500/10 p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-colors">
                    <span className="text-[9px] font-bold text-rose-600/80 dark:text-rose-400/70 mb-1">سرویس‌دهی</span>
                    <span className="text-lg font-black text-rose-500 dark:text-rose-400 font-mono leading-none">{reservedCount}</span>
                    <span className="text-[7.5px] font-bold text-rose-500/80 mr-0.5 mt-1">مشغول</span>
                  </div>
                </div>

                {/* Progress Wheel Gauge - redesigned with modern futuristic colors and elegant rings */}
                <div className="relative flex items-center justify-center shrink-0 w-22 h-22">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background track circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-gray-100 dark:stroke-white/[0.05]"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    {/* Foreground progress circle with dynamic colors */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - Math.min(Math.max(totalCount > 0 ? reservedCount / totalCount : 0, 0), 1))}
                      strokeLinecap="round"
                      className={`transition-all duration-700 ease-out ${
                        (reservedCount / (totalCount || 1)) > 0.8
                          ? 'stroke-rose-500' 
                          : 'stroke-primary'
                      }`}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-sm font-black font-mono leading-none text-dark dark:text-white">
                      {totalCount > 0 ? Math.round((reservedCount / totalCount) * 100) : 0}%
                    </span>
                    <span className="text-[8px] font-extrabold text-gray-400 dark:text-white/40 mt-1">تکمیل</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Smooth Filter Scrollbar */}
            <div className="mt-5 flex gap-1.5 pb-2 overflow-x-auto no-scrollbar -mx-5 px-5 overscroll-x-contain">
              {[
                { id: 'all', label: 'همه میزها', icon: Coffee },
                { id: 'free', label: 'آزاد و آماده', icon: CheckCircle2 },
                { id: 'reserved', label: 'رزرو یا تکمیل', icon: XCircle },
                { id: 'vip', label: 'بخش VIP', icon: Sparkle },
              ].map(filter => {
                const Icon = filter.icon;
                const isActive = activeFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id as any)}
                    className={`py-2 px-3.5 rounded-2xl flex items-center gap-1.5 text-[11px] font-black whitespace-nowrap border transition-all duration-300 ${
                      isActive 
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                        : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-300'
                    }`}
                  >
                    <Icon size={12} strokeWidth={2.5} />
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Elegant Grid List of Tables */}
            <div className="mt-3 flex-1">
              <motion.div 
                layout
                className="grid grid-cols-2 gap-3.5"
              >
                <AnimatePresence mode="popLayout">
                  {filteredTables.map(table => {
                    const isTableMutating = toggleTableMutation.isPending && toggleTableMutation.variables === table.id;
                    const isVip = table.zone === 'بخش VIP';
                    
                    return (
                      <motion.div
                        key={table.id}
                        layoutId={`table-card-${table.id}`}
                        onClick={() => setSelectedTableId(table.id)}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: isTableMutating ? 0.75 : 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 280 }}
                        className={`bg-white dark:bg-white/[0.02] rounded-[30px] p-4 border cursor-pointer select-none transition-all duration-300 flex flex-col justify-between min-h-[160px] relative overflow-hidden group ${
                          table.isReserved 
                            ? 'border-rose-100/70 dark:border-rose-950/25 hover:border-rose-300/60 dark:hover:border-rose-800/40 hover:shadow-lg hover:shadow-rose-500/[0.02]' 
                            : isVip
                              ? 'border-amber-100/70 dark:border-amber-950/25 hover:border-amber-300/60 dark:hover:border-amber-800/40 hover:shadow-lg hover:shadow-amber-500/[0.02]'
                              : 'border-emerald-100/70 dark:border-emerald-950/25 hover:border-emerald-300/60 dark:hover:border-emerald-800/40 hover:shadow-lg hover:shadow-emerald-500/[0.02]'
                        }`}
                      >
                        {/* Soft glowing ambient circle behind table card */}
                        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full filter blur-2xl opacity-[0.04] transition-all translate-x-4 -translate-y-4 pointer-events-none ${
                          table.isReserved 
                            ? 'bg-rose-500' 
                            : isVip
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                        }`} />

                        {/* Top Header of Card */}
                        <div className="flex items-center justify-between z-10 mb-2">
                          <span className={`text-[9.5px] font-black tracking-wide px-2 py-0.5 rounded-lg ${
                            isVip
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/40'
                          }`}>
                            {isVip ? '✨ VIP' : table.zone}
                          </span>
                          
                          {isTableMutating ? (
                            <span className="inline-flex items-center text-primary animate-spin">
                              <Loader2 size={11} />
                            </span>
                          ) : (
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xl text-[9px] font-black ${
                              table.isReserved 
                                ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400' 
                                : 'bg-emerald-500/10 text-emerald-555 dark:text-emerald-400'
                            }`}>
                              <CircleDot size={7} className={`fill-current ${table.isReserved ? 'text-rose-500' : 'text-emerald-400 animate-pulse'}`} />
                              {table.isReserved ? 'رزرو' : 'آزاد'}
                            </span>
                          )}
                        </div>

                        {/* Middle Content: Big number and visual Table top-view */}
                        <div className="flex items-center justify-between gap-2 z-10 my-1">
                          <div className="flex flex-col">
                            <span className="text-[9.5px] text-gray-400 dark:text-white/30 font-bold">شماره میز</span>
                            <div className="flex items-baseline gap-0.5">
                              <span className="text-3xl font-black font-mono text-dark dark:text-white leading-none">
                                {table.number}
                              </span>
                            </div>
                          </div>
                          
                          {/* Live architectural layout view of the specific table based on capacity */}
                          <TableBlueprint capacity={table.capacity} isReserved={table.isReserved} zone={table.zone} />
                        </div>

                        {/* Card Footer: Capacity and state detail */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5 text-[10px] font-medium z-10 mt-1">
                          <span className="flex items-center gap-1 font-extrabold text-[#374151] dark:text-[#E4E4E7]">
                            <Users size={11} className="opacity-70 text-gray-400 dark:text-white/40" />
                            {table.capacity} نفره
                          </span>
                          
                          {table.isReserved ? (
                            <span className="text-rose-500 dark:text-rose-400 font-extrabold text-[9px] bg-rose-500/5 px-2 py-0.5 rounded-md">
                              {table.reservedBy === 'شما (منوی هوشمند)' || table.reservedBy?.includes?.('شما') ? 'میز شما' : 'رزرو شده'}
                            </span>
                          ) : (
                            <span className="text-emerald-500 dark:text-emerald-400 font-extrabold text-[9px] bg-emerald-500/5 px-1.5 py-0.5 rounded-md">
                              آماده سرویس
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>

              {filteredTables.length === 0 && (
                <div className="text-center py-16 text-muted italic text-sm">میزی در این دسته‌بندی یافت نشد.</div>
              )}
            </div>

            {/* Interactive Custom Booking Flow Modal / Drawer */}
            <AnimatePresence>
              {selectedTable && (
                <div className="fixed inset-0 z-50 flex items-end justify-center">
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedTableId(null)}
                    className="absolute inset-0 bg-black/85 backdrop-blur-sm"
                  />

                  {/* Drawer Content */}
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                    className="relative bg-white dark:bg-[#121214] rounded-t-[42px] w-full max-w-sm p-6 border-t border-gray-100 dark:border-white/10 shadow-2xl z-10 select-none pb-8 max-h-[92vh] flex flex-col"
                  >
                    {/* Visual Puller Accent */}
                    <div className="w-12 h-1 bg-gray-200 dark:bg-white/10 rounded-full mx-auto mb-6 shrink-0 cursor-pointer" onClick={() => setSelectedTableId(null)} />

                    {/* Step-by-Step wizard container */}
                    <div className="overflow-y-auto no-scrollbar flex-1 pr-0.5">
                      
                      {/* DEDICATED VIEW FOR RESERVED/BUSY TABLES */}
                      {selectedTable.isReserved && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-5"
                        >
                          {/* Title Header */}
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] px-3 py-1 rounded-full font-black mb-1.5 inline-block">
                                {selectedTable.zone} • غیرفعال
                              </span>
                              <h3 className="text-xl font-black text-dark dark:text-white leading-none">
                                میز شماره {selectedTable.number}
                              </h3>
                            </div>

                            <div className="px-3 py-1 text-[10px] font-black rounded-xl border bg-rose-50/50 border-rose-200/40 text-rose-600 dark:text-rose-400 dark:bg-rose-950/20">
                              <span>رزرو شده / مشغول</span>
                            </div>
                          </div>



                          {/* Notify Box/Form */}
                          {!isNotifyRequested ? (
                            <div className="space-y-4">
                              <div className="bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-3xl p-4.5 flex gap-3 text-right">
                                <span className="text-xl shrink-0">🔔</span>
                                <div className="space-y-1">
                                  <h4 className="text-xs font-black text-primary dark:text-[#E89C6A]">خبردار شدن از خالی شدن میز</h4>
                                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                                    این میز در حال حاضر مشغول پذیرایی است. با وارد کردن شماره همراه خود، بلافاصله پس از خالی و آزاد شدن میز، پیامک اطلاع‌رسانی خودکار برای شما ارسال خواهد شد.
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-[11px] font-black text-gray-500 dark:text-gray-400">شماره موبایل:</span>
                                </div>

                                <div className="relative">
                                  {(() => {
                                    const convertedDigits = toEnglishDigits(notifyPhone);
                                    let cleanPhone = convertedDigits.replace(/\D/g, '');
                                    if (cleanPhone.startsWith('98') && cleanPhone.length === 12) {
                                      cleanPhone = '0' + cleanPhone.substring(2);
                                    } else if (cleanPhone.startsWith('0098') && cleanPhone.length === 14) {
                                      cleanPhone = '0' + cleanPhone.substring(4);
                                    } else if (cleanPhone.length === 10 && cleanPhone.startsWith('9')) {
                                      cleanPhone = '0' + cleanPhone;
                                    }

                                    const isPhoneValid = /^09\d{9}$/.test(cleanPhone);
                                    const hasError = notifyPhoneSubmitAttempted && (notifyPhone.trim() === '' || !isPhoneValid);

                                    return (
                                      <>
                                        <input
                                          type="tel"
                                          maxLength={11}
                                          value={notifyPhone}
                                          onChange={(e) => {
                                            const converted = toEnglishDigits(e.target.value);
                                            const filtered = converted.replace(/[^0-9]/g, '');
                                            setNotifyPhone(filtered);
                                            setNotifyPhoneSubmitAttempted(false);
                                          }}
                                          placeholder="مثلاً ۰۹۱۲۳۴۵۶۷۸۹"
                                          className={`w-full py-4 text-center font-mono text-[17px] tracking-widest bg-gray-50 dark:bg-white/[0.03] border rounded-2xl text-dark dark:text-white focus:outline-none focus:ring-4 transition-all ${
                                            hasError
                                              ? 'border-rose-500 dark:border-rose-800 focus:border-rose-500 focus:ring-rose-500/10 bg-rose-500/[0.01]'
                                              : isPhoneValid
                                                ? 'border-emerald-500/40 dark:border-emerald-500/40 focus:border-emerald-500 focus:ring-emerald-500/10 bg-emerald-500/[0.01]'
                                                : 'border-gray-100 dark:border-white/5 focus:border-primary/50 focus:ring-primary/10'
                                          }`}
                                        />
                                        {hasError && (
                                          <p className="text-rose-500 text-[11px] font-bold text-center mt-1 animate-pulse">
                                            {notifyPhone.trim() === ''
                                              ? 'لطفاً شماره همراه خود را وارد کنید.'
                                              : 'شماره موبایل وارد شده معتبر نیست. نمونه معتبر: ۰۹۱۲۳۴۵۶۷۸۹'}
                                          </p>
                                        )}
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>

                              <button
                                onClick={handleRegisterNotification}
                                className="w-full py-4 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 text-[12px] font-black cursor-pointer flex items-center justify-center gap-2 hover:bg-primary-dark active:scale-[0.98] transition-all"
                              >
                                🔔 ثبت درخواست اطلاع‌رسانی پیامکی
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-4 text-center py-6">
                              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                                <Check size={28} strokeWidth={3} />
                              </div>
                              <div className="space-y-2">
                                <h4 className="text-sm font-black text-emerald-600 dark:text-emerald-400">درخواست اطلاع‌رسانی ثبت شد</h4>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold max-w-[260px] mx-auto">
                                  به محض آزاد شدن میز شماره <span className="font-extrabold text-dark dark:text-white font-mono">#{selectedTable.number}</span>، پیامک اطلاع‌رسانی فوری برای شماره <span className="font-bold text-dark dark:text-white font-mono">{notifyPhone}</span> ارسال می‌گردد.
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Action area */}
                          <div className="space-y-3 pt-2">
                            <button
                              onClick={() => setSelectedTableId(null)}
                              className="w-full py-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-750 dark:text-gray-300 text-[11px] font-bold rounded-2xl active:scale-[0.98] transition-all"
                            >
                              بستن پنجره
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* STEP: Details */}
                      {!selectedTable.isReserved && bookingStep === 'details' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-5"
                        >
                          {/* Title Header */}
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] px-3 py-1 rounded-full font-black mb-1.5 inline-block">
                                {selectedTable.zone} • فعال
                              </span>
                              <h3 className="text-xl font-black text-dark dark:text-white leading-none">
                                میز شماره {selectedTable.number}
                              </h3>
                            </div>

                            <div className="px-3 py-1 text-[10px] font-black rounded-xl border bg-emerald-50/50 border-emerald-200/40 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-950/20">
                              <span>آزاد و آماده سفارش</span>
                            </div>
                          </div>

                          {/* Stats parameters card */}
                          <div className="bg-gray-50 dark:bg-white/[0.03] rounded-3xl p-4 space-y-3.5 border border-gray-100/60 dark:border-white/5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <Users size={14} className="opacity-60" /> ظرفیت پذیرایی:
                              </span>
                              <span className="font-black text-dark dark:text-white">{selectedTable.capacity} نفر بزرگسال</span>
                            </div>

                            <div className="flex items-start justify-between text-xs pt-2 border-t border-gray-100 dark:border-white/5">
                              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2 shrink-0 mt-0.5">
                                <MapPin size={14} className="opacity-60" /> ویژگی‌های موقعیت:
                              </span>
                              <div className="flex gap-1.5 flex-wrap justify-end max-w-[200px]">
                                {selectedTable.features.map((feat, i) => (
                                  <span key={i} className="bg-gray-100/70 dark:bg-white/5 px-2 py-0.5 rounded-lg text-[9px] text-[#4B5563] dark:text-[#D1D5DB] font-bold">{feat}</span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Action area */}
                          <div className="space-y-3 pt-2">
                            <button
                              onClick={() => setBookingStep('rules')}
                              className="w-full py-4 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 text-[12px] font-black cursor-pointer flex items-center justify-center gap-2 hover:bg-primary-dark active:scale-[0.98] transition-all focus:outline-none"
                            >
                              <span>شروع فرآیند ثبت رزرو موقت</span>
                            </button>

                            <button
                              onClick={() => setSelectedTableId(null)}
                              className="w-full py-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-750 dark:text-gray-300 text-[11px] font-bold rounded-2xl active:scale-[0.98] transition-all focus:outline-none"
                            >
                              انصراف و بستن
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* STEP: Rules and Policies */}
                      {!selectedTable.isReserved && bookingStep === 'rules' && (
                        <motion.div
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-5"
                        >
                          <div className="text-center space-y-2 mb-1">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                              <FileText size={22} />
                            </div>
                            <h3 className="text-base font-black text-dark dark:text-white">قوانین و شرایط رزرو موقت</h3>
                            <p className="text-[10px] text-gray-400">لطفاً پیش از ثبت رزرو، ضوابط زیر را به دقت تایید نمایند</p>
                          </div>

                          <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-3xl p-4.5 space-y-4 max-h-[220px] overflow-y-auto pr-1 text-[11px] text-gray-650 dark:text-gray-300 leading-relaxed font-medium">
                            <div className="flex gap-2.5 items-start">
                              <span className="text-primary font-black shrink-0 mt-0.5">💳</span>
                              <p><strong>پرداخت وجه:</strong> جهت رزرو موقت، پرداخت آنلاین هزینه رزرو اولیه الزامی است.</p>
                            </div>
                            <div className="flex gap-2.5 items-start pt-2 border-t border-gray-100/30">
                              <span className="text-primary font-black shrink-0 mt-0.5">⏳</span>
                              <p><strong>مدت نگه داشتن میز:</strong> پس از ثبت نهایی رزرو، میز تا حداکثر <span className="text-primary font-bold">۱ ساعت</span> در وضعیت رزرو باقی می‌ماند تا در کافه حضور یابید.</p>
                            </div>
                            <div className="flex gap-2.5 items-start pt-2 border-t border-gray-100/30">
                              <span className="text-primary font-black shrink-0 mt-0.5">🔔</span>
                              <p><strong>اطلاع‌رسانی پیامکی:</strong> دقیقاً <span className="text-primary font-bold">۲۰ دقیقه پیش از حضور</span> شما در کافه، پیامک یادآوری جهت آمادگی ارسال می‌شود.</p>
                            </div>
                            <div className="flex gap-2.5 items-start pt-2 border-t border-gray-100/30">
                              <span className="text-[#EF4444] font-black shrink-0 mt-0.5">⚠️</span>
                              <p><strong>لغو خودکار بعد از ۱۰ دقیقه:</strong> در صورت عدم حضور به موقع در کافه، <span className="text-rose-500 font-bold">۱۰ دقیقه پس از زمان مقرر رزرو</span>، میز به طور خودکار آزاد شده و به حالت قبل بازمی‌گردد.</p>
                            </div>
                          </div>

                          {/* Checkbox template to accept rules */}
                          <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/[0.02] border border-gray-100/50 dark:border-white/5 rounded-2xl cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={rulesAccepted}
                              onChange={(e) => setRulesAccepted(e.target.checked)}
                              className="w-4.5 h-4.5 rounded border-gray-305 text-primary focus:ring-primary focus:ring-2 dark:bg-white/5 dark:border-white/10"
                            />
                            <span className="text-[11px] font-black text-gray-700 dark:text-gray-300">
                              تمامی قوانین و شرایط فوق را خوانده و می‌پذیرم
                            </span>
                          </label>

                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={() => setBookingStep('details')}
                              className="flex-1 py-3.5 bg-gray-100 dark:bg-white/10 text-gray-650 dark:text-gray-300 text-[11px] font-bold rounded-2xl active:scale-95 transition-all text-center focus:outline-none"
                            >
                              مرحله قبل
                            </button>
                            <button
                              disabled={!rulesAccepted}
                              onClick={() => setIsConfirmModalOpen(true)}
                              className="flex-1 py-3.5 bg-primary disabled:opacity-50 text-white text-[11px] font-black rounded-2xl active:scale-95 transition-all text-center flex items-center justify-center gap-1 shadow-lg shadow-primary/10 focus:outline-none"
                            >
                              پذیرش و ادامه
                            </button>
                          </div>
                        </motion.div>
                      )}
                      {/* STEP: Schedule selection */}
                      {!selectedTable.isReserved && bookingStep === 'schedule' && (
                        <motion.div
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-5 text-right font-sans"
                        >
                          <div className="text-center space-y-2 mb-1">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                              <CalendarClock size={22} className="animate-pulse" />
                            </div>
                            <h3 className="text-base font-black text-dark dark:text-white">برنامه‌ریزی و جزئیات رزرو</h3>
                            <p className="text-[10px] text-gray-400">تاریخ، ساعت و هدف از رزرو میز خود را مشخص نمایید</p>
                          </div>

                          <div className="space-y-4">
                            {/* 1. Pick Date */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between pb-0.5">
                                <label className="text-[11px] font-black text-gray-500 dark:text-gray-400 block">تاریخ رزرو میز:</label>
                                <div className="flex items-center gap-1 text-[9px] font-black text-primary/80 dark:text-primary animate-pulse bg-primary/5 dark:bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/10">
                                  <span>ورق بزنید (تا یک هفته)</span>
                                  <ArrowLeft size={10} strokeWidth={3} />
                                </div>
                              </div>
                              <div className="relative">
                                <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none snap-x overscroll-x-contain" dir="rtl">
                                  {shamsiDates.map((d) => (
                                    <button
                                      key={d.value}
                                      type="button"
                                      onClick={() => setReserveDate(d.value)}
                                      className={`flex-shrink-0 w-[84px] py-2.5 rounded-2xl border text-center transition-all cursor-pointer snap-start focus:outline-none ${
                                        reserveDate === d.value
                                          ? 'bg-primary text-white border-primary shadow-md shadow-primary/25 scale-[1.02]'
                                          : 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-305 border-gray-100 dark:border-white/5 hover:bg-gray-50'
                                      }`}
                                    >
                                      <div className={`text-[9px] font-bold ${reserveDate === d.value ? 'text-white/80' : 'text-gray-400'}`}>{d.label}</div>
                                      <div className="text-[16px] font-black font-mono leading-none my-0.5">{d.dayNum}</div>
                                      <div className={`text-[9px] font-bold ${reserveDate === d.value ? 'text-white/85 font-black' : 'text-gray-500 dark:text-gray-450'}`}>{d.month}</div>
                                    </button>
                                  ))}
                                </div>
                                
                                {/* Subtle fade overlay on the left edge with a delicate arrow */}
                                <div className="absolute left-0 top-0 bottom-2 w-10 bg-gradient-to-r from-white dark:from-[#121214] to-transparent pointer-events-none flex items-center justify-start z-10">
                                  <motion.div
                                    animate={{ x: [0, -3, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                    className="text-primary pr-0.5"
                                  >
                                    <ArrowLeft size={14} strokeWidth={3} className="opacity-80" />
                                  </motion.div>
                                </div>
                              </div>
                            </div>

                            {/* 2. Pick Time Redesigned with Segments/Tabs */}
                            <div className="space-y-2.5">
                              <label className="text-[11px] font-black text-gray-500 dark:text-gray-400 block pb-0.5">ساعت پیشنهادی حضور شما:</label>
                              
                              {/* Segmented control for morning/afternoon/evening */}
                              <div className="flex bg-gray-100/80 dark:bg-white/5 p-1 rounded-xl gap-1">
                                {[
                                  { value: 'morning', label: 'صبح و ظهر', icon: '🌅', desc: '۹ تا ۱۳' },
                                  { value: 'afternoon', label: 'بعدازظهر', icon: '☀️', desc: '۱۴ تا ۱۷' },
                                  { value: 'evening', label: 'عصر و شب', icon: '🌙', desc: '۱۸ تا ۲۳' }
                                ].map((slot) => (
                                  <button
                                    key={slot.value}
                                    type="button"
                                    onClick={() => {
                                      setTimeSlot(slot.value as any);
                                      // Auto select first hour in slot if current selection is not in this slot
                                      const slotHours = slot.value === 'morning' 
                                        ? ['۰۹:۰۰', '۱۰:۰۰', '۱۱:۰۰', '۱۲:۰۰', '۱۳:۰۰'] 
                                        : slot.value === 'afternoon'
                                          ? ['۱۴:۰۰', '۱۵:۰۰', '۱۶:۰۰', '۱۷:۰۰']
                                          : ['۱۸:۰۰', '۱۹:۰۰', '۲۰:۰۰', '۲۱:۰۰', '۲۲:۰۰', '۲۳:۰۰'];
                                      if (!slotHours.includes(reserveTime)) {
                                        setReserveTime(slotHours[0]);
                                      }
                                    }}
                                    className={`flex-1 py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer focus:outline-none ${
                                      timeSlot === slot.value
                                        ? 'bg-white dark:bg-white/10 text-dark dark:text-white shadow-sm font-black'
                                        : 'text-gray-500 dark:text-gray-400 font-bold hover:text-dark dark:hover:text-white'
                                    }`}
                                  >
                                    <div className="text-[10px] flex items-center justify-center gap-1">
                                      <span>{slot.icon}</span>
                                      <span>{slot.label}</span>
                                    </div>
                                    <div className="text-[8px] opacity-60 mt-0.5 font-mono">{slot.desc}</div>
                                  </button>
                                ))}
                              </div>

                              {/* Hours of selected slot */}
                              <div className="grid grid-cols-4 gap-2 bg-gray-500/[0.02] dark:bg-white/[0.01] p-2.5 rounded-xl border border-gray-100 dark:border-white/5 min-h-[64px]">
                                {(timeSlot === 'morning' 
                                  ? ['۰۹:۰۰', '۱۰:۰۰', '۱۱:۰۰', '۱۲:۰۰', '۱۳:۰۰'] 
                                  : timeSlot === 'afternoon'
                                    ? ['۱۴:۰۰', '۱۵:۰۰', '۱۶:۰۰', '۱۷:۰۰']
                                    : ['۱۸:۰۰', '۱۹:۰۰', '۲۰:۰۰', '۲۱:۰۰', '۲۲:۰۰', '۲۳:۰۰']
                                ).map((t) => (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() => setReserveTime(t)}
                                    className={`py-2 rounded-xl border text-center text-[11px] font-black font-mono transition-all cursor-pointer focus:outline-none ${
                                      reserveTime === t
                                        ? 'bg-primary/10 text-primary border-primary'
                                        : 'bg-white dark:bg-white/5 text-gray-600 dark:text-white/80 border-gray-100 dark:border-white/5 hover:bg-gray-50'
                                    }`}
                                  >
                                    {t}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* 3. Pick Purpose with elegant Dropdown */}
                            <div className="space-y-2 relative" ref={dropdownRef}>
                              <label className="text-[11px] font-black text-gray-500 dark:text-gray-400 block pb-0.5">موضوع یا مناسبت رویداد:</label>
                              <button
                                type="button"
                                onClick={() => setIsPurposeDropdownOpen(!isPurposeDropdownOpen)}
                                className="w-full py-3.5 px-4 rounded-xl border bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-700 dark:text-white/90 font-bold text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/10 transition-all cursor-pointer shadow-sm focus:outline-none"
                              >
                                <span className="flex items-center gap-2">
                                  {reservePurpose === 'birthday' && '🎉 تولد'}
                                  {reservePurpose === 'meeting' && '💼 جلسه کاری و تولید'}
                                  {reservePurpose === 'gathering' && '👥 دورهمی دوستانه'}
                                  {reservePurpose === 'other' && '☕ تفریح و گپ'}
                                </span>
                                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isPurposeDropdownOpen ? 'rotate-180' : ''}`} />
                              </button>

                              <AnimatePresence>
                                {isPurposeDropdownOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#1E1E24] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-50 text-right p-0"
                                  >
                                    {[
                                      { value: 'birthday', label: 'تولد 🎉', desc: 'مناسب برگزاری مراسم و جشن‌های خصوصی' },
                                      { value: 'meeting', label: 'جلسه کاری و تولید 💼', desc: 'قرارهای کاری، ضبط برنامه یا تولید محتوا' },
                                      { value: 'gathering', label: 'دورهمی دوستانه 👥', desc: 'ملاقات با اعضای خانواده و رفقا' },
                                      { value: 'other', label: 'تفریح و گپ ☕', desc: 'اوقات فراغت شخصی با قهوه و شیرینی' },
                                    ].map((item, index) => (
                                      <button
                                        key={item.value}
                                        type="button"
                                        onClick={() => {
                                          setReservePurpose(item.value as any);
                                          setIsPurposeDropdownOpen(false);
                                        }}
                                        className={`w-full py-3 px-5 text-right flex flex-col gap-0.5 transition-all cursor-pointer focus:outline-none border-b border-gray-100/40 dark:border-white/5 last:border-0 ${
                                          index === 0 ? 'rounded-t-2xl' : ''
                                        } ${
                                          index === 3 ? 'rounded-b-2xl' : ''
                                        } ${
                                          reservePurpose === item.value 
                                            ? 'bg-primary/10 text-primary font-black' 
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-white/5'
                                        }`}
                                      >
                                        <div className="text-[12px] font-black">{item.label}</div>
                                        <div className="text-[9px] text-gray-500 dark:text-gray-400 font-semibold">{item.desc}</div>
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-3">
                            <button
                              onClick={() => setBookingStep('rules')}
                              className="flex-1 py-3.5 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-[11px] font-bold rounded-2xl active:scale-95 transition-all text-center font-sans focus:outline-none"
                            >
                              مرحله قبل
                            </button>
                            <button
                              onClick={() => setBookingStep('phone')}
                              className="flex-1 py-3.5 bg-primary text-white text-[11px] font-black rounded-2xl active:scale-95 transition-all text-center flex items-center justify-center gap-1 shadow-lg shadow-primary/10 font-sans focus:outline-none"
                            >
                              ثبت و ادامه
                            </button>
                          </div>
                        </motion.div>
                      )}
                      {/* STEP: Phone Input */}
                      {!selectedTable.isReserved && bookingStep === 'phone' && (
                        <motion.div
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-5"
                        >
                          <div className="text-center space-y-2 mb-1">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                              <Phone size={22} className="animate-pulse" />
                            </div>
                            <h3 className="text-base font-black text-dark dark:text-white">شماره تلفن همراه شما</h3>
                            <p className="text-[10px] text-gray-400">جهت تایید هویت و ارسال رسید رزرو اطلاعات زیر را وارد کنید</p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[11px] font-black text-gray-500 dark:text-gray-400">شماره موبایل:</span>
                            </div>

                            <div className="relative">
                              <input
                                type="tel"
                                maxLength={11}
                                value={mobileNumber}
                                onChange={(e) => {
                                  const converted = toEnglishDigits(e.target.value);
                                  const filtered = converted.replace(/[^0-9]/g, '');
                                  setMobileNumber(filtered);
                                }}
                                placeholder="مثلاً ۰۹۱۲۳۴۵۶۷۸۹"
                                className={`w-full py-4 text-center font-mono text-[17px] tracking-widest bg-gray-50 dark:bg-white/[0.03] border rounded-2xl text-dark dark:text-white focus:outline-none focus:ring-4 transition-all ${
                                  mobileNumber.length === 0
                                    ? 'border-gray-100 dark:border-white/5 focus:border-primary/50 focus:ring-primary/10'
                                    : isPhoneValid
                                      ? 'border-emerald-500/40 dark:border-emerald-500/40 focus:border-emerald-500 focus:ring-emerald-500/10'
                                      : 'border-rose-300 dark:border-rose-900/40 focus:border-rose-500 focus:ring-rose-500/10'
                                }`}
                              />
                            </div>
                            
                            {mobileNumber.length > 0 && !isPhoneValid && (
                              <p className="text-rose-500 text-[11px] font-bold text-center mt-1 animate-pulse">
                                شماره موبایل وارد شده معتبر نیست. نمونه معتبر: ۰۹۱۲۳۴۵۶۷۸۹
                              </p>
                            )}

                            <span className="text-[10px] text-gray-400 text-center block leading-relaxed">کد فعال‌سازی تست <strong className="text-gray-600 dark:text-gray-300">"۱۲۳۴"</strong> بلافاصله ارسال خواهد شد.</span>
                          </div>

                          <div className="flex gap-3 pt-3 font-sans">
                            <button
                              onClick={() => setBookingStep('schedule')}
                              className="flex-1 py-3.5 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-[11px] font-bold rounded-2xl active:scale-95 transition-all text-center"
                            >
                              مرحله قبل
                            </button>
                            <button
                              onClick={() => {
                                if (!isPhoneValid) return;
                                sendVerificationSms();
                              }}
                              disabled={!isPhoneValid}
                              className={`flex-1 py-3.5 text-[11px] font-black rounded-2xl active:scale-95 transition-all text-center flex items-center justify-center gap-1 shadow-lg ${
                                isPhoneValid
                                  ? 'bg-primary text-white shadow-primary/10 cursor-pointer hover:brightness-105'
                                  : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed shadow-none'
                              }`}
                            >
                              ارسال کد تایید
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* STEP: OTP input */}
                      {!selectedTable.isReserved && bookingStep === 'otp' && (
                        <motion.div
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-5"
                        >
                          <div className="text-center space-y-2 mb-1">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                              <KeyRound size={22} className="text-primary animate-bounce" />
                            </div>
                            <h3 className="text-base font-black text-dark dark:text-white">کد تایید پیامکی</h3>
                            <p className="text-[10px] text-gray-500 max-w-[240px] mx-auto leading-relaxed">کد تایید چهار رقمی ارسال شده به شماره <span className="font-bold text-dark dark:text-white font-mono">{mobileNumber}</span> را وارد نمایید</p>
                          </div>

                          <div className="space-y-4">
                            {/* Segmented input container */}
                            <div className="relative h-16 w-full max-w-[240px] mx-auto flex items-center justify-center" dir="ltr">
                              <input
                                type="tel"
                                maxLength={4}
                                value={otpCode}
                                onChange={(e) => {
                                  const val = toEnglishDigits(e.target.value).replace(/\D/g, '');
                                  setOtpCode(val);
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer text-center"
                                autoFocus
                                dir="ltr"
                              />
                              
                              <div className="absolute inset-0 flex flex-row items-center justify-between gap-3 z-10 pointer-events-none" dir="ltr">
                                {[0, 1, 2, 3].map((index) => {
                                  const char = otpCode[index] || '';
                                  const isFocused = otpCode.length === index;
                                  return (
                                    <div
                                      key={index}
                                      className={`w-12 h-14 rounded-2xl flex items-center justify-center font-mono text-xl font-extrabold border bg-gray-50 dark:bg-white/[0.02] shadow-sm transition-all duration-300 ${
                                        char 
                                          ? otpCode === '1234'
                                            ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 scale-[1.03] bg-emerald-500/[0.01]'
                                            : 'border-rose-300 dark:border-rose-950/40 text-rose-500 scale-[1.03]'
                                          : isFocused 
                                            ? 'border-primary ring-4 ring-primary/10 scale-[1.05] bg-white dark:bg-black/10' 
                                            : 'border-gray-200 dark:border-white/10'
                                      }`}
                                    >
                                      {char ? (
                                        <motion.span 
                                          initial={{ scale: 0.5, opacity: 0 }}
                                          animate={{ scale: 1, opacity: 1 }}
                                          transition={{ type: "spring", stiffness: 350, damping: 15 }}
                                        >
                                          {char}
                                        </motion.span>
                                      ) : (
                                        isFocused && (
                                          <motion.span 
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                            className="w-1.5 h-6 bg-primary rounded-full"
                                          />
                                        )
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {otpCode.length > 0 && (
                              <div className="text-center">
                                {otpCode.length < 4 ? (
                                  <span className="text-[11px] font-bold text-gray-400">
                                    {`وارد شدن ${otpCode.length} رقم از ۴ رقم...`}
                                  </span>
                                ) : (
                                  <span className={`text-[11px] font-extrabold pb-0.5 ${
                                    otpCode === '1234' 
                                      ? 'text-emerald-500 dark:text-emerald-400' 
                                      : 'text-rose-500 dark:text-rose-400'
                                  }`}>
                                    {otpCode === '1234' 
                                      ? '✓ کد تایید صحیح است.' 
                                      : 'کد تایید وارد شده صحیح نیست. کد آزمایشی ۱۲۳۴ است.'}
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 dark:text-gray-400">
                              <span className="bg-orange-500/5 text-primary tracking-wide px-2 py-1 rounded-lg">کد تستی فعال‌سازی: ١٢٣٤</span>
                              {otpTimer > 0 ? (
                                <span className="font-mono text-gray-400">ارسال مجدد کد تا {otpTimer} ثانیه</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOtpTimer(59);
                                    success('کد تایید مجدداً پیامک گردید (۱۲۳۴)');
                                  }}
                                  className="text-primary hover:underline cursor-pointer"
                                >
                                  ارسال مجدد کد تایید
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-3 pt-3">
                            <button
                              onClick={() => setBookingStep('phone')}
                              className="flex-1 py-3.5 bg-gray-100 dark:bg-white/10 text-gray-750 dark:text-gray-300 text-[11px] font-bold rounded-2xl active:scale-95 transition-all text-center"
                            >
                              تغییر شماره
                            </button>
                            <button
                              onClick={confirmVerificationCode}
                              className="flex-1 py-3.5 bg-primary text-white text-[11px] font-black rounded-2xl active:scale-95 transition-all text-center flex items-center justify-center gap-1 shadow-lg shadow-primary/10"
                            >
                              تایید کد امنیتی
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* STEP: Deposit display Summary */}
                      {!selectedTable.isReserved && bookingStep === 'deposit' && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-5"
                        >
                          <div className="text-center space-y-2 mb-1">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                              <ShieldCheck size={22} />
                            </div>
                            <h3 className="text-base font-black text-dark dark:text-white">پیش‌فاکتور بیعانه ثبت رزور</h3>
                            <p className="text-[10px] text-gray-400">اطلاعات نهایی و فیش بیعانه پرداختی موقت</p>
                          </div>

                          <div className="bg-gray-50 dark:bg-white/[0.03] rounded-3xl p-4.5 space-y-3.5 border border-gray-100 dark:border-white/5 text-xs font-medium">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 dark:text-gray-400">میز انتخابی:</span>
                              <span className="font-black text-dark dark:text-white font-sans">میز شماره {selectedTable.number} ({selectedTable.zone})</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 dark:text-gray-400">زمان حضور پیشنهادی:</span>
                              <span className="font-black text-dark dark:text-white font-sans">{reserveDate} – ساعت {reserveTime}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 dark:text-gray-400">موضوع رویداد:</span>
                              <span className="font-black text-dark dark:text-white bg-primary/10 text-primary px-2.5 py-0.5 rounded-lg text-[10px] font-sans">
                                {reservePurpose === 'birthday' ? 'تولد 🎉' :
                                 reservePurpose === 'meeting' ? 'جلسه کاری 💼' :
                                 reservePurpose === 'gathering' ? 'دورهمی دوستانه 👥' : 'تفریح و گپ ☕'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 dark:text-gray-400">مدت نگهداشت رزرو:</span>
                              <span className="font-black text-dark dark:text-white font-sans">۱ ساعت پس از حضور</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 dark:text-gray-400">شماره هماهنگی لند:</span>
                              <span className="font-mono text-dark dark:text-white font-bold">{mobileNumber}</span>
                            </div>
                            <div className="h-px bg-gray-200/50 dark:bg-white/10" />
                            <div className="flex items-center justify-between text-base pt-1">
                              <span className="font-black text-primary">مبلغ قابل پرداخت بیعانه:</span>
                              <span className="font-black font-mono text-dark dark:text-white">۵۰,۰۰۰ تومان</span>
                            </div>
                          </div>

                          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-2xl p-3 text-[9px] text-center leading-relaxed">
                            این هزینه موقت بوده و برای اثبات حضور شما تنظیم شده است و نقداً در فاکتور نهایی کسر خواهد شد
                          </div>

                          <div className="flex gap-3 pt-3">
                            <button
                              onClick={() => setBookingStep('otp')}
                              className="flex-1 py-3.5 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-[11px] font-bold rounded-2xl active:scale-95 transition-all text-center"
                            >
                              بازگشت
                            </button>
                            <button
                              onClick={handleIntegratePaymentRedirect}
                              className="flex-1 py-3.5 bg-emerald-500 text-white text-[11px] font-black rounded-2xl active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
                            >
                              <CreditCard size={14} />
                              <span>انتقال به درگاه بانکی</span>
                            </button>
                          </div>
                        </motion.div>
                      )}

                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
      <BookingConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => setBookingStep('schedule')}
      />
    </PageTransition>
  );
};

// Internal mini icons
const SmartphoneIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
);

export default Tables;
