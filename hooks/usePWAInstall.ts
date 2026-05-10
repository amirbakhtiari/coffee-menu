
import { useState, useEffect } from 'react';

export const usePWAInstall = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      console.log('✅ رویداد beforeinstallprompt دریافت شد');
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      console.log('🚀 اپلیکیشن با موفقیت نصب شد');
      setIsInstallable(false);
      setInstallPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      console.log('❌ رویداد نصب در دسترس نیست');
      return;
    }

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    console.log(`نتیجه نصب: ${outcome}`);
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setInstallPrompt(null);
  };

  const dismissInstall = () => {
    setIsInstallable(false);
  };

  return { isInstallable, handleInstallClick, dismissInstall };
};
