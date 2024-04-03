import momentTz from 'moment-timezone';

export const formatDate = (
  inputDate: string,
  userTimezone: string,
  type?: string,
): string => {
  const currentDate = momentTz().tz(userTimezone);
  const parsedDate = momentTz(inputDate).tz(userTimezone);
  if (type == 'event') {
    return parsedDate.format('D MMM YYYY');
  }
  // Check if the parsed date is today
  if (
    currentDate.month() === parsedDate.month() &&
    currentDate.date() === parsedDate.date()
  ) {
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
  // Check if the parsed date's month and day match the current date's month and day
  if (
    currentDate.month() === parsedDate.month() &&
    currentDate.date() === parsedDate.date()
  ) {
    return true;
  }

  return false;
};
