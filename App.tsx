
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Menu from './pages/Menu';
import Messages from './pages/Messages';
import PaymentMethod from './pages/PaymentMethod';
import OnlinePayment from './pages/OnlinePayment';
import OfflinePayment from './pages/OfflinePayment';
import Success from './pages/Success';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import LoyaltyClub from './pages/LoyaltyClub';
import TierDetail from './pages/TierDetail';
import Offline from './pages/Offline';
import GatewayTransition from './pages/GatewayTransition';
import PaymentResult from './pages/PaymentResult';
import CafeInfo from './pages/CafeInfo';
import Tables from './pages/Tables';

const AnimatedRoutes = () => {
  const location = useLocation();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Global horizontal swipe/overscroll protector to secure iframe stability in RTL and standard layouts
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const diffX = touch.clientX - startX;
      const diffY = touch.clientY - startY;

      // Check if primary gesture direction is horizontal
      if (Math.abs(diffX) > Math.abs(diffY)) {
        let isScrollableContainer = false;
        let target: HTMLElement | null = e.target as HTMLElement;

        while (target && target !== document.body) {
          const style = window.getComputedStyle(target);
          const hasHorizontalOverflow = 
            target.scrollWidth > target.clientWidth && 
            (style.overflowX === 'auto' || style.overflowX === 'scroll' || target.classList.contains('overflow-x-auto') || target.classList.contains('overflow-x-scroll') || target.classList.contains('no-scrollbar'));

          if (hasHorizontalOverflow) {
            isScrollableContainer = true;

            const scrollLeft = target.scrollLeft;
            const maxScroll = target.scrollWidth - target.clientWidth;

            const isRTL = style.direction === 'rtl';

            if (isRTL) {
              // RTL negative scroll convention (Chrome, Safari, modern mobile)
              // Right limit (start) is scrollLeft = 0
              // Left limit (end) is scrollLeft = -maxScroll
              const isAtRightLimit = Math.abs(scrollLeft) < 2.0;
              const isAtLeftLimit = Math.abs(scrollLeft + maxScroll) < 2.0;

              // Swiping right (diffX > 0) scrolls left (towards -maxScroll)
              // Swiping left (diffX < 0) scrolls right (towards 0)
              if (diffX < 0 && isAtRightLimit) {
                if (e.cancelable) e.preventDefault();
                break;
              }
              if (diffX > 0 && isAtLeftLimit) {
                if (e.cancelable) e.preventDefault();
                break;
              }
            } else {
              // LTR convention
              // Left limit (start) is scrollLeft = 0
              // Right limit (end) is scrollLeft = maxScroll
              const isAtLeftLimit = Math.abs(scrollLeft) < 2.0;
              const isAtRightLimit = Math.abs(scrollLeft - maxScroll) < 2.0;

              // Swiping right (diffX > 0) scrolls left (towards 0)
              // Swiping left (diffX < 0) scrolls right (towards maxScroll)
              if (diffX > 0 && isAtLeftLimit) {
                if (e.cancelable) e.preventDefault();
                break;
              }
              if (diffX < 0 && isAtRightLimit) {
                if (e.cancelable) e.preventDefault();
                break;
              }
            }

            return; // Allow natural horizontal scroll inside the active container
          }
          target = target.parentElement;
        }

        // For non-scrollable areas, lock completely to secure layout geometry
        if (!isScrollableContainer) {
          if (e.cancelable) {
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  if (isOffline) {
    return <Offline />;
  }
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Navigate to="/" replace />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment-method" element={<PaymentMethod />} />
        <Route path="/online-order" element={<OnlinePayment />} />
        <Route path="/offline-order" element={<OfflinePayment />} />
        <Route path="/success" element={<Success />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order/:id" element={<OrderDetail />} />
        <Route path="/loyalty" element={<LoyaltyClub />} />
        <Route path="/tier-detail/:tierId" element={<TierDetail />} />
        <Route path="/gateway-transition" element={<GatewayTransition />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/cafe-info" element={<CafeInfo />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </Router>
  );
};

export default App;
