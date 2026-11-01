import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from '../store/useLanguageStore';

interface AppBarProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  subtitle?: string;
  showBack?: boolean;
  className?: string;
}

const AppBar: React.FC<AppBarProps> = ({ 
  title, 
  onBack, 
  rightAction, 
  subtitle, 
  showBack = true,
  className = "mb-4"
}) => {
  const navigate = useNavigate();
  const { isRTL } = useTranslation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const BackIcon = isRTL ? ChevronRight : ChevronLeft;

  return (
    <header className={`shrink-0 h-12 w-full flex items-center justify-center relative ${className}`}>
      {/* Start side (Back button in RTL = right, in LTR = left) */}
      {showBack && (
        <div className="absolute start-0 top-1/2 -translate-y-1/2 z-10 flex items-center">
          <button 
            type="button"
            onClick={handleBack}
            className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl shadow-sm border border-gray-50 dark:border-white/5 flex items-center justify-center text-dark dark:text-white active:scale-90 transition-transform cursor-pointer"
          >
            <BackIcon size={20} />
          </button>
        </div>
      )}

      {/* Symmetrically Centered Title and Subtitle */}
      <div className="flex flex-col items-center justify-center text-center z-0 px-12 max-w-full">
        <h1 className="text-[15px] font-black text-dark dark:text-white leading-tight truncate">{title}</h1>
        {subtitle && <p className="text-[9px] text-muted dark:text-white/40 font-bold mt-0.5 leading-none text-center truncate max-w-[180px] sm:max-w-xs">{subtitle}</p>}
      </div>
      
      {/* End side (Action button in RTL = left, in LTR = right) */}
      {rightAction && (
        <div className="absolute end-0 top-1/2 -translate-y-1/2 z-10 flex items-center">
          {rightAction}
        </div>
      )}
    </header>
  );
};

export default AppBar;
