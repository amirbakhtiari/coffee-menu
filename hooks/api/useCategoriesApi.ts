
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../../services/api/categories';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
};
