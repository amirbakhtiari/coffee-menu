
import { useInfiniteQuery } from '@tanstack/react-query';
import { CategoryType } from '../types';
import { fetchProducts } from '../services/apiService';

const PAGE_SIZE = 15;

export const useProducts = (category?: CategoryType) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['products', category],
    queryFn: ({ pageParam = 1 }) => fetchProducts(category, pageParam, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined;
    },
  });

  const products = data?.pages.flat() || [];

  return { 
    products, 
    loading: isLoading, 
    error: isError ? 'خطا در دریافت اطلاعات از سرور' : null, 
    hasMore: hasNextPage, 
    fetchMoreProducts: fetchNextPage,
    isFetchingNextPage
  };
};
