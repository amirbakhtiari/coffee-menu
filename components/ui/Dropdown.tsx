
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[] | string[];
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ label, value, onChange, options, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formattedOptions = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = formattedOptions.find(opt => opt.value === value) || formattedOptions[0];

  return (
    <div className={`space-y-2 relative ${className}`} ref={containerRef}>
      {label && (
        <span className="text-[9px] text-muted dark:text-white/30 mr-2 font-bold block">{label}</span>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white dark:bg-black/40 border border-gray-200/80 dark:border-white/10 rounded-2xl py-4 px-3 flex items-center justify-between text-xs font-black text-dark dark:text-white focus:border-primary/50 focus:bg-white dark:focus:bg-black/60 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
      >
        <span className="flex-1 text-center">{selectedOption?.label}</span>
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-300 opacity-40 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-[100] w-full max-h-[200px] bg-white dark:bg-[#1a1a1a] shadow-2xl shadow-black/10 dark:shadow-none border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden overflow-y-auto no-scrollbar"
          >
            <div className="p-1">
              {formattedOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full py-3 px-4 text-center text-[11px] font-bold rounded-xl transition-colors ${
                    value === opt.value 
                      ? 'bg-primary text-white' 
                      : 'hover:bg-gray-50 dark:hover:bg-white/5 text-dark dark:text-gray-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
