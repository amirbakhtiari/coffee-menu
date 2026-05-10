
import React, { useRef, useEffect } from 'react';

interface OTPInputProps {
  value: string[];
  onChange: (otp: string[]) => void;
  length?: number;
  error?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({ value, onChange, length = 4, error }) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // فوکوس روی اولین فیلد در هنگام لود
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, val: string) => {
    // تبدیل اعداد فارسی به انگلیسی
    const persianToEnglish = (s: string) => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
    const normalizedVal = persianToEnglish(val);

    // فقط اجازه ورود عدد
    if (!/^\d*$/.test(normalizedVal)) return;

    const newOtp = [...value];
    // اگر کاربر بیش از یک کاراکتر وارد کرد (مثلاً پیست کردن)
    if (normalizedVal.length > 1) {
      const sliced = normalizedVal.slice(0, length - index).split('');
      sliced.forEach((char, i) => {
        if (index + i < length) newOtp[index + i] = char;
      });
      onChange(newOtp);
      const nextIdx = Math.min(index + sliced.length, length - 1);
      inputsRef.current[nextIdx]?.focus();
      return;
    }

    newOtp[index] = normalizedVal;
    onChange(newOtp);

    // فوکوس روی فیلد بعدی
    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      // فوکوس روی فیلد قبلی در صورت فشردن بک‌اسپیس در فیلد خالی
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-4 ltr" dir="ltr">
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={value[idx] || ''}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          className={`w-14 h-16 bg-white dark:bg-black/20 border-2 rounded-2xl text-center text-xl font-black text-primary focus:ring-4 outline-none transition-all shadow-lg shadow-black/5 dark:shadow-none ${
            error 
              ? 'border-red-500 ring-4 ring-red-500/10' 
              : 'border-gray-100 dark:border-white/10 focus:border-primary focus:ring-primary/10'
          }`}
        />
      ))}
    </div>
  );
};

export default OTPInput;
