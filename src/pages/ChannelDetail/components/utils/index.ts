export const isTrim = (str: any) => {
  if (!str) return null;
  return str.trim().length > 26 ? str.substring(0, 26) + '...' : str.trim();
};
