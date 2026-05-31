import React, { useState, useEffect } from 'react';
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
  Check
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
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

export const Tables: React.FC = () => {
  const navigate = useNavigate();
  const { success, info, error: notifyError } = useNotificationStore();

  // React Query Hooks
  const { data: tables = [], isLoading, isError, error, refetch } = useTables();
  const toggleTableMutation = useToggleTable();
  const resetTablesMutation = useResetTables();

  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'reserved' | 'vip'>('all');
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);

  // Booking Flow Steps:
  // 'details' -> 'rules' -> 'phone' -> 'otp' -> 'deposit'
  const [bookingStep, setBookingStep] = useState<'details' | 'rules' | 'phone' | 'otp' | 'deposit'>('details');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(59);
  const [rulesAccepted, setRulesAccepted] = useState(false);

  // Notify when available state for busy tables
  const [notifyPhone, setNotifyPhone] = useState('');
  const [isNotifyRequested, setIsNotifyRequested] = useState(false);

  // Derive selected table from the live Query data
  const selectedTable = tables.find(t => t.id === selectedTableId) || null;

  // Track active steps & reset states on table selection changes
  useEffect(() => {
    setBookingStep('details');
    setMobileNumber('');
    setOtpCode('');
    setOtpTimer(59);
    setRulesAccepted(false);
    setNotifyPhone('');
    setIsNotifyRequested(false);
  }, [selectedTableId]);

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
      notifyError(`شماره وارد شده (${notifyPhone}) معتبر نیست. لطفا یک شماره معتبر مانند ۰۹۱۲۳۴۵۶۷۸۹ وارد کنید.`);
      return;
    }

    setNotifyPhone(cleanPhone);
    setIsNotifyRequested(true);
    success(`درخواست اطلاع‌رسانی برای میز شماره ${selectedTable.number} ثبت شد.`);
  };

  const handleIntegratePaymentRedirect = () => {
    if (!selectedTable) return;
    // Redirect to simulated gateway path
    navigate(`/gateway-transition?type=table&tableId=${selectedTable.id}&phone=${mobileNumber}`);
  };

  return (
    <PageTransition>
      <div className="px-5 pb-8 min-h-screen bg-light-gray dark:bg-dark text-dark dark:text-white flex flex-col transition-colors" dir="rtl">
        {/* Top Sticky Header */}
        <div className="pt-12 pb-4 -mx-5 px-5 bg-light-gray/80 dark:bg-dark/80 backdrop-blur-md sticky top-0 z-40 transition-colors flex items-center justify-between border-b border-gray-100/50 dark:border-white/5">
          <div className="flex items-center gap-2">
            <button 
              id="back-to-home"
              onClick={() => navigate('/')} 
              className="p-2.5 bg-white dark:bg-white/10 rounded-2xl text-dark dark:text-white border border-gray-200/50 dark:border-white/5 active:scale-95 transition-all shadow-sm flex items-center justify-center cursor-pointer font-bold"
            >
              <ChevronRight size={18} />
            </button>
            <h1 className="text-sm font-black tracking-tight text-dark dark:text-white">وضعیت سرویس‌دهی میزها</h1>
          </div>
          
          <button 
            id="reset-tables"
            disabled={resetTablesMutation.isPending || isLoading}
            onClick={handleResetTables} 
            className="p-2.5 bg-white dark:bg-white/10 text-gray-500 dark:text-gray-400 rounded-2xl active:rotate-180 transition-all duration-500 border border-gray-100 dark:border-white/5 shadow-sm disabled:opacity-50"
            title="بازنشانی جدول‌ها"
          >
            {resetTablesMutation.isPending ? (
              <Loader2 size={15} className="animate-spin text-primary" />
            ) : (
              <RefreshCw size={15} />
            )}
          </button>
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
            {/* Bento Circle Stats Card */}
            <div className="mt-4 bg-white dark:bg-black/25 rounded-3xl p-5 border border-gray-100 dark:border-white/5 shadow-sm flex items-center gap-6 justify-between overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full translate-x-12 -translate-y-12 blur-2xl" />
              
              <div className="flex flex-col gap-2.5 flex-1 z-10">
                <div className="flex items-center gap-1.5">
                  <Sparkle size={14} className="text-primary fill-primary/30" />
                  <span className="text-[10px] font-bold text-muted dark:text-white/40 uppercase tracking-wider">سنسورهای وضعیت سالن زنده</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">کل ظرفیت پذیرایی میزها:</span>
                    <span className="font-extrabold text-xs">{totalCount} میز مستقل</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="flex items-center gap-1.5 text-teal-600 dark:text-emerald-400 font-bold">
                      <span className="w-1.5 h-1.5 bg-teal-500 dark:bg-emerald-500 rounded-full animate-pulse"></span>
                      آماده پذیرایی (آزاد):
                    </span>
                    <span className="font-black text-xs text-teal-650 dark:text-emerald-400">{freeCount} میز</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400 font-bold">
                      <span className="w-1.5 h-1.5 bg-rose-450 dark:bg-rose-500 rounded-full"></span>
                      مشغول سرویس‌دهی:
                    </span>
                    <span className="font-black text-xs text-rose-500 dark:text-rose-400">{reservedCount} میز</span>
                  </div>
                </div>
              </div>

              {/* Radial Progress Graphic */}
              <div className="relative flex items-center justify-center shrink-0 z-10">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    className="stroke-gray-100 dark:stroke-white/5"
                    strokeWidth="7"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    strokeWidth="7"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 38}
                    strokeDashoffset={2 * Math.PI * 38 * (1 - Math.min(Math.max(totalCount > 0 ? reservedCount / totalCount : 0, 0), 1))}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out stroke-teal-500 dark:stroke-emerald-400"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-[16px] font-black">{totalCount > 0 ? Math.round((reservedCount / totalCount) * 100) : 0}%</span>
                  <span className="text-[8px] font-bold opacity-40">تکمیل</span>
                </div>
              </div>
            </div>

            {/* Interactive Smooth Filter Scrollbar */}
            <div className="mt-5 flex gap-1.5 pb-2 overflow-x-auto no-scrollbar -mx-5 px-5">
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
                    return (
                      <motion.div
                        key={table.id}
                        layoutId={`table-card-${table.id}`}
                        onClick={() => setSelectedTableId(table.id)}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: isTableMutating ? 0.75 : 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 280 }}
                        className={`bg-white dark:bg-black/20 rounded-[28px] p-4 border cursor-pointer select-none transition-all flex flex-col h-[135px] relative overflow-hidden group ${
                          table.isReserved 
                            ? 'border-rose-100/70 dark:border-rose-950/20 opacity-90 hover:opacity-100 hover:border-rose-400/40 dark:hover:border-rose-800/40 bg-gradient-to-br from-white to-rose-50/[0.15] dark:from-black/20 dark:to-rose-950/[0.05]' 
                            : 'border-emerald-100/70 dark:border-emerald-950/20 hover:border-emerald-400/40 dark:hover:border-emerald-800/40 bg-gradient-to-br from-white to-emerald-50/[0.15] dark:from-black/20 dark:to-emerald-950/[0.05]'
                        }`}
                      >
                        {/* Soft glowing ambient circle behind table card */}
                        <div className={`absolute top-0 left-0 w-24 h-24 rounded-full filter blur-xl opacity-5 transition-all -translate-x-12 -translate-y-12 ${
                          table.isReserved ? 'bg-rose-500' : 'bg-emerald-500'
                        }`} />

                        <div className="flex items-center justify-between mb-2 z-10">
                          <span className="text-[10px] font-bold text-gray-400 dark:text-white/30">{table.zone}</span>
                          {isTableMutating ? (
                            <span className="inline-flex items-center text-primary animate-spin">
                              <Loader2 size={10} />
                            </span>
                          ) : (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black border ${
                              table.isReserved 
                                ? 'bg-rose-50/50 dark:bg-rose-950/20 text-[#E11D48] dark:text-rose-400 border-rose-100/30' 
                                : 'bg-emerald-50/50 dark:bg-emerald-950/20 text-[#0D9488] dark:text-emerald-400 border-emerald-100/30'
                            }`}>
                              <CircleDot size={7} className={`fill-current ${table.isReserved ? 'text-rose-500' : 'text-emerald-500 animate-pulse'}`} />
                              {table.isReserved ? 'رزرو مـشغول' : 'آزاد'}
                            </span>
                          )}
                        </div>

                        <div className="flex-grow flex flex-col justify-center z-10">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black font-mono text-dark dark:text-white group-hover:scale-105 transform origin-right transition-transform duration-350">#{table.number}</span>
                            <span className="text-[10px] text-muted dark:text-white/30 font-bold mr-1">میز</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-white/5 text-[10px] text-gray-400 dark:text-gray-400 font-medium z-10">
                          <span className="flex items-center gap-0.5 font-extrabold text-[#374151] dark:text-[#E4E4E7]">
                            <Users size={11} className="opacity-70" dir="ltr" />
                            {table.capacity} نفره
                          </span>
                          {table.isReserved ? (
                            <span className="text-rose-600 dark:text-rose-400 font-black text-[9px] opacity-90 truncate max-w-[85px]">
                              {table.reservedBy === 'شما (منوی هوشمند)' ? 'میز شما' : table.reservedBy || 'مشتری حضوری'}
                            </span>
                          ) : (
                            <span className="text-teal-650 dark:text-emerald-400 font-black text-[9px]">آماده سفارش</span>
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

                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 block pb-1">شماره تلفن همراه شما:</span>
                                <div className="relative flex items-center">
                                  <SmartphoneIcon className="absolute right-4 text-gray-400" size={18} />
                                  <input
                                    type="tel"
                                    maxLength={15}
                                    value={notifyPhone}
                                    onChange={(e) => {
                                      const converted = toEnglishDigits(e.target.value);
                                      const filtered = converted.replace(/[^0-9+\s-]/g, '');
                                      setNotifyPhone(filtered);
                                    }}
                                    placeholder="۰۹---------"
                                    className="w-full py-4 pr-12 pl-14 text-center font-mono text-base tracking-widest bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-2xl text-dark dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
                                  />
                                  <span className="absolute left-4 font-mono text-xs text-gray-405 font-bold border-r border-gray-200 dark:border-white/10 pl-1 pr-3" dir="ltr">+98</span>
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

                            {/* Manual discharge button for testers and admins */}
                            <div className="pt-2 border-t border-dashed border-gray-100 dark:border-white/5 text-center">
                              <button
                                onClick={() => handleToggleReserve(selectedTable.id)}
                                disabled={toggleTableMutation.isPending}
                                className="text-[10px] text-gray-400 hover:text-rose-500 dark:text-white/20 dark:hover:text-rose-400 font-bold transition-colors cursor-pointer"
                              >
                                {toggleTableMutation.isPending ? 'در حال بی اثر کردن...' : 'آیا مسئول کافه هستید؟ آزاد کردن دستی میز'}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* INITIAL DETAILS OF AN AVAILABLE TABLE */}
                      {!selectedTable.isReserved && bookingStep === 'details' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-5"
                        >
                          {/* Title Header */}
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="bg-primary/10 text-primary dark:text-[#E89C6A] text-[10px] px-3 py-1 rounded-full font-black mb-1.5 inline-block">
                                {selectedTable.zone}
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
                              className="w-full py-4 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 text-[12px] font-black cursor-pointer flex items-center justify-center gap-2 hover:bg-primary-dark active:scale-[0.98] transition-all"
                            >
                              <span>شروع فرآیند ثبت رزرو موقت</span>
                            </button>

                            <button
                              onClick={() => setSelectedTableId(null)}
                              className="w-full py-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-750 dark:text-gray-300 text-[11px] font-bold rounded-2xl active:scale-[0.98] transition-all"
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

                          <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-3xl p-4.5 space-y-4 max-h-[190px] overflow-y-auto pr-1 text-[11px] text-gray-600 dark:text-gray-350 leading-relaxed font-medium">
                            <div className="flex gap-2.5 items-start">
                              <span className="text-primary font-black shrink-0 mt-0.5">⏳</span>
                              <p><strong>مدت زمان نگه داشتن میز:</strong> پس از ثبت رزرو نهایی، میز تا حداکثر <span className="text-primary font-bold">۱ ساعت</span> در وضعیت رزرو به نام شما باقی می‌ماند تا در کافه حضور بیابید.</p>
                            </div>
                            <div className="flex gap-2.5 items-start">
                              <span className="text-primary font-black shrink-0 mt-0.5">💰</span>
                              <p><strong>مبلغ بیعانه تضمینی:</strong> مبلغ کسر شده (۵۰,۰۰۰ تومان) صرفاً جهت تضمین حضور شما بوده و به صورت کامل از مبلغ فاکتور سفارش نهایی شما کسر می‌گردد.</p>
                            </div>
                            <div className="flex gap-2.5 items-start">
                              <span className="text-primary font-black shrink-0 mt-0.5">⚠️</span>
                              <p><strong>عدم حضور فیزیکی:</strong> در صورت انقضای زمان یک ساعت و عدم مراجعه، میز آزاد شده و بیعانه ثبت شده عودت داده نمی‌شود.</p>
                            </div>
                          </div>

                          <label className="flex items-center gap-3 cursor-pointer p-1 rounded-xl">
                            <input
                              type="checkbox"
                              checked={rulesAccepted}
                              onChange={(e) => setRulesAccepted(e.target.checked)}
                              className="w-4 h-4 rounded border-gray-300 dark:border-white/10 text-primary focus:ring-primary focus:ring-opacity-50"
                            />
                            <span className="text-[11px] font-black text-[#374151] dark:text-[#E4E4E7]">قوانین رزرو میز فوق را مطالعه کرده و قبول دارم</span>
                          </label>

                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={() => setBookingStep('details')}
                              className="flex-1 py-3.5 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-[11px] font-bold rounded-2xl active:scale-95 transition-all text-center"
                            >
                              مرحله قبل
                            </button>
                            <button
                              disabled={!rulesAccepted}
                              onClick={() => setBookingStep('phone')}
                              className="flex-1 py-3.5 bg-primary disabled:opacity-50 text-white text-[11px] font-black rounded-2xl active:scale-95 transition-all text-center flex items-center justify-center gap-1 shadow-lg shadow-primary/10"
                            >
                              پذیرش و ادامه
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
                                    : (() => {
                                        const clean = toEnglishDigits(mobileNumber).replace(/\D/g, '');
                                        let pt = clean;
                                        if (clean.length === 10 && clean.startsWith('9')) pt = '0' + clean;
                                        return /^09\d{9}$/.test(pt)
                                          ? 'border-emerald-500/40 dark:border-emerald-500/40 focus:border-emerald-500 focus:ring-emerald-500/10'
                                          : 'border-rose-300 dark:border-rose-950/40 focus:border-rose-500 focus:ring-rose-500/10';
                                      })()
                                }`}
                              />
                            </div>
                            
                            {mobileNumber.length > 0 && !/^09\d{9}$/.test(
                              (() => {
                                const clean = toEnglishDigits(mobileNumber).replace(/\D/g, '');
                                let pt = clean;
                                if (clean.length === 10 && clean.startsWith('9')) pt = '0' + clean;
                                return pt;
                              })()
                            ) && (
                              <p className="text-rose-500 text-[11px] font-bold text-center mt-1">
                                شماره موبایل وارد شده معتبر نیست. نمونه معتبر: ۰۹۱۲۳۴۵۶۷۸۹
                              </p>
                            )}

                            <span className="text-[10px] text-gray-400 text-center block leading-relaxed">کد فعال‌سازی تست <strong className="text-gray-600 dark:text-gray-300">"۱۲۳۴"</strong> بلافاصله ارسال خواهد شد.</span>
                          </div>

                          <div className="flex gap-3 pt-3">
                            <button
                              onClick={() => setBookingStep('rules')}
                              className="flex-1 py-3.5 bg-gray-100 dark:bg-white/10 text-gray-755 dark:text-gray-300 text-[11px] font-bold rounded-2xl active:scale-95 transition-all text-center"
                            >
                              مرحله قبل
                            </button>
                            <button
                              onClick={sendVerificationSms}
                              className="flex-1 py-3.5 bg-primary text-white text-[11px] font-black rounded-2xl active:scale-95 transition-all text-center flex items-center justify-center gap-1 shadow-lg shadow-primary/10"
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
                              <span className="font-black text-dark dark:text-white">میز شماره {selectedTable.number} ({selectedTable.zone})</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 dark:text-gray-400">مدت نگهداشت رزرو:</span>
                              <span className="font-black text-dark dark:text-white">۱ ساعت پس از تراکنش</span>
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
