import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Clock, 
  ChevronRight, 
  Instagram, 
  Navigation,
  Coffee,
  Share2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const CafeInfo: React.FC = () => {
  const navigate = useNavigate();

  const openingHours = [
    { day: 'شنبه', hours: '۸:۰۰ الی ۲۳:۰۰' },
    { day: 'یکشنبه', hours: '۸:۰۰ الی ۲۳:۰۰' },
    { day: 'دوشنبه', hours: '۸:۰۰ الی ۲۳:۰۰' },
    { day: 'سه‌شنبه', hours: '۸:۰۰ الی ۲۳:۰۰' },
    { day: 'چهارشنبه', hours: '۸:۰۰ الی ۲۳:۰۰' },
    { day: 'پنجشنبه', hours: '۸:۰۰ الی ۲۴:۰۰' },
    { day: 'جمعه', hours: '۱۰:۰۰ الی ۲۳:۰۰' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-dark flex flex-col pb-20">
        {/* Custom Premium AppBar */}
        <div className="sticky top-0 z-[100] px-6 py-4 flex items-center justify-between bg-white/80 dark:bg-dark/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5">
          <button 
            onClick={() => navigate(-1)} 
            className="w-11 h-11 flex items-center justify-center bg-gray-50 dark:bg-white/5 rounded-2xl text-dark dark:text-white active:scale-90 transition-transform shadow-sm"
          >
            <ChevronRight size={22} />
          </button>
          <div className="text-center">
            <h1 className="text-base font-black text-dark dark:text-white tracking-tight">اطلاعات فروشگاه</h1>
            <div className="flex justify-center mt-0.5">
              <span className="w-4 h-1 bg-primary rounded-full" />
            </div>
          </div>
          <button 
            className="w-11 h-11 flex items-center justify-center bg-gray-50 dark:bg-white/5 rounded-2xl text-dark dark:text-white active:scale-90 transition-transform shadow-sm"
          >
            <Share2 size={18} />
          </button>
        </div>

        <div className="px-6 flex flex-col gap-6 mt-6">
          {/* Hero Section with Logo */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex flex-col items-center py-10 rounded-[48px] overflow-hidden bg-primary/5 border border-primary/10"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(var(--color-primary),0.05),transparent)]" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-white dark:bg-dark rounded-[32px] flex items-center justify-center shadow-2xl shadow-primary/20 mb-4 border border-primary/20">
                <div className="w-16 h-16 bg-primary rounded-[24px] flex items-center justify-center text-white">
                  <Coffee size={36} strokeWidth={2.5} />
                </div>
              </div>
              <h2 className="text-2xl font-black text-dark dark:text-white">کافه لند</h2>
              <p className="text-[11px] uppercase tracking-[0.3em] font-black text-primary/60 mt-1.5 ml-1">Smart Menu Experience</p>
            </div>
          </motion.div>

          {/* Map Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-[40px] overflow-hidden bg-gray-100 dark:bg-white/5 h-64 border border-gray-100 dark:border-white/5 relative group shadow-sm"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.1678170251786!2d51.40552731526012!3d35.75902198017586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQ1JzMyLjUiTiA1McKwMjQnMjcuOSJF!5e0!3m2!1sen!2sir!4v1652361234567!5m2!1sen!2sir" 
              className="w-full h-full grayscale opacity-80 dark:invert contrast-[1.1]"
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-dark/20 to-transparent" />
            <button className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-dark/90 backdrop-blur-md py-3 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-black text-dark dark:text-white shadow-xl active:scale-95 transition-transform pointer-events-auto border border-white/10">
              <Navigation size={14} className="text-primary" />
              <span>مشاهده و مسیریابی در نقشه بزرگتر</span>
            </button>
          </motion.div>

          {/* Contact Cards */}
          <div className="space-y-4">
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-white/5 p-6 rounded-[36px] border border-gray-100 dark:border-white/5 flex items-start gap-5"
            >
              <div className="w-14 h-14 shrink-0 bg-primary/10 rounded-[22px] flex items-center justify-center text-primary shadow-inner">
                <MapPin size={28} />
              </div>
              <div className="flex-1 text-right">
                <h3 className="font-black text-xs text-muted dark:text-white/40 mb-1.5 uppercase tracking-wide">نشانی دقیق</h3>
                <p className="text-[13px] text-dark dark:text-white/80 leading-relaxed font-bold italic">خیابان ولیعصر، نرسیده به میدان ونک، طبقه اول ساختمان نگین، کافه لند</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.a 
                href="tel:02188887766"
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-gray-50 dark:bg-white/5 p-5 rounded-[32px] border border-gray-100 dark:border-white/5 flex flex-col items-center text-center gap-3 active:scale-95 transition-transform shadow-sm"
              >
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 shadow-inner">
                  <Phone size={22} />
                </div>
                <div>
                  <h3 className="font-black text-[10px] text-muted dark:text-white/40 mb-1">تماس با کافه</h3>
                  <p className="text-[12px] font-black text-dark dark:text-white tracking-widest" dir="ltr">۰۲۱-۸۸۸۸۷۷۶۶</p>
                </div>
              </motion.a>

              <motion.a 
                href="https://instagram.com/caffeland.cafe"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-gray-50 dark:bg-white/5 p-5 rounded-[32px] border border-gray-100 dark:border-white/5 flex flex-col items-center text-center gap-3 active:scale-95 transition-transform shadow-sm"
              >
                <div className="w-12 h-12 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-500/10">
                  <Instagram size={22} />
                </div>
                <div>
                  <h3 className="font-black text-[10px] text-muted dark:text-white/40 mb-1">اینستاگرام ما</h3>
                  <p className="text-[12px] font-black text-dark dark:text-white tracking-wide" dir="ltr">@caffeland</p>
                </div>
              </motion.a>
            </div>
          </div>

          {/* Full Week Opening Hours */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-dark dark:bg-white/5 p-8 rounded-[40px] shadow-2xl shadow-dark/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Clock size={20} />
                </div>
                <h3 className="font-black text-lg text-white">ساعات کاری مجتمع</h3>
              </div>
              <div className="space-y-4">
                {openingHours.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <span className="text-[13px] font-bold text-white/50 group-hover:text-white transition-colors">{item.day}</span>
                    <div className="flex-1 mx-4 border-b border-dashed border-white/10 group-hover:border-primary/30 transition-colors" />
                    <span className="text-[13px] font-black text-white">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bottom Branding */}
          <div className="py-10 text-center opacity-10 select-none flex flex-col items-center">
            <div className="flex justify-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-current" />
              <div className="w-4 h-0.5 rounded-full bg-current" />
              <div className="w-2 h-2 rounded-full bg-current" />
            </div>
            <p className="text-[10px] font-black tracking-[0.4em] uppercase">Caffeland Smart UI v2.0</p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CafeInfo;
