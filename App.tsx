
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
