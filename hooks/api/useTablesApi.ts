import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TablesService } from '../../services/tablesService';
import { Table } from '../../types';

export const useTables = () => {
  return useQuery<Table[]>({
    queryKey: ['tables'],
    queryFn: () => TablesService.getTables(),
  });
};

export const useToggleTable = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (tableId: number) => TablesService.toggleReservation(tableId),
    onSuccess: () => {
      // Opt-in automatic cache invalidation
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};

export const useResetTables = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => TablesService.resetToDefaults(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};

