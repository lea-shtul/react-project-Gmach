import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userContext } from '../context/userContext';
import { getMyStats } from '../server/statsApi';

export const useMyStats = () => {
  const { user } = useContext(userContext);

  return useQuery({
    queryKey: ['stats', 'me', user?.id],
    queryFn: getMyStats,
  });
};
