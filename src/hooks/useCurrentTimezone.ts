import { useCurrentUser } from 'queries/users';

export const useCurrentTimezone = () => {
  const { data, isLoading } = useCurrentUser();
  return { isLoading, currentTimezone: data?.data?.result?.data?.timeZone };
};
