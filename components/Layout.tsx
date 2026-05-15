
import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import InstallBanner from './InstallBanner';
import WaiterService from './WaiterService';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // منوی پایین را در صفحات خاص مخفی می‌کنیم
  const hideBottomNav = 
    location.pathname.startsWith('/product/') || 
    location.pathname === '/cart' ||
    location.pathname === '/payment-method' ||
    location.pathname === '/online-order' || 
    location.pathname === '/offline-order' || 
    location.pathname === '/orders' ||
    location.pathname.startsWith('/order/') ||
    location.pathname === '/loyalty' ||
    location.pathname.startsWith('/tier-detail/') ||
    location.pathname === '/gateway-transition' ||
    location.pathname === '/payment-result' ||
    location.pathname === '/cafe-info' ||
    location.pathname === '/success';

  // دکمه ویتر را در صفحات خاص مخفی می‌کنیم
  const hideWaiter = 
    location.pathname === '/cart' ||
    location.pathname === '/profile' ||
    location.pathname === '/guest-profile' ||
    location.pathname === '/loyalty' || 
    location.pathname.startsWith('/tier-detail/') ||
    location.pathname === '/gateway-transition' ||
    location.pathname === '/payment-result' ||
    location.pathname === '/cafe-info' ||
    location.pathname === '/success';

  // برای صفحاتی که فوتر اختصاصی دارند یا تمام‌صفحه هستند، پدینگ پایین پیش‌فرض را حذف می‌کنیم
  const removeDefaultPadding = hideBottomNav || location.pathname === '/cart';

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto relative bg-lightGray dark:bg-dark text-dark dark:text-white transition-colors overflow-x-hidden">
      <InstallBanner />
      
      {/* دکمه شناور ویتر در تمام صفحات به جز موارد استثنا نمایش داده می‌شود */}
      {!hideWaiter && <WaiterService />}
      
      <main className={`flex-grow ${removeDefaultPadding ? 'pb-0' : 'pb-24'}`}>
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
};

export default Layout;
