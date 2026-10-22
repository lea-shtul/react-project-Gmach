import { useQuery } from '@tanstack/react-query';
import { getItemById } from '../server/itemApis';
import type { Item } from '../types/itemType';

export const useItem = (id: string | undefined) => {
  return useQuery<Item>({
    queryKey: ['item', id],
    queryFn: () => getItemById(id!),
    enabled: !!id,
  });
};
