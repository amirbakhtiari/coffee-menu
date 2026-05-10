
import { UserProfile } from '../../types';

export const fetchUserProfile = async (): Promise<UserProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        fullName: 'امیر بختیاری',
        mobile: '۰۹۱۲۳۴۵۶۷۸۹',
        birthDate: '۱۳۷۰/۰۵/۱۵',
        tier: 'bronze',
        points: 450
      });
    }, 1000);
  });
};

export const updateUserProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        fullName: data.fullName || 'امیر بختیاری',
        mobile: data.mobile || '۰۹۱۲۳۴۵۶۷۸۹',
        birthDate: data.birthDate || '۱۳۷۰/۰۵/۱۵',
        tier: 'bronze',
        points: 450
      });
    }, 1500);
  });
};
