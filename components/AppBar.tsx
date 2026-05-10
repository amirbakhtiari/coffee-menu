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
    <header className={`flex items-center justify-between shrink-0 h-10 ${className}`}>
      <div className="flex items-center gap-3">
        {showBack && (
          <button 
            onClick={handleBack}
            className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl shadow-sm border border-gray-50 dark:border-white/5 flex items-center justify-center text-dark dark:text-white active:scale-90 transition-transform"
          >
            <ChevronRight size={20} />
          </button>
        )}
        <div className="text-right flex flex-col justify-center">
          <h1 className="text-lg font-black text-dark dark:text-white leading-tight">{title}</h1>
          {subtitle && <p className="text-[9px] text-muted dark:text-white/40 font-bold mt-0.5 leading-none">{subtitle}</p>}
        </div>
      </div>
      
      <div className="flex items-center min-w-[40px] justify-end">
        {rightAction}
      </div>
    </header>
  );
};

export default AppBar;
