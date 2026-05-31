import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTables, toggleTableReservation, resetTablesToDefault } from '../../services/api/tables';
import { Table } from '../../types';

export const useTables = () => {
  return useQuery<Table[]>({
    queryKey: ['tables'],
    queryFn: fetchTables,
  });
};

export const useToggleTable = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (tableId: number) => toggleTableReservation(tableId),
    onSuccess: (updatedTable) => {
      // Opt-in automatic cache invalidation
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};

export const useResetTables = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: resetTablesToDefault,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};
