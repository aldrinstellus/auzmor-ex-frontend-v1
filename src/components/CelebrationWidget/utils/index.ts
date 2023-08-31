import momentTz from 'moment-timezone';

export const formatDate = (inputDate: string, userTimezone: string): string => {
  const currentDate = momentTz().tz(userTimezone);
  const parsedDate = momentTz(inputDate).tz(userTimezone);

  // Check if the parsed date is today
  if (currentDate.isSame(parsedDate, 'day')) {
    return 'Today';
  } else {
    // Format the date as "23rd July"
    return parsedDate.format('D MMM');
  }
};

export const isCelebrationToday = (
  inputDate: string,
  userTimezone: string,
): boolean => {
  const currentDate = momentTz().tz(userTimezone);
  const parsedDate = momentTz(inputDate).tz(userTimezone);

  // Check if the parsed date is today
  if (currentDate.isSame(parsedDate, 'day')) {
    return true;
  }

  return false;
};

export const calculateWorkAnniversaryYears = (
  workAnniversaryDate: string,
  userTimezone: string,
): number => {
  const anniversary = momentTz(workAnniversaryDate).tz(userTimezone);
  const currentDate = momentTz().tz(userTimezone);

  return currentDate.diff(anniversary, 'years');
};
