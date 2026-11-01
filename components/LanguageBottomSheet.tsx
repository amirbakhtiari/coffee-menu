import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Globe, Loader2, Sparkles } from 'lucide-react';
import { AVAILABLE_LANGUAGES, LanguageItem, useTranslation } from '../store/useLanguageStore';

export const LanguageBottomSheet: React.FC = () => {
  const { currentLanguage, dir, isLanguageModalOpen, setLanguageModalOpen, setLanguage, t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<LanguageItem | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSelectLanguage = (lang: LanguageItem) => {
    if (isApplying) return;

    // اگر زبان انتخاب‌شده همان زبان فعلی است، نیازی به لود مجدد نیست و منو بسته می‌شود
    if (lang.code === currentLanguage) {
      setLanguageModalOpen(false);
      return;
    }

    setSelectedLang(lang);
    setIsApplying(true);
    setIsSuccess(false);

    // تغییر واقعی زبان برنامه (به جز نام محصولات که اختصاصی باقی می‌مانند) با انیمیشن روان
    setTimeout(() => {
      setLanguage(lang.code);
      setIsApplying(false);
      setIsSuccess(true);

      // بستن دیالوگ پس از نمایش وضعیت موفقیت
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedLang(null);
        setLanguageModalOpen(false);
      }, 700);
    }, 1100);
  };

  const handleClose = () => {
    if (isApplying) return;
    setLanguageModalOpen(false);
    setSelectedLang(null);
    setIsSuccess(false);
  };

  return (
    <AnimatePresence>
      {isLanguageModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-end justify-center">
          {/* پس‌زمینه تار و تیره */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* بدنه دیالوگ بازشونده از پایین (Bottom Sheet) با پشتیبانی جهت زبان */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="w-full max-w-md bg-white dark:bg-[#18181B] rounded-t-[32px] border-t border-gray-100 dark:border-white/10 p-6 relative z-10 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
            dir={dir}
            onClick={(e) => e.stopPropagation()}
          >
            {/* دستگیره بالای شیت */}
            <div className="w-12 h-1 bg-gray-300 dark:bg-white/20 rounded-full mx-auto mb-4 shrink-0" />

            {/* هدر دیالوگ */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                  <Globe size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-base font-black text-dark dark:text-white leading-tight">
                    {t('lang_modal_title')}
                  </h3>
                  <p className="text-[11px] text-muted dark:text-white/40 font-medium mt-0.5">
                    {t('lang_modal_subtitle')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isApplying}
                className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-colors disabled:opacity-40"
              >
                <X size={16} />
              </button>
            </div>

            {/* وضعیت در حال اعمال تغییر زبان */}
            <AnimatePresence mode="wait">
              {isApplying || isSuccess ? (
                <motion.div
                  key="loading-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-10 flex flex-col items-center justify-center text-center"
                >
                  {isApplying ? (
                    <>
                      <div className="relative mb-4 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                          <Loader2 size={32} className="animate-spin text-primary" strokeWidth={2.5} />
                        </div>
                        <span className="absolute text-xl select-none">{selectedLang?.flag}</span>
                      </div>
                      <h4 className="text-sm font-black text-dark dark:text-white mb-1">
                        {t('lang_applying_prefix')} {selectedLang?.name}...
                      </h4>
                      <p className="text-xs text-muted dark:text-white/50 font-bold" dir="ltr">
                        Applying {selectedLang?.nativeName}
                      </p>
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 15 }}
                        className="w-16 h-16 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20"
                      >
                        <Check size={32} strokeWidth={3} />
                      </motion.div>
                      <div className="flex items-center gap-1.5 text-sm font-black text-emerald-600 dark:text-emerald-400 mb-1">
                        <Sparkles size={16} />
                        <span>{t('lang_success')}</span>
                      </div>
                      <p className="text-xs text-muted dark:text-white/50 font-bold">
                        {selectedLang?.name} ({selectedLang?.nativeName})
                      </p>
                    </>
                  )}
                </motion.div>
              ) : (
                /* فهرست زبان‌های مشخص‌شده: فارسی، انگلیسی، روسی، چینی */
                <motion.div
                  key="list-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-2.5 pb-2"
                >
                  {AVAILABLE_LANGUAGES.map((lang) => {
                    const isSelected = currentLanguage === lang.code;

                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelectLanguage(lang)}
                        className={`w-full p-3.5 rounded-2xl border transition-all flex items-center justify-between group active:scale-[0.99] cursor-pointer ${
                          isSelected
                            ? 'bg-primary/5 dark:bg-primary/10 border-primary/40 shadow-sm'
                            : 'bg-gray-50/70 dark:bg-white/[0.03] border-gray-100 dark:border-white/5 hover:bg-gray-100/70 dark:hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* آیکون پرچم کشور */}
                          <div className="w-11 h-11 rounded-2xl bg-white dark:bg-white/10 shadow-sm flex items-center justify-center text-xl shrink-0 border border-gray-100 dark:border-white/5">
                            {lang.flag}
                          </div>

                          <div className="flex flex-col min-w-0 text-start">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-dark dark:text-white">
                                {lang.name}
                              </span>
                              <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md bg-gray-200/60 dark:bg-white/10 text-muted dark:text-white/60">
                                {lang.shortCode}
                              </span>
                            </div>
                            <span className="text-xs text-muted dark:text-white/40 font-bold mt-0.5" dir="ltr">
                              {lang.nativeName}
                            </span>
                          </div>
                        </div>

                        {/* نشانگر انتخاب */}
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 ${
                            isSelected
                              ? 'bg-primary text-white shadow-md shadow-primary/30'
                              : 'border-2 border-gray-300 dark:border-white/20 group-hover:border-primary/50'
                          }`}
                        >
                          {isSelected && <Check size={14} strokeWidth={3} />}
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LanguageBottomSheet;
