import { useCurrentUser } from 'queries/users';

export const useCurrentTimezone = () => {
  const { data, isLoading } = useCurrentUser();
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return {
    isLoading,
    currentTimezone:
      data?.data?.result?.data?.timeZone || browserTimezone === 'Asia/Calcutta'
        ? 'Asia/Kolkata'
        : browserTimezone,
  };
};
