import { create } from 'zustand';

interface CafeStore {
  isModalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
}

/**
 * Purely Client-side UI State for managing modal visibility
 */
export const useCafeStore = create<CafeStore>((set) => ({
  isModalOpen: false,
  setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
}));
