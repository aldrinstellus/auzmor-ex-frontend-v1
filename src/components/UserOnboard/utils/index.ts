import { OptionType } from 'components/SingleSelect';
import timezones from 'utils/timezones.json';

export const getDefaultTimezoneOption = (): OptionType => {
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezone = timezones.find((tz) => tz.utc.includes(browserTimezone));
  return {
    label: timezone?.text || '',
    value: timezone?.abbr || '',
  };
};
