import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, User, Calendar, Smartphone, Check, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import AppBar from '../components/AppBar';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: 'امیر بختیاری',
    mobile: '۰۹۱۲۳۴۵۶۷۸۹',
    birthDate: '۱۳۷۰/۰۵/۱۵'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      navigate('/profile');
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="px-6 pt-12 pb-32 min-h-screen bg-lightGray dark:bg-dark transition-colors" dir="rtl">
        <AppBar 
          title="ویرایش پروفایل"
          subtitle="اطلاعات کاربری خود را به‌روزرسانی کنید"
          onBack={() => navigate('/profile')}
        />

        <div className="space-y-6">
          {/* بخش فیلدهای ورودی */}
          <div className="bg-white dark:bg-black/20 rounded-[32px] p-8 shadow-sm dark:shadow-none border border-gray-50 dark:border-white/5 space-y-8">
            {/* نام و نام خانوادگی */}
            <div className="space-y-3">
              <label className="flex flex-row items-center gap-2 text-[11px] font-black text-muted dark:text-white/40 mr-1">
                <User size={14} className="text-primary" />
                <span>نام و نام خانوادگی</span>
              </label>
              <input 
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full bg-lightGray dark:bg-black/40 border-none rounded-2xl py-4 px-6 text-sm font-black text-dark dark:text-white focus:ring-2 focus:ring-primary/20 text-right outline-none transition-colors"
              />
            </div>

            {/* شماره موبایل - غیر قابل تغییر */}
            <div className="space-y-3 opacity-60">
              <label className="flex flex-row items-center gap-2 text-[11px] font-black text-muted dark:text-white/40 mr-1">
                <Smartphone size={14} />
                <span>شماره موبایل (غیر قابل تغییر)</span>
                <ShieldCheck size={12} className="text-green-500 mr-auto" />
              </label>
              <input 
                type="text"
                value={formData.mobile}
                disabled
                className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-2xl py-4 px-6 text-sm font-bold text-muted dark:text-white/20 text-right outline-none cursor-not-allowed"
                dir="ltr"
              />
            </div>

            {/* تاریخ تولد */}
            <div className="space-y-3">
              <label className="flex flex-row items-center gap-2 text-[11px] font-black text-muted dark:text-white/40 mr-1">
                <Calendar size={14} className="text-primary" />
                <span>تاریخ تولد</span>
              </label>
              <input 
                type="text"
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                placeholder="مثلا: ۱۳۷۰/۰۱/۰۱"
                className="w-full bg-lightGray dark:bg-black/40 border-none rounded-2xl py-4 px-6 text-sm font-black text-dark dark:text-white focus:ring-2 focus:ring-primary/20 text-right outline-none transition-colors"
              />
            </div>
          </div>

          {/* دکمه تایید */}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full py-5 rounded-[24px] font-black text-sm flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98] ${
              isSaving ? 'bg-muted text-white cursor-wait' : 'bg-primary text-white shadow-primary/25 hover:bg-primary/90'
            }`}
          >
            {isSaving ? (
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
        </div>
      </div>
    </PageTransition>
  );
};

export default EditProfile;
