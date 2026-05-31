import { Table } from '../../types';

const INITIAL_TABLES: Table[] = [
  { id: 1, number: '۱', capacity: 2, zone: 'سالن اصلی', isReserved: false, features: ['کنار پنجره', 'نورگیر طبیعی'], },
  { id: 2, number: '۲', capacity: 4, zone: 'سالن اصلی', isReserved: true, reservedBy: 'جناب باقری', reserveTime: 'ساعت ۱۹:۳۰', features: ['مبلمان راحتی', 'نزدیک بار'], },
  { id: 3, number: '۳', capacity: 2, zone: 'تراس', isReserved: false, features: ['فضای باز', 'سیگار آزاد', 'دیوار سبز'], },
  { id: 4, number: '۴', capacity: 6, zone: 'بخش VIP', isReserved: true, reservedBy: 'سرکار خانم رضایی', reserveTime: 'ساعت ۲۰:۰۰', features: ['فضای دنج', 'پخش موسیقی مستقل', 'مبلمان چرمی'], },
  { id: 5, number: '۵', capacity: 4, zone: 'تراس', isReserved: false, features: ['فضای باز', 'ویو عالی', 'گرمایش سقفی'], },
  { id: 6, number: '۶', capacity: 2, zone: 'سالن اصلی', isReserved: false, features: ['آرام', 'نزدیک کتابخانه'], },
  { id: 7, number: '۷', capacity: 4, zone: 'سالن اصلی', isReserved: true, reservedBy: 'آقای احمدی', reserveTime: 'ساعت ۱۸:۰۰', features: ['دسترسی ویلچر', 'مبلمان راحتی'], },
  { id: 8, number: '۸', capacity: 2, zone: 'تراس', isReserved: true, reservedBy: 'سرکار خانم شرفی', reserveTime: 'ساعت ۲۱:۰۰', features: ['فضای باز', 'سیگار آزاد'], },
  { id: 9, number: '۹', capacity: 8, zone: 'بخش VIP', isReserved: false, features: ['ویدیو پروژکتور', 'مناسب جلسات', 'سیستم صوتی اختصاصی'], },
  { id: 10, number: '۱۰', capacity: 4, zone: 'سالن اصلی', isReserved: false, features: ['کنار پنجره', 'فضای صمیمی'], },
  { id: 11, number: '۱۱', capacity: 2, zone: 'بخش VIP', isReserved: false, features: ['دکوراسیون خاص', 'آرامش مطلق'], },
  { id: 12, number: '۱۲', capacity: 4, zone: 'سالن اصلی', isReserved: true, reservedBy: 'شما (منوی هوشمند)', reserveTime: 'سفارش فعال', features: ['میز اختصاصی شما', 'نزدیک بار', 'دارای تبلت'], },
];

const STORAGE_KEY = 'cafe_tables_status';

const getStoredTables = (): Table[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return INITIAL_TABLES;
};

const saveStoredTables = (tables: Table[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tables));
};

export const fetchTables = async (): Promise<Table[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStoredTables());
    }, 850); // Simulated delay for high-fidelity native loader feel
  });
};

export const toggleTableReservation = async (tableId: number): Promise<Table> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const current = getStoredTables();
      const index = current.findIndex(t => t.id === tableId);
      if (index === -1) {
        reject(new Error('میز مورد نظر یافت نشد.'));
        return;
      }

      const table = current[index];
      const nextState = !table.isReserved;
      
      const updatedTable: Table = {
        ...table,
        isReserved: nextState,
        reservedBy: nextState ? 'مشتری حضوری' : undefined,
        reserveTime: nextState ? 'ساعت جاری' : undefined,
      };

      current[index] = updatedTable;
      saveStoredTables(current);
      resolve(updatedTable);
    }, 600);
  });
};

export const resetTablesToDefault = async (): Promise<Table[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      saveStoredTables(INITIAL_TABLES);
      resolve(INITIAL_TABLES);
    }, 800);
  });
};
