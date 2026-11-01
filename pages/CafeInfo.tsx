import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Instagram, 
  Navigation,
  Wifi,
  Compass,
  Laptop,
  Check,
  Share2,
  ArrowUpLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import AppBar from '../components/AppBar';
import SEO from '../components/SEO';
import { useNotificationStore } from '../store/useNotificationStore';
import { useCafeStatus } from '../hooks/api/useCafeApi';
import { useTranslation } from '../store/useLanguageStore';

const CafeInfo: React.FC = () => {
  const navigate = useNavigate();
  const { success } = useNotificationStore();
  const { t, isRTL, dir } = useTranslation();
  
  const { data: cafeStatus } = useCafeStatus();
  const isClosed = cafeStatus?.isClosed || false;

  const cafeStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    '@id': 'https://abracafe.ir/#cafe',
    name: t('app_name'),
    alternateName: ['Caffe Land', 'Café Land'],
    image: ['https://abracafe.ir/cafe-hero.png'],
    telephone: '+98-21-88887766',
    url: 'https://abracafe.ir/cafe-info',
    priceRange: '$$',
    servesCuisine: ['Specialty Coffee', 'Espresso Bar', 'Artisanal Desserts'],
    description: t('about_cafe_desc'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: t('location_desc'),
      addressLocality: 'Tehran',
      addressRegion: 'Tehran',
      postalCode: '19697',
      addressCountry: 'IR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 35.759022,
      longitude: 51.405527,
    },
    hasMap: 'https://maps.google.com/?q=35.759022,51.405527',
  };

  const openingHours = [
    { day: t('saturday'), hours: t('hours_weekday'), isToday: false },
    { day: t('sunday'), hours: t('hours_weekday'), isToday: false },
    { day: t('monday'), hours: t('hours_weekday'), isToday: false },
    { day: t('tuesday'), hours: t('hours_weekday'), isToday: true },
    { day: t('wednesday'), hours: t('hours_weekday'), isToday: false },
    { day: t('thursday'), hours: t('hours_weekday'), isToday: false },
    { day: t('friday'), hours: t('hours_weekend'), isToday: false },
  ];

  const amenities = [
    { icon: <Wifi size={14} />, name: t('amenity_wifi') },
    { icon: <Laptop size={14} />, name: t('amenity_power') },
    { icon: <Compass size={14} />, name: t('amenity_space') },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: t('app_name'),
        text: `${t('app_name')} - ${t('app_tagline')}`,
        url: window.location.origin
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.origin);
      success(t('share_copied_msg'));
    }
  };

  return (
    <PageTransition>
      <SEO
        title={`${t('cafe_info_title')} | ${t('app_name')}`}
        description={t('about_cafe_desc')}
        keywords="کافه لند, Cafe Land, Specialty Coffee, Tehran Cafe"
        ogType="restaurant"
        ogImage="/cafe-hero.png"
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/cafe-info` : 'https://abracafe.ir/cafe-info'}
        schemaJson={cafeStructuredData}
      />
      <div className="px-6 pb-6 min-h-screen bg-light-gray dark:bg-dark text-start transition-colors" dir={dir}>
        {/* Unified App Bar */}
        <div className="pt-12 pb-4">
          <AppBar 
            title={t('cafe_info_title')} 
            onBack={() => navigate(-1)}
            subtitle={t('about_cafe_title')}
            rightAction={
              <button 
                onClick={handleShare}
                className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl shadow-sm border border-gray-50 dark:border-white/5 flex items-center justify-center text-dark dark:text-white active:scale-90 transition-transform cursor-pointer"
                title={t('btn_share_info')}
              >
                <Share2 size={18} />
              </button>
            }
          />
        </div>

        <div className="flex flex-col gap-6 mt-2">
          {/* Main Visual Cover Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full h-56 rounded-[32px] overflow-hidden shadow-sm dark:shadow-none border border-gray-100 dark:border-white/5 group"
          >
            <img 
              src="/cafe-hero.png" 
              alt={t('app_name')} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Dark cozy Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            
            {/* Cafe Open / Close Dynamic Badge */}
            {isClosed ? (
              <div className="absolute top-4 end-4 bg-amber-500/10 backdrop-blur-md border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                <span>{t('closed_now')}</span>
              </div>
            ) : (
              <div className="absolute top-4 end-4 bg-green-500/10 backdrop-blur-md border border-green-500/30 text-green-600 dark:text-green-400 text-[10px] font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span>{t('open_now')}</span>
              </div>
            )}

            {/* Cafe Brand Details Overlay */}
            <div className="absolute bottom-5 start-6 text-start">
              <span className="text-[8px] bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary font-black px-2 pb-0.5 rounded-md uppercase tracking-widest inline-block mb-1">
                {t('app_name')}
              </span>
              <h2 className="text-xl font-black text-white leading-tight">{t('app_name')}</h2>
              <p className="text-[10px] text-white/70 font-bold mt-1">{t('app_tagline')}</p>
            </div>
          </motion.div>

          {/* Amenities Horizontal Section */}
          <div className="flex gap-2 pb-1 overflow-x-auto no-scrollbar scroll-smooth">
            {amenities.map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-1.5 shrink-0 px-3.5 py-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-full text-dark dark:text-white"
              >
                <div className="text-primary">{item.icon}</div>
                <span className="text-[10px] font-black">{item.name}</span>
              </div>
            ))}
          </div>

          {/* Social Links & Call Direct Access Buttons (2 Column Grid) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Direct Call Button */}
            <motion.a 
              href="tel:02188887766"
              whileTap={{ scale: 0.97 }}
              className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-3 transition-all duration-300 text-start shadow-sm hover:border-primary/30"
            >
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Phone size={16} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] text-muted dark:text-white/40 font-bold block mb-0.5">{t('btn_call_cafe')}</span>
                <p className="text-xs font-black text-dark dark:text-white font-mono leading-none" dir="ltr">021-88887766</p>
              </div>
            </motion.a>

            {/* Official Instagram Button */}
            <motion.a 
              href="https://instagram.com/caffeland.cafe"
              target="_blank"
              rel="noreferrer"
              whileTap={{ scale: 0.97 }}
              className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-3 transition-all duration-300 text-start shadow-sm hover:border-pink-500/30"
            >
              <div className="w-9 h-9 bg-pink-500/10 dark:bg-pink-500/20 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
                <Instagram size={16} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] text-muted dark:text-white/40 font-bold block mb-0.5">Instagram</span>
                <p className="text-xs font-black text-dark dark:text-white leading-none font-mono" dir="ltr">@caffeland</p>
              </div>
            </motion.a>
          </div>

          {/* Location details, Address, Map Frame */}
          <div className="bg-white dark:bg-white/5 rounded-[32px] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm flex flex-col gap-4 p-5">
            <div className="flex items-start gap-3.5 text-start">
              <div className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 mt-0.5">
                <MapPin size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-black text-muted dark:text-white/30 uppercase tracking-widest">{t('location_title')}</h3>
                <h4 className="text-sm font-black text-dark dark:text-white mt-1 leading-normal">{t('app_name')}</h4>
                <p className="text-[11px] leading-relaxed text-muted dark:text-white/50 font-bold mt-1.5">{t('location_desc')}</p>
              </div>
            </div>

            {/* Embedded maps iframe inside frame */}
            <div className="h-44 relative rounded-[24px] overflow-hidden group border border-gray-50 dark:border-white/5">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.1678170251786!2d51.40552731526012!3d35.75902198017586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQ1JzMyLjUiTiA1McKwMjQnMjcuOSJF!5e0!3m2!1sen!2sir!4v1652361234567!5m2!1sen!2sir" 
                className="w-full h-full grayscale opacity-80 dark:opacity-60 dark:invert contrast-[1.1] transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100 group-hover:dark:opacity-90"
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/25 to-transparent" />
              
              {/* Maps navigation triggers */}
              <a 
                href="https://maps.google.com/?q=35.759022,51.405527"
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-3 start-3 px-4 py-2 bg-white dark:bg-dark border border-gray-100 dark:border-white/10 rounded-2xl flex items-center gap-1.5 text-xs font-black text-primary shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <Navigation size={14} />
                <span>{t('btn_directions')}</span>
              </a>
            </div>
          </div>

          {/* Weekly timetable card */}
          <div className="bg-white dark:bg-white/5 p-6 rounded-[32px] border border-gray-100 dark:border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Clock size={18} />
              </div>
              <h3 className="font-black text-sm text-dark dark:text-white">{t('working_hours_title')}</h3>
            </div>

            <div className="space-y-3.5 mt-1">
              {openingHours.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                    item.isToday 
                      ? 'bg-primary/10 dark:bg-primary/20 border-s-4 border-primary shadow-sm' 
                      : 'hover:bg-gray-50/50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${
                      item.isToday ? 'text-primary font-black' : 'text-muted dark:text-white/50'
                    }`}>
                      {item.day}
                    </span>
                    {item.isToday && (
                      <span className="text-[8px] bg-primary text-white font-black px-1.5 py-0.5 rounded-md">{t('today_badge')}</span>
                    )}
                  </div>
                  <div className="flex-1 mx-4 border-b border-dashed border-gray-100 dark:border-white/10" />
                  <span className={`text-[11px] font-black ${
                    item.isToday ? 'text-primary font-black' : 'text-dark dark:text-white/80'
                  }`}>
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* App Version Subtle Indicator */}
          <div className="text-center mt-1 pb-1 flex flex-col items-center gap-1 select-none">
            <span className="text-[10px] text-muted/40 dark:text-white/10 font-mono tracking-wider">
              {t('app_name')} v1.0.1
            </span>
            <a 
              href="https://abracafe.ir" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[11px] font-extrabold text-primary hover:text-primary/80 transition-all flex items-center gap-0.5"
            >
              <span>Powered by AbraCafe</span>
              <ArrowUpLeft size={10} className="stroke-[2.5]" />
            </a>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CafeInfo;
