import moment from 'moment';
import timezones from './timezones.json';
import * as momentTimezone from 'moment-timezone';

export const TIME_PATTERN = /^(0[0-9]|1[0-2]):[0-5][0-9] (am|pm)$/; // it will strictly follow "HH:MM am/pm, HH-> [00-12], MM-> [00->59]"

export const parseDate = (timestring: string, format = 'YYYY-MM-DD') => {
  if (!timestring) {
    return null;
  }
  return moment(timestring, format).toDate();
};

export const getTimeDifference = (
  startDateTimestamp: number,
  endDateTimestamp: number,
  timezone: string,
): string => {
  // Convert timestamps to Moment.js objects
  const startDate = moment.tz(startDateTimestamp, timezone);
  const endDate = moment.tz(endDateTimestamp, timezone);

  // Format start and end times in "hh:mm a" format
  const startTime = startDate.format('hh:mm a');
  const endTime = endDate.format('hh:mm a');

  // Concatenate formatted start and end times
  const timeDifference = `${startTime} - ${endTime}`;

  return timeDifference;
};
export const formatDate = (dt: Date, format = 'YYYY-MM-DD') => {
  if (!dt) {
    return null;
  }
  return moment(dt).format(format);
};

export const afterXUnit = (
  x: number,
  unit: moment.unitOfTime.DurationConstructor,
) => {
  return moment().add(x, unit);
};

export const beforeXUnit = (
  x: number,
  unit: moment.unitOfTime.DurationConstructor,
) => {
  return moment().subtract(x, unit);
};

export const humanizeTime = (time: string) => {
  return moment(new Date(time)).fromNow();
};

export const getBrwoserTimezone = () => {
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return browserTimezone === 'Asia/Calcutta' ? 'Asia/Kolkata' : browserTimezone;
};
export const isOutOfOffice = (startDate: string, endDate: string) => {
  const start = moment(startDate);
  const end = moment(endDate);
  if (!start || !endDate) {
    return false;
  }
  const currentDate = moment();
  return currentDate.isBetween(start, end, null, '[]'); // '[]' includes both start and end dates
};

export const getTimezoneNameFromIANA = (
  iana: string,
  dateString?: string,
): string => {
  const timezone = timezones.find((tz) => tz.iana == iana);
  if (!timezone) return iana;
  try {
    const date = (dateString && moment.tz(dateString, iana)) || moment.tz(iana);
    const offset = date.isDST() ? timezone.DST_offset : timezone.raw_offset;
    return `(GMT${offset.replace(/\s/g, '')}) ${timezone.display_name} - ${
      timezone.iana.split('/')[1]
    }`.replace(/_/g, ' ');
  } catch (e) {
    return iana;
  }
};

export const hasDatePassed = (date: string) => {
  try {
    return new Date(date) < new Date(Date.now());
  } catch (exception) {
    // If date is invalid, assume that it has passed.
    console.log(exception);
    return true;
  }
};

export const convertTimezone = (
  sourceDate: Date,
  sourceTime: string,
  sourceTimezone: string,
  targetTimezone: string,
) => {
  try {
    const sourceDatetime = momentTimezone.tz(
      moment(sourceDate).format('YYYY-MM-DD') + ' ' + sourceTime,
      'YYYY-MM-DD hh:mm a',
      sourceTimezone,
    );
    const targetDatetime = sourceDatetime.clone().tz(targetTimezone);

    const targetDate = targetDatetime.format('YYYY-MM-DD');
    const targetTime = targetDatetime.format('hh:mm a');
    return { targetDate, targetTime };
  } catch (e) {
    console.log(e);
    return { targetDate: '', targetTime: '' };
  }
};

export const getTimeInScheduleFormat = (
  sourceDate: Date,
  sourceTime: string,
  sourceTimezone: string,
  targetTimezone: string,
) => {
  const { targetDate, targetTime } = convertTimezone(
    sourceDate,
    sourceTime,
    sourceTimezone,
    targetTimezone,
  );
  return `${moment(targetDate).format('ddd, MMM DD')} at ${targetTime}`;
};

export const getRemainingTime = (t1: string) => {
  return moment(t1, 'YYYY-MM-DD').diff(moment(), 'days') + 1;
};

// Returns time from now till given date in human friendly format
export const getTimeFromNow = (dateStr: string, timezone: string) => {
  const finalDate = moment.tz(dateStr, timezone);
  const currentDate = moment().tz(timezone);
  let monthsLeft = 0;
  let weeksLeft = 0;
  let daysLeft = 0;
  let hoursLeft = 0;
  let minutesLeft = 0;
  let secondsLeft = 0;

  monthsLeft = finalDate.diff(currentDate, 'months');
  finalDate.subtract(monthsLeft, 'month');

  // Show weeks only if time left is < 1 month
  if (monthsLeft <= 0) {
    weeksLeft = finalDate.diff(currentDate, 'weeks');
    finalDate.subtract(weeksLeft, 'week');
  }

  daysLeft = finalDate.diff(currentDate, 'days');
  finalDate.subtract(daysLeft, 'day');

  // Show hours and minutes if time left is less than a day
  if (monthsLeft <= 0 && weeksLeft <= 0 && daysLeft <= 0) {
    hoursLeft = finalDate.diff(currentDate, 'hours');
    finalDate.subtract(hoursLeft, 'hour');
    if (hoursLeft <= 0) {
      minutesLeft = finalDate.diff(currentDate, 'minutes');
      finalDate.subtract(minutesLeft, 'minute');
      if (minutesLeft <= 0) {
        secondsLeft = finalDate.diff(currentDate, 'seconds');
      }
    } else {
      hoursLeft += finalDate.diff(currentDate, 'minutes') / 60.0;
      hoursLeft = Math.round(hoursLeft);
    }
  } else {
    daysLeft += finalDate.diff(currentDate, 'hours') / 24.0;
    daysLeft = Math.round(daysLeft);
  }

  return [
    monthsLeft > 0
      ? `${monthsLeft} ${monthsLeft === 1 ? 'month' : 'months'}`
      : null,
    weeksLeft > 0 ? `${weeksLeft} ${weeksLeft === 1 ? 'week' : 'weeks'}` : null,
    daysLeft > 0 ? `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}` : null,
    hoursLeft > 0 ? `${hoursLeft} ${hoursLeft === 1 ? 'hour' : 'hours'}` : null,
    minutesLeft > 0
      ? `${minutesLeft} ${minutesLeft === 1 ? 'minute' : 'minutes'}`
      : null,
    secondsLeft > 0
      ? `${secondsLeft} ${secondsLeft === 1 ? 'second' : 'seconds'}`
      : null,
  ]
    .filter(Boolean)
    .join(', ');
};

export const getNow = () => moment().toDate();

export const nDaysFromNow = (n = 1) => moment().add(n, 'days').toDate();

export const groupByDate: <T>(
  items: T[],
  prefferedKey?: string,
) => {
  today: T[];
  yesterday: T[];
  older: T[];
  length: number;
} = (items, prefferedKey = 'updatedAt') => {
  console.log(items);
  const today = moment().startOf('day');
  const yesterday = moment().subtract(1, 'days').startOf('day');

  const groupedItems: any = {
    today: [],
    yesterday: [],
    older: [],
    length: items.length,
  };

  items.forEach((item) => {
    const updatedAt = moment((item as any)[prefferedKey]);
    if (updatedAt.isSame(today, 'd')) {
      groupedItems.today.push(item);
    } else if (updatedAt.isSame(yesterday, 'd')) {
      groupedItems.yesterday.push(item);
    } else {
      groupedItems.older.push(item);
    }
  });

  return groupedItems;
};
