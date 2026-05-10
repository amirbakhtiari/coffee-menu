
import { useState, useEffect, useCallback } from 'react';
import { Product, CategoryType } from '../types';
import { fetchProducts } from '../services/apiService';

const PAGE_SIZE = 15; // تعداد محصولات در هر صفحه

export const useProducts = (category?: CategoryType, page = 1) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadData = useCallback(async (currentPage: number) => {
    if (!hasMore && currentPage > 1) return; // جلوگیری از درخواست‌های اضافی پس از اتمام محصولات

    try {
      setLoading(true);
      const data = await fetchProducts(category, currentPage, PAGE_SIZE);

      if (currentPage === 1) {
        setProducts(data);
      } else {
        setProducts(prevProducts => [...prevProducts, ...data]);
      }
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      setError('خطا در دریافت اطلاعات از سرور');
    } finally {
      setLoading(false);
    }
  }, [category, hasMore]);

  useEffect(() => {
    setProducts([]); // پاک کردن محصولات قبلی هنگام تغییر دسته‌بندی
    setHasMore(true); // ریست کردن hasMore
    loadData(1); // بارگذاری صفحه اول برای دسته‌بندی جدید
  }, [category, loadData]);

  useEffect(() => {
    if (page > 1) {
      loadData(page);
    }
  }, [page, loadData]);

  return { products, loading, error, hasMore, fetchMoreProducts: () => loadData(page + 1) };
};
