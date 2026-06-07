import { create } from 'zustand';

interface CafeState {
  isClosedOverride: boolean | null; // null means use actual time, true/false means force state
  isModalOpen: boolean;
  setClosedOverride: (closed: boolean | null) => void;
  setModalOpen: (isOpen: boolean) => void;
  isCafeClosed: () => boolean;
  getWorkingHoursText: () => string;
}

export const useCafeStore = create<CafeState>((set, get) => ({
  isClosedOverride: null, // by default let it be open, or let them toggle it in the UI
  isModalOpen: false,

  setClosedOverride: (closed) => {
    set({ isClosedOverride: closed });
    // If we're setting it to closed, automatically open the modal
    if (closed === true) {
      set({ isModalOpen: true });
    }
  },

  setModalOpen: (isOpen) => {
    set({ isModalOpen: isOpen });
  },

  isCafeClosed: () => {
    const override = get().isClosedOverride;
    if (override !== null) {
      return override;
    }

    // Dynamic Time Calculation (Iran time is UTC + 3.5)
    const now = new Date();
    // Get UTC time components
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const utcDay = now.getUTCDay(); // 0: Sunday, 1: Monday, ... 6: Saturday

    // Convert to Iran Time (UTC + 3 hours and 30 minutes)
    let localMinutes = utcMinutes + 30;
    let localHours = utcHours + 3;
    let localDay = utcDay;

    if (localMinutes >= 60) {
      localMinutes -= 60;
      localHours += 1;
    }
    if (localHours >= 24) {
      localHours -= 24;
      localDay = (localDay + 1) % 7;
    }

    // Standard days in terms of JS Day (0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat)
    // Saturday: day 6
    // Friday: day 5
    // Other days: 0, 1, 2, 3, 4
    
    // Sat-Wed: 8:00 - 23:00
    // Thu: 8:00 - 24:00
    // Fri: 10:00 - 23:00

    if (localDay === 5) { // Friday
      return localHours < 10 || localHours >= 23;
    } else if (localDay === 4) { // Thursday
      return localHours < 8 || localHours >= 24;
    } else { // Sat-Wed or Sun-Wed
      return localHours < 8 || localHours >= 23;
    }
  },

  getWorkingHoursText: () => {
    const now = new Date();
    // Simple mapping based on current days
    const utcDay = now.getUTCDay();
    const localDay = (utcDay + (now.getUTCHours() + 3 + (now.getUTCMinutes() + 30 >= 60 ? 1 : 0) >= 24 ? 1 : 0)) % 7;

    if (localDay === 5) { // Friday
      return 'جمعه‌ها: ۱۰:۰۰ الی ۲۳:۰۰';
    } else if (localDay === 4) { // Thursday
      return 'پنجشنبه‌ها: ۸:۰۰ الی ۲۴:۰۰';
    } else {
      return 'شنبه تا چهارشنبه: ۸:۰۰ الی ۲۳:۰۰';
    }
  }
}));
