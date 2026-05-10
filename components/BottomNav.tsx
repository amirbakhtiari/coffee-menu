
import React from 'react';
import { Home, ShoppingBag, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const totalItems = useCartStore(state => state.totalItems());
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'خانه' },
    { path: '/cart', icon: ShoppingBag, label: 'سبد خرید', badge: totalItems },
    { path: '/profile', icon: User, label: 'پروفایل' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm bg-white/90 dark:bg-black/80 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.12)] z-50 py-3 px-4 flex justify-around items-center border border-white/50 dark:border-white/5 transition-colors">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        
        return (
          <Link 
            key={item.path} 
            to={item.path} 
            className="relative flex flex-col items-center justify-center p-2 outline-none group"
          >
            <motion.div 
              animate={{ 
                color: active ? '#C67C4E' : '#9B9B9B', 
                scale: active ? 1.1 : 1 
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="relative"
            >
              <Icon size={24} strokeWidth={active ? 2.5 : 2} />
              
              {/* نشانگر تعداد اصلاح شده: کوچک‌تر و متصل‌تر به آیکون */}
              {item.badge !== undefined && item.badge > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={item.badge}
                  className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-black w-[16px] h-[16px] rounded-full flex items-center justify-center border-2 border-white shadow-sm z-20"
                >
                  {item.badge}
                </motion.span>
              )}
            </motion.div>
            
            {active && (
              <motion.div 
                layoutId="nav-indicator"
                className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
                transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
