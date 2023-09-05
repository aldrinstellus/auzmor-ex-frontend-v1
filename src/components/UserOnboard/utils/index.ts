import { OptionType } from '../components/SelectTimezoneScreen';
import { getTimezoneNameFromIANA } from 'utils/time';

export const getDefaultTimezoneOption = (): OptionType => {
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezoneName = getTimezoneNameFromIANA(browserTimezone);
  return {
    label: timezoneName || '',
    value: browserTimezone || '',
  };
};
