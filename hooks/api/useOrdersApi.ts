
import { useQuery } from '@tanstack/react-query';
import { fetchOrders, fetchOrderById } from '../../services/api/orders';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });
};

export const useOrder = (id?: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => id ? fetchOrderById(id) : Promise.resolve(undefined),
    enabled: !!id,
  });
};
