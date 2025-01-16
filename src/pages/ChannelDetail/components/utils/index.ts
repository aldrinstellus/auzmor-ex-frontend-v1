export const isTrim = (str: any, maxLength = 26) => {
  if (!str) return null;
  return str.trim().length > maxLength
    ? str.substring(0, maxLength) + '...'
    : str.trim();
};

export const trimExtension = (name: string) => {
  const names = name.split('.');
  if (names.length === 2) {
    return names[0];
  } else if (names.length > 2) {
    return names.slice(0, -1).join('.');
  }
  return name;
};

export const getExtension = (name: string) => {
  const names = name.split('.');
  if (names.length > 1) {
    return `.${names.at(-1)}`;
  }
  return name;
};
