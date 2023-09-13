import { useCurrentUser } from 'queries/users';
import { getBrwoserTimezone } from 'utils/time';

export const useCurrentTimezone = () => {
  const { data, isLoading } = useCurrentUser();
  const browserTimezone = getBrwoserTimezone();
  return {
    isLoading,
    currentTimezone: data?.data?.result?.data?.timeZone || browserTimezone,
  };
};
