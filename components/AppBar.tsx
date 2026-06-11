import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

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

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={`shrink-0 h-12 w-full grid grid-cols-3 items-center relative ${className}`}>
      {/* Right side alignment (Back button in RTL) */}
      <div className="flex items-center justify-start z-10">
        {showBack && (
          <button 
            onClick={handleBack}
            className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl shadow-sm border border-gray-50 dark:border-white/5 flex items-center justify-center text-dark dark:text-white active:scale-90 transition-transform cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Symmetrically Centered Title and Subtitle */}
      <div className="flex flex-col items-center justify-center text-center z-0">
        <h1 className="text-[15px] font-black text-dark dark:text-white leading-tight">{title}</h1>
        {subtitle && <p className="text-[9px] text-muted dark:text-white/40 font-bold mt-0.5 leading-none">{subtitle}</p>}
      </div>
      
      {/* Left side alignment (Right Action in RTL) */}
      <div className="flex items-center justify-end z-10">
        {rightAction}
      </div>
    </header>
  );
};

export default AppBar;
