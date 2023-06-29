export const setItem = (key: string, value: string) => {
  localStorage.setItem(key, value); // TBD
};

export const getItem = (key: string, defaultValue = '') => {
  return localStorage.getItem(key) || defaultValue;
};

export const removeItem = (key: string) => {
  return localStorage.removeItem(key);
};

export const removeAllItems = () => {
  localStorage.clear();
};
