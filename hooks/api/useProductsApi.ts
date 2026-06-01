
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { CategoryType } from '../../types';
import { fetchProducts, fetchProductById, fetchRelatedProducts } from '../../services/api/products';

const PAGE_SIZE = 8;

export const useProducts = (category?: CategoryType) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
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

export const useProduct = (id?: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => {
      if (!id) throw new Error('کد محصول الزامی است');
      return fetchProductById(id);
    },
    enabled: !!id,
  });
};

export const useRelatedProducts = (id?: string, category?: CategoryType) => {
  return useQuery({
    queryKey: ['related-products', id, category],
    queryFn: () => {
      if (!id) throw new Error('کد محصول الزامی است');
      return fetchRelatedProducts(id, category);
    },
    enabled: !!id,
  });
};
