
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Star, Crown, ChevronRight, Check } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import AppBar from '../components/AppBar';

const TierDetail: React.FC = () => {
  const { tierId } = useParams();
  const navigate = useNavigate();

  const tierData = {
    bronze: {
      name: 'رده برنزی',
      points: '۰ تا ۹۹۹ امتیاز',
      description: 'این اولین پله در دنیای کافه آرسیا است. با عضویت در باشگاه و اولین سفارش، شما یک مشتری برنزی هستید و از مزایای پایه‌ای بهره‌مند خواهید شد.',
      benefits: [
        '۳٪ تخفیف روی هر فاکتور',
        'جمع‌آوری امتیاز با هر خرید (۱۰٪ مبلغ)',
        'اطلاع‌رسانی زودتر از حراج‌ها',
      ],
      color: 'from-[#1A1A1A] to-[#0A0A0A]',
      icon: <ShieldCheck size={48} className="text-primary" />
    },
    silver: {
      name: 'رده نقره‌ای',
      points: '+۱,۰۰۰ امتیاز',
      description: 'وقتی به ۱۰۰۰ امتیاز برسید، شما یکی از مشتریان ویژه ما خواهید بود. در رده نقره‌ای، قدردانی ما از وفاداری شما بیشتر و جذاب‌تر می‌شود.',
      benefits: [
        '۸٪ تخفیف اختصاصی روی تمامی منو',
        'یک مافین رایگان در هر ماه به انتخاب شما',
        'دعوت‌نامه اختصاصی برای ایونت‌های کافه',
        'بسته‌بندی ویژه برای سفارشات بیرون‌بر',
      ],
      color: 'from-[#2c3e50] to-[#000000]',
      icon: <Star size={48} className="text-gray-300" />
    },
    gold: {
      name: 'رده طلایی',
      points: '+۲,۵۰۰ امتیاز',
      description: 'بالاترین سطح وفاداری در کافه آرسیا. مشتریان طلایی بخشی از خانواده درجه یک ما هستند و تجربه‌ای فراتر از یک کافه معمولی را لمس خواهند کرد.',
      benefits: [
        '۱۵٪ تخفیف دائمی و بدون قید و شرط',
        'یک نوشیدنی رایگان به انتخاب شما در هر هفته',
        'اولویت مطلق در رزرو میز و سرویس‌دهی',
        'هدیه تولد لوکس و غافلگیرکننده',
        'دسترسی به بخش مخفی منو (Secret Menu)',
      ],
      color: 'from-[#1a1a1a] via-[#3d321d] to-[#000000]',
      icon: <Crown size={48} className="text-[#BF953F]" />
    }
  };

  const tier = tierData[tierId as keyof typeof tierData] || tierData.bronze;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#080808] transition-colors h-full flex flex-col" dir="rtl">
        <div className="px-6 pt-10 pb-6 shrink-0">
          <AppBar 
            title="جزئیات رده"
            subtitle={tier.name}
            onBack={() => navigate(-1)}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full rounded-[44px] p-10 bg-gradient-to-br ${tier.color} border border-white/10 flex flex-col items-center gap-6 shadow-2xl mb-8`}
          >
            <div className="w-24 h-24 bg-black/20 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/10">
               {tier.icon}
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black text-white mb-2">{tier.name}</h1>
              <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20 text-primary text-[10px] font-black">
                {tier.points}
              </div>
            </div>
          </motion.div>

          <section className="space-y-6">
            <div className="bg-white/5 rounded-[32px] p-6 border border-white/10">
               <h3 className="font-black text-white text-base mb-3">درباره این رده</h3>
               <p className="text-white/60 text-xs leading-relaxed font-medium opacity-80">
                 {tier.description}
               </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-black text-white text-base mr-2">مزایا و پاداش‌ها</h3>
              <div className="grid gap-3">
                {tier.benefits.map((benefit, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-[#121212] p-5 rounded-[24px] border border-white/5 flex flex-row items-center gap-4 group"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      <Check size={20} />
                    </div>
                    <span className="text-sm font-black text-white/90">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 rounded-[32px] p-6 border border-primary/10 flex flex-row items-center gap-5">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-black shrink-0">
                <Star size={24} className="fill-current" />
              </div>
              <div className="text-right">
                <h4 className="font-black text-primary text-sm mb-1">چگونه امتیاز بگیریم؟</h4>
                <p className="text-[10px] text-white/40 leading-relaxed font-medium">
                  با هر خرید از کافه آرسیا، ۱۰٪ مبلغ فاکتور شما به امتیاز تبدیل می‌شود. کافیست شماره موبایل خود را هنگام سفارش اعلام کنید.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
};

export default TierDetail;
