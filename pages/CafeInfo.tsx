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
      <div className="min-h-screen bg-white dark:bg-dark flex flex-col pb-10">
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
            className="relative flex flex-col items-center py-6 rounded-[40px] overflow-hidden bg-primary/5 border border-primary/10"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(var(--color-primary),0.05),transparent)]" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white dark:bg-dark rounded-[28px] flex items-center justify-center shadow-xl shadow-primary/10 mb-3 border border-primary/10">
                <div className="w-14 h-14 bg-primary rounded-[20px] flex items-center justify-center text-white">
                  <Coffee size={28} strokeWidth={2.5} />
                </div>
              </div>
              <h2 className="text-xl font-black text-dark dark:text-white">کافه لند</h2>
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-primary/60 mt-1 ml-1">Smart Menu Experience</p>
            </div>
          </motion.div>

          {/* Address Card & Map Section */}
          <div className="flex flex-col gap-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-white/5 rounded-[40px] border border-gray-100 dark:border-white/5 overflow-hidden shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-muted dark:text-white/30 uppercase tracking-widest">موقعیت مکانی</h3>
                    <p className="text-sm font-black text-dark dark:text-white">خیابان ولیعصر، برج نگین</p>
                  </div>
                </div>
                <p className="text-[12px] leading-relaxed text-muted dark:text-white/60 font-bold italic line-clamp-2">خیابان ولیعصر، نرسیده به میدان ونک، طبقه اول ساختمان نگین، کافه لند</p>
              </div>

              {/* Inlined Map Section */}
              <div className="h-48 relative group">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.1678170251786!2d51.40552731526012!3d35.75902198017586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQ1JzMyLjUiTiA1McKwMjQnMjcuOSJF!5e0!3m2!1sen!2sir!4v1652361234567!5m2!1sen!2sir" 
                  className="w-full h-full grayscale opacity-80 dark:invert contrast-[1.1] transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100"
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-dark/10 to-transparent" />
                <button className="absolute bottom-4 left-4 w-12 h-12 bg-white dark:bg-dark backdrop-blur-md rounded-2xl flex items-center justify-center text-primary shadow-2xl active:scale-90 transition-transform pointer-events-auto border border-white/20">
                  <Navigation size={22} fill="currentColor" fillOpacity={0.1} />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Full Week Opening Hours - Refined Light Theme */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gray-50 dark:bg-white/5 p-8 rounded-[40px] border border-gray-100 dark:border-white/5 relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Clock size={20} />
                </div>
                <h3 className="font-black text-lg text-dark dark:text-white">ساعات کاری مجتمع</h3>
              </div>
              <div className="space-y-4">
                {openingHours.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <span className="text-[13px] font-bold text-muted dark:text-white/40 group-hover:text-dark dark:group-hover:text-white transition-colors">{item.day}</span>
                    <div className="flex-1 mx-4 border-b border-dashed border-gray-200 dark:border-white/10 group-hover:border-primary/30 transition-colors" />
                    <span className="text-[13px] font-black text-dark dark:text-white">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact & Social Section (High-Fidelity Unified Cards) */}
          <div className="grid grid-cols-2 gap-4 pb-4">
            <motion.a 
              href="tel:02188887766"
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden bg-white dark:bg-white/5 p-6 rounded-[36px] border border-gray-100 dark:border-white/5 flex flex-col items-center text-center gap-4 active:scale-95 transition-all shadow-xl shadow-gray-200/20 dark:shadow-none group"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 blur-2xl rounded-full -mr-8 -mt-8" />
              <div className="w-14 h-14 bg-primary/10 rounded-[22px] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Phone size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-black text-[10px] text-muted dark:text-white/30 mb-1.5 uppercase tracking-wider">مرکز تماس</h3>
                <p className="text-[14px] font-black text-dark dark:text-white tracking-widest" dir="ltr">۸۸۸۸۷۷۶۶</p>
              </div>
            </motion.a>

            <motion.a 
              href="https://instagram.com/caffeland.cafe"
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden bg-white dark:bg-white/5 p-6 rounded-[36px] border border-gray-100 dark:border-white/5 flex flex-col items-center text-center gap-4 active:scale-95 transition-all shadow-xl shadow-gray-200/20 dark:shadow-none group"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 blur-2xl rounded-full -mr-8 -mt-8" />
              <div className="w-14 h-14 bg-primary/10 rounded-[22px] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Instagram size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-black text-[10px] text-muted dark:text-white/30 mb-1.5 uppercase tracking-wider">پیج رسمی</h3>
                <p className="text-[14px] font-black text-dark dark:text-white tracking-tight" dir="ltr">@caffeland</p>
              </div>
            </motion.a>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CafeInfo;
