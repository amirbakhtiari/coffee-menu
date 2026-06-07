import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CafeService } from '../../services/cafeService';
import { CafeStatus } from '../../types';

/**
 * Hook to retrieve the current, real-time operating status of Cafe Cafe-Land.
 * Returns the operational status (isClosed, workingHoursText, override params).
 */
export const useCafeStatus = () => {
  return useQuery<CafeStatus>({
    queryKey: ['cafeStatus'],
    queryFn: () => CafeService.getLiveStatus(),
    refetchInterval: 10000, // Background updates every 10 seconds automatically to ensure accurate sync
  });
};

/**
 * Hook to update or simulate custom working hours overriding on Cafe status.
 */
export const useUpdateCafeOverride = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (override: boolean | null) => CafeService.updateOverride(override),
    onSuccess: () => {
      // Refresh current operating status in real-time
      queryClient.invalidateQueries({ queryKey: ['cafeStatus'] });
    },
  });
};
