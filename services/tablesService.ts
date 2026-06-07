import * as tablesApi from './api/tables';
import { Table } from '../types';

/**
 * Service Layer for Cafe Cafe-Land tables.
 * This layer encapsulates business logic, coordinates with the API layer,
 * and prepares structured, typed data for use by React Query hooks.
 */
export const TablesService = {
  /**
   * Fetches the current list of tables from the server database.
   */
  async getTables(): Promise<Table[]> {
    try {
      const data = await tablesApi.fetchTables();
      return data;
    } catch (error) {
      console.error('[TablesService] Failed to fetch tables:', error);
      throw new Error('خطا در دریافت لیست کافه؛ لطفاً مجدداً تلاش نمایید.');
    }
  },

  /**
   * Toggles the reservation state of a specific table by its unique ID.
   */
  async toggleReservation(tableId: number): Promise<Table> {
    try {
      const updatedTable = await tablesApi.toggleTableReservation(tableId);
      return updatedTable;
    } catch (error) {
      console.error(`[TablesService] Failed to toggle reservation for table ${tableId}:`, error);
      throw new Error('خطا در تغییر وضعیت رزرو میز؛ لطفاً دوباره امتحان کنید.');
    }
  },

  /**
   * Resets all table layouts & reservations back to their factory administrative defaults.
   */
  async resetToDefaults(): Promise<Table[]> {
    try {
      const resetData = await tablesApi.resetTablesToDefault();
      return resetData;
    } catch (error) {
      console.error('[TablesService] Failed to reset tables to defaults:', error);
      throw new Error('خطا در بازنشانی وضعیت میزها؛ لطفاً سیستم را مجدداً بارگذاری کنید.');
    }
  }
};
