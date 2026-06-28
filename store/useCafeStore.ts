import { create } from 'zustand';

interface CafeStore {
  isModalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

/**
 * Purely Client-side UI State for managing modal visibility and auth status
 */
export const useCafeStore = create<CafeStore>((set) => ({
  isModalOpen: false,
  setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  setIsLoggedIn: (loggedIn) => {
    localStorage.setItem('isLoggedIn', loggedIn ? 'true' : 'false');
    set({ isLoggedIn: loggedIn });
  },
}));
