import timezones from 'utils/timezones.json';
import { OptionType } from '../components/SelectTimezoneScreen';

export const getDefaultTimezoneOption = (): OptionType => {
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezone = timezones.find((tz) => tz.iana.includes(browserTimezone));
  return {
    label: timezone?.timezoneName || '',
    value: timezone?.iana || [],
  };
};
