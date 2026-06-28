
import { UserProfile } from '../../types';

const DEFAULT_PROFILE: UserProfile = {
  fullName: 'امیر بختیاری',
  mobile: '۰۹۱۲۳۴۵۶۷۸۹',
  birthDate: '۱۳۷۰/۰۵/۱۵',
  tier: 'bronze',
  points: 450
};

export const fetchUserProfile = async (): Promise<UserProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stored = localStorage.getItem('user_profile');
      if (stored) {
        try {
          resolve(JSON.parse(stored));
          return;
        } catch (e) {
          // Fallback to default on JSON parse error
        }
      }
      resolve(DEFAULT_PROFILE);
    }, 200);
  });
};

export const updateUserProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stored = localStorage.getItem('user_profile');
      let currentProfile = DEFAULT_PROFILE;
      if (stored) {
        try {
          currentProfile = JSON.parse(stored);
        } catch (e) {
          // ignore error
        }
      }
      
      const updated: UserProfile = {
        ...currentProfile,
        ...data,
      };
      
      localStorage.setItem('user_profile', JSON.stringify(updated));
      resolve(updated);
    }, 1500);
  });
};
