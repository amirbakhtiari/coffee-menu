import { getCafeStatusApi, updateCafeStatusOverrideApi } from './api/cafe';
import { CafeStatus } from '../types';

/**
 * Service Layer for Cafe Cafe-Land status.
 * This coordinate with the low-level API files, adds retry or parsing safeguards,
 * and maintains decoupling between components/hooks and network requests.
 */
export const CafeService = {
  /**
   * Fetches the current live status of the Cafe.
   */
  async getLiveStatus(): Promise<CafeStatus> {
    try {
      const status = await getCafeStatusApi();
      return status;
    } catch (error) {
      console.error('[CafeService] Failed to retrieve live cafe status:', error);
      throw new Error('خطا در دریافت وضعیت زنده کافه؛ لطفا اینترنت خود را بررسی کنید.');
    }
  },

  /**
   * Sets/resets manual override parameters for debugging or operational reasons (Closed/Open manually).
   */
  async updateOverride(override: boolean | null): Promise<CafeStatus> {
    try {
      const updatedStatus = await updateCafeStatusOverrideApi(override);
      return updatedStatus;
    } catch (error) {
      console.error('[CafeService] Failed to configure cafe status override:', error);
      throw new Error('سیستم قادر به ثبت شبیه‌ساز وضعیت نمی‌باشد. لطفا دوباره تلاش کنید.');
    }
  }
};
