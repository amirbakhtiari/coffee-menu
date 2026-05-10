
import { useQuery } from '@tanstack/react-query';
import { fetchNotifications } from '../../services/api/notifications';

export const useNotificationsApi = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  });
};
