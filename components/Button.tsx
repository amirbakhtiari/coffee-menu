
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  loading, 
  variant = 'primary', 
  children, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "flex items-center justify-center gap-2 rounded-[22px] font-black text-[13px] py-4 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100";
  
  const variants = {
    primary: "bg-primary text-white shadow-xl shadow-primary/30",
    secondary: "bg-secondary text-primary border border-primary/10",
    outline: "bg-transparent border border-gray-200 text-dark"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : children}
    </button>
  );
};

export default Button;
