import moment from 'moment';

export const formatDate = (inputDate: string): string => {
  const currentDate = moment();
  const parsedDate = moment(inputDate);

  // Check if the parsed date is today
  if (currentDate.isSame(parsedDate, 'day')) {
    return 'Today';
  } else {
    // Format the date as "23rd July"
    return parsedDate.format('Do MMMM');
  }
};

export const isCelebrationToday = (inputDate: string): boolean => {
  const currentDate = moment();
  const parsedDate = moment(inputDate);

  // Check if the parsed date is today
  if (currentDate.isSame(parsedDate, 'day')) {
    return true;
  }

  return false;
};

export const calculateWorkAnniversaryYears = (
  workAnniversaryDate: string,
): number => {
  const anniversary = moment(workAnniversaryDate);
  const currentDate = moment();

  return currentDate.diff(anniversary, 'years');
};
