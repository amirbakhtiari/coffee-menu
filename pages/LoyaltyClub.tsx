
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Star, ShieldCheck, ChevronLeft, Coffee } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import AppBar from '../components/AppBar';

const LoyaltyClub: React.FC = () => {
  const navigate = useNavigate();
  const [displayPoints, setDisplayPoints] = React.useState(0);
  const targetPoints = 450;

  React.useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = targetPoints / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetPoints) {
        setDisplayPoints(targetPoints);
        clearInterval(timer);
      } else {
        setDisplayPoints(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  const tiers = [
    {
      id: 'bronze',
      name: 'رده برنزی',
      points: '۰ تا ۹۹۹ امتیاز',
      benefits: ['۳٪ تخفیف روی هر فاکتور', 'جمع‌آوری امتیاز با هر خرید'],
      color: 'from-[#1A1A1A] to-[#0A0A0A]',
      textColor: 'text-white',
      icon: <ShieldCheck size={32} className="text-primary" />,
      reached: true,
      currentPoints: 450,
      nextTierPoints: 1000
    },
    {
      id: 'silver',
      name: 'رده نقره‌ای',
      points: '+۱,۰۰۰ امتیاز',
      benefits: ['۸٪ تخفیف اختصاصی', 'یک مافین رایگان ماهانه', 'دعوت به ایونت‌های خاص'],
      color: 'from-[#2c3e50] to-[#000000]',
      textColor: 'text-white',
      icon: <Star size={32} className="text-gray-300" />,
      reached: false,
      nextTierPoints: 2500
    },
    {
      id: 'gold',
      name: 'رده طلایی',
      points: '+۲,۵۰۰ امتیاز',
      benefits: ['۱۵٪ تخفیف دائمی', 'یک نوشیدنی رایگان هفتگی', 'اولویت در رزرو میز', 'هدیه تولد لوکس'],
      color: 'from-[#1a1a1a] via-[#3d321d] to-[#000000]',
      textColor: 'text-white',
      icon: <Crown size={32} className="text-[#BF953F]" />,
      reached: false
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 15 } }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#080808] relative overflow-x-hidden" dir="rtl">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0" />
        
        <div className="relative z-10 px-6 pt-10 pb-32">
          <div className="flex flex-row items-center justify-between mb-10">
            <div className="text-right">
              <h1 className="text-3xl font-black text-white tracking-tighter mb-1">باشگاه مشتریان</h1>
              <p className="text-xs text-white/40 font-medium">امتیازات و رتبه‌بندی اختصاصی شما</p>
            </div>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all shadow-xl backdrop-blur-md"
            >
              <ChevronLeft size={24} className="rotate-180" />
            </motion.button>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            {/* Main Stats Card */}
            <motion.div variants={itemVariants} className="relative">
              <div className="bg-[#121212] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 blur-3xl -ml-16 -mt-16 rounded-full" />
                
                <div className="flex flex-row items-center justify-between mb-8">
                  <div className="flex flex-row items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                      <Star size={24} className="fill-current" />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-base">امتیاز وفاداری</h3>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Loyalty Points</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-center justify-between">
                   <div className="text-right">
                      <div className="flex flex-row items-baseline gap-2">
                         <span className="text-5xl font-black text-white tabular-nums">{displayPoints}</span>
                         <span className="text-primary font-bold text-sm">امتیاز</span>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>

            {/* Tiers Section */}
            <div className="space-y-6">
              <div className="flex flex-row justify-between items-center px-2">
                <h2 className="font-black text-xl text-white">مسیر پیشرفت شما</h2>
                <div className="h-px flex-1 mx-4 bg-white/10" />
              </div>
              
              <div className="space-y-6">
                {tiers.map((tier, idx) => (
                  <motion.div 
                    key={tier.id}
                    variants={itemVariants}
                    className={`relative rounded-3xl overflow-hidden border border-white/5 p-6 bg-gradient-to-br ${tier.color} transition-all duration-300`}
                  >
                    <div className="flex flex-row justify-between items-start mb-6">
                      <div className="text-right">
                        <div className="flex flex-row items-center gap-3 mb-1">
                          <h3 className="text-xl font-black text-white">{tier.name}</h3>
                          {tier.reached && (
                            <motion.span 
                              animate={{ 
                                boxShadow: [
                                  "0 0 5px rgba(198, 124, 78, 0.4)", 
                                  "0 0 15px rgba(198, 124, 78, 0.8)", 
                                  "0 0 5px rgba(198, 124, 78, 0.4)"
                                ],
                                textShadow: [
                                  "0 0 2px rgba(255, 255, 255, 0.5)",
                                  "0 0 8px rgba(255, 255, 255, 0.8)",
                                  "0 0 2px rgba(255, 255, 255, 0.5)"
                                ]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="bg-primary text-black text-[9px] font-black px-3 py-1 rounded-full shadow-[0_0_10px_rgba(198,124,78,0.5)] flex items-center gap-1.5"
                            >
                              <div className="w-1 h-1 rounded-full bg-black animate-pulse" />
                              فعال
                            </motion.span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-white/50">{tier.points}</span>
                      </div>
                      <div className="p-4 bg-black/20 rounded-2xl backdrop-blur-md">
                        {React.cloneElement(tier.icon as React.ReactElement, { size: 24 })}
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                       {tier.benefits.map((benefit, bIdx) => (
                          <div key={bIdx} className="flex flex-row items-center gap-3">
                             <div className={`w-1 h-1 rounded-full ${tier.reached ? 'bg-primary' : 'bg-white/20'}`} />
                             <span className="text-xs font-medium text-white/80">{benefit}</span>
                          </div>
                       ))}
                    </div>

                    {tier.reached && tier.nextTierPoints && (
                      <div className="mt-8 pt-6 border-t border-white/5">
                        <div className="flex flex-row justify-between items-center mb-3">
                           <span className="text-[10px] text-white/40">مانده تا رده بعدی</span>
                           <div className="flex flex-row items-center gap-1 text-primary">
                              <span className="text-sm font-black font-mono">{(tier.nextTierPoints - (tier.currentPoints || 0)).toLocaleString()}</span>
                              <span className="text-[8px] font-bold">امتیاز</span>
                           </div>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${((tier.currentPoints || 0) / tier.nextTierPoints) * 100}%` }}
                             transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
                             className="h-full bg-primary rounded-full relative shadow-[0_0_10px_rgba(var(--color-primary),0.5)]"
                           />
                        </div>
                      </div>
                    )}

                    {!tier.reached && (
                       <motion.button 
                         whileTap={{ scale: 0.95 }}
                         onClick={() => navigate(`/tier-detail/${tier.id}`)}
                         className="w-full mt-6 py-4 bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl text-xs font-black text-white transition-all flex flex-row items-center justify-center gap-3 group shadow-lg"
                       >
                          مشاهده جزییات رده
                          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform rotate-180" />
                       </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoyaltyClub;
