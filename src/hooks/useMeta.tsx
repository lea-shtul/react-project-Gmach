import { useQuery } from '@tanstack/react-query';
import { getAllMeta } from '../server/metaApi';

export const useMeta = () => {
  const { data: meta } = useQuery({
    queryKey: ['meta'],
    queryFn: getAllMeta,
    staleTime: Infinity,
  });

  const getLabel = (list: 'categories' | 'conditions' | 'statuses', value: string) =>
    meta?.[list].find((o) => o.value === value)?.label ?? value;

  return { meta, getLabel };
};