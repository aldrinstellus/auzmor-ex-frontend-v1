import moment from 'moment';
import timezones from './timezones.json';

export const TIME_PATTERN = /^(0[0-9]|1[0-2]):[0-5][0-9] (am|pm)$/; // it will strictly follow "HH:MM am/pm, HH-> [00-12], MM-> [00->59]"

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

export const getTimezoneNameFromIANA = (iana: string): string => {
  const timezoneName = timezones.find((tz) =>
    tz.iana.includes(iana),
  )?.timezoneName;
  return timezoneName || iana;
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
