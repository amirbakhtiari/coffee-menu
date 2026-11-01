import React from 'react';

interface HaloDividerProps {
  className?: string;
}

export const HaloDivider: React.FC<HaloDividerProps> = ({ className = '' }) => {
  return (
    <div className={`w-full py-1 flex items-center justify-center select-none pointer-events-none ${className}`}>
      {/* جداکننده بسیار نامحسوس و مینیمال، بدون هرگونه هاله رنگی یا بلور */}
      <div className="w-full h-[0.5px] bg-gradient-to-r from-transparent via-neutral-300/35 dark:via-white/[0.06] to-transparent" />
    </div>
  );
};

export default HaloDivider;
