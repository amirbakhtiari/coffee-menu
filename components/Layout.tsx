
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import InstallBanner from './InstallBanner';
import WaiterService from './WaiterService';
import ToastNotification from './Notification';
import { CafeClosedModal } from './CafeClosedModal';
import { useCafeStore } from '../store/useCafeStore';
import { useCafeStatus } from '../hooks/api/useCafeApi';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { setModalOpen } = useCafeStore();
  const { data: cafeStatus } = useCafeStatus();

  useEffect(() => {
    // اگر کافه به صورت خودکار یا دستی بسته باشد، مدال را نشان می‌دهیم
    if (cafeStatus?.isClosed) {
      setModalOpen(true);
    }
  }, [cafeStatus?.isClosed, setModalOpen]);
  
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
    location.pathname === '/tables' ||
    location.pathname === '/edit-profile' ||
    location.pathname === '/success';

  // دکمه ویتر را در صفحات خاص مخفی می‌کنیم
  const hideWaiter = 
    location.pathname.startsWith('/product/') ||
    location.pathname === '/cart' ||
    location.pathname === '/profile' ||
    location.pathname === '/edit-profile' ||
    location.pathname === '/guest-profile' ||
    location.pathname === '/loyalty' || 
    location.pathname.startsWith('/tier-detail/') ||
    location.pathname === '/gateway-transition' ||
    location.pathname === '/payment-result' ||
    location.pathname === '/cafe-info' ||
    location.pathname === '/tables' ||
    location.pathname === '/success';

  // برای صفحاتی که فوتر اختصاصی دارند یا تمام‌صفحه هستند، پدینگ پایین پیش‌فرض را حذف می‌کنیم
  const removeDefaultPadding = hideBottomNav || location.pathname === '/cart';

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto relative bg-light-gray dark:bg-dark text-dark dark:text-white transition-colors">
      <InstallBanner />
      <ToastNotification />
      <CafeClosedModal />
      
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
