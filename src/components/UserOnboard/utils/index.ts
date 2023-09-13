import { OptionType } from '../components/SelectTimezoneScreen';
import { getBrwoserTimezone, getTimezoneNameFromIANA } from 'utils/time';

export const getDefaultTimezoneOption = (): OptionType => {
  const browserTimezone = getBrwoserTimezone();
  const timezoneName = getTimezoneNameFromIANA(browserTimezone);
  return {
    label: timezoneName || '',
    value: browserTimezone || '',
  };
};
