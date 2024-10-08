import { getBrwoserTimezone } from 'utils/time';
import useAuth from './useAuth';

export const useCurrentTimezone = () => {
  const { user } = useAuth();
  const browserTimezone = getBrwoserTimezone();
  return {
    currentTimezone: user?.timezone || browserTimezone,
  };
};
