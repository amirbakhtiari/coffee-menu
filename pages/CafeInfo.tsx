import React from 'react';
import {motion} from 'framer-motion';
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
import {useNavigate} from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import AppBar from '../components/AppBar';
import {MapComponent, MapTypes} from "@neshan-maps-platform/mapbox-gl-react";
import nmp_mapboxgl from '@neshan-maps-platform/mapbox-gl';

// import '@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css';

const CafeInfo: React.FC = () => {
    const navigate = useNavigate();

    const daysMap: Record<string, number> = {
        'یکشنبه': 0,
        'دوشنبه': 1,
        'سه‌شنبه': 2,
        'چهارشنبه': 3,
        'پنجشنبه': 4,
        'جمعه': 5,
        'شنبه': 6,
    };
    const isKaffeOpen = (): boolean => {
        const tehranTime = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Tehran'
        })
        const hour = new Date(tehranTime).getHours();
        return hour > 22;
    }
    const isToday = (day: string): boolean => {
        const today = new Date().getDay();
        return daysMap[day] === today;
    }
    const openingHours = [
        {day: 'شنبه', hours: '۱۰:۰۰ الی ۲۲:۰۰', isToday: isToday('شنبه')},
        {day: 'یکشنبه', hours: '۱۰:۰۰ الی ۲۲:۰۰', isToday: isToday('یکشنبه')},
        {day: 'دوشنبه', hours: '۱۰:۰۰ الی ۲۲:۰۰', isToday: isToday('دوشنبه')},
        {day: 'سه‌شنبه', hours: '۱۰:۰۰ الی ۲۲:۰۰', isToday: isToday('سه‌شنبه')},
        {day: 'چهارشنبه', hours: '۱۰:۰۰ الی ۲۲:۰۰', isToday: isToday('چهارشنبه')},
        {day: 'پنجشنبه', hours: '۱۰:۰۰ الی ۲۲:۰۰', isToday: isToday('پنجشنبه')},
        {day: 'جمعه', hours: '۱۰:۰۰ الی ۲۲:۰۰', isToday: isToday('جمعه')},
    ];

    const handleMapLoad = (map) => {
        setTimeout(() => {
            const markerLng = 50.978;
            const markerLat = 35.828;

            const marker = new nmp_mapboxgl.Marker({
                color: "#FF0000",
                draggable: false
            })
                .setLngLat([markerLng, markerLat])
                .addTo(map);
        }, 500);
    };

    const amenities = [
        {icon: <Wifi size={14}/>, name: 'اینترنت پرسرعت'},
        {icon: <Laptop size={14}/>, name: 'مناسب کار با لپ‌تاپ'},
        {icon: <Compass size={14}/>, name: 'فضای روباز و بسته'},
    ];

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'کافه آرسیا',
                text: 'دیدن منوی هوشمند کافه آرسیا و ثبت سفارش آنلاین',
                url: window.location.origin
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.origin);
            alert('لینک کپی شد!');
        }
    };

    return (
        <PageTransition>
            <div className="px-6 pb-24 min-h-screen bg-light-gray dark:bg-dark text-right transition-colors" dir="rtl">
                {/* Unified App Bar */}
                <div className="pt-12 pb-4">
                    <AppBar
                        title="اطلاعات کافه"
                        onBack={() => navigate(-1)}
                        subtitle="درباره ما و ساعات پذیرایی کافه آرسیا"
                        rightAction={
                            <button
                                onClick={handleShare}
                                className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl shadow-sm border border-gray-50 dark:border-white/5 flex items-center justify-center text-dark dark:text-white active:scale-90 transition-transform"
                            >
                                <Share2 size={18}/>
                            </button>
                        }
                    />
                </div>

                <div className="flex flex-col gap-6 mt-2">
                    {/* Main Visual Cover Banner */}
                    <motion.div
                        initial={{opacity: 0, y: 15}}
                        animate={{opacity: 1, y: 0}}
                        className="relative w-full h-56 rounded-[32px] overflow-hidden shadow-sm dark:shadow-none border border-gray-100 dark:border-white/5 group"
                    >
                        <img
                            src="/cafe-hero.jpg"
                            alt="نمای داخل کافه آرسیا"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                        />
                        {/* Dark cozy Vignette Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"/>

                        {/*<div
                            className={`absolute top-4 right-4 backdrop-blur-md border text-[10px] font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm
  ${
                                isKaffeOpen()
                                    ? 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400'
                                    : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
                            }`}
                        >
  <span
      className={`w-1.5 h-1.5 rounded-full animate-pulse ${
          isKaffeOpen() ? 'bg-green-500' : 'bg-red-500'
      }`}
  ></span>

                            <span>{isKaffeOpen() ? 'کافه باز است' : 'کافه بسته است'}</span>
                        </div>
*/}
                        {/* Cafe Brand Details Overlay */}
                        <div className="absolute bottom-5 right-6 text-right">
              <span
                  className="text-[8px] bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary font-black px-2 pb-0.5 rounded-md uppercase tracking-widest inline-block mb-1">
                کافه آرسیا
              </span>
                            <h2 className="text-xl font-black text-white leading-tight">کافه آرسیا</h2>
                            <p className="text-[10px] text-white/70 font-bold mt-1">تجربه طعم‌های تازه و آرامش کامل</p>
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
                            href="tel:02634475533"
                            whileTap={{scale: 0.97}}
                            className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-3 transition-all duration-300 text-right shadow-sm hover:border-primary/30"
                        >
                            <div
                                className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                <Phone size={16} strokeWidth={2.5}/>
                            </div>
                            <div className="min-w-0">
                                <span className="text-[9px] text-muted dark:text-white/40 font-bold block mb-0.5">تماس مستقیم</span>
                                <p className="text-xs font-black text-dark dark:text-white font-mono leading-none"
                                   dir="ltr">۰۲۶-۳۴۴۷۵۵۳۳</p>
                            </div>
                        </motion.a>

                        {/* Official Instagram Button */}
                        <motion.a
                            href="https://instagram.com/arsia.coffee"
                            target="_blank"
                            rel="noreferrer"
                            whileTap={{scale: 0.97}}
                            className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-3 transition-all duration-300 text-right shadow-sm hover:border-pink-500/30"
                        >
                            <div
                                className="w-9 h-9 bg-pink-500/10 dark:bg-pink-500/20 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
                                <Instagram size={16} strokeWidth={2.5}/>
                            </div>
                            <div className="min-w-0">
                                <span className="text-[9px] text-muted dark:text-white/40 font-bold block mb-0.5">اینستاگرام کافه</span>
                                <p className="text-xs font-black text-dark dark:text-white leading-none font-mono"
                                   dir="ltr">@arsia.coffee</p>
                            </div>
                        </motion.a>
                    </div>

                    {/* Location details, Address, Map Frame */}
                    <div
                        className="bg-white dark:bg-white/5 rounded-[32px] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm flex flex-col gap-4 p-5">
                        <div className="flex items-start gap-3.5 text-right">
                            <div
                                className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 mt-0.5">
                                <MapPin size={20}/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xs font-black text-muted dark:text-white/30 uppercase tracking-widest">موقعیت
                                    و آدرس کافه</h3>
                                <h4 className="text-sm font-black text-dark dark:text-white mt-1 leading-normal">کرج،
                                    میدان سپاه</h4>
                                <p className="text-[11px] leading-relaxed text-muted dark:text-white/50 font-bold mt-1.5">خیابان
                                    شهید بهشتی به سمت سه راه گوهردشت، بعد از میدان سپاه، خیابان بوستان</p>
                            </div>
                        </div>

                        {/* Embedded maps iframe inside gorgeous frame */}
                        <div
                            className="h-44 relative rounded-[24px] overflow-hidden group border border-gray-50 dark:border-white/5">
                            <MapComponent
                                options={{
                                    mapKey: "web.33a067d1f459449c96f7a9cc70dacc64",
                                    mapType: MapTypes.neshanVector,
                                    center: [50.977, 35.827],
                                    zoom: 15,
                                    // poi: true,
                                    traffic: true,
                                    isTouchPlatform: true,
                                }}
                                mapSetter={handleMapLoad}
                            />
                            <div
                                className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/25 to-transparent"/>

                            {/* Maps navigation triggers */}
                            <a
                                href="https://neshan.org/maps/places/53e1510b241185a387646c9da6d6cb21#c50.977, 35.827-15z-0p"
                                target="_blank"
                                rel="noreferrer"
                                className="absolute bottom-3 left-3 px-4 py-2 bg-white dark:bg-dark border border-gray-100 dark:border-white/10 rounded-2xl flex items-center gap-1.5 text-xs font-black text-primary shadow-lg hover:scale-105 active:scale-95 transition-all"
                            >
                                <Navigation size={14}/>
                                <span>مسیریابی هوشمند</span>
                            </a>
                        </div>
                    </div>

                    {/* Weekly timetable card */}
                    <div
                        className="bg-white dark:bg-white/5 p-6 rounded-[32px] border border-gray-100 dark:border-white/5 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <Clock size={18}/>
                            </div>
                            <h3 className="font-black text-sm text-dark dark:text-white">ساعت کار کافه آرسیا</h3>
                        </div>

                        <div className="space-y-3.5 mt-1">
                            {openingHours.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                                        item.isToday
                                            ? 'bg-primary/10 dark:bg-primary/20 border-r-4 border-primary shadow-sm'
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
                                            <span
                                                className="text-[8px] bg-primary text-white font-black px-1.5 py-0.5 rounded-md">امروز</span>
                                        )}
                                    </div>
                                    <div
                                        className="flex-1 mx-4 border-b border-dashed border-gray-100 dark:border-white/10"/>
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
                    <div className="text-center mt-2 pb-4 select-none">
            <span className="text-[10px] text-muted/40 dark:text-white/10 font-mono tracking-wider">
              نسخه‌ هوشمند ۱.۰.۱
            </span>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default CafeInfo;
