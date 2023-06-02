import moment from 'moment';
import timezones from './timezones.json';

export const afterXUnit = (
  x: number,
  unit: moment.unitOfTime.DurationConstructor,
) => {
  return moment().add(x, unit);
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
