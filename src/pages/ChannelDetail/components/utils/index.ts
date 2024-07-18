export const isTrim = (str: any, maxLength = 26) => {
  if (!str) return null;
  return str.trim().length > maxLength
    ? str.substring(0, maxLength) + '...'
    : str.trim();
};
