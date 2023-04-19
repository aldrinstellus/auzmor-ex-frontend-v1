export const setItem = (key: string, value: string) => {
  localStorage.setItem(key, value); // TBD
};

export const getItem = (key: string, defaultValue = '') => {
  return localStorage.getItem(key) || defaultValue;
};

export const removeAllItems = () => {
  localStorage.clear();
};
