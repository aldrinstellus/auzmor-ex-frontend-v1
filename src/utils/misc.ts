import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'components/../../tailwind.config.js';

export const twConfig: any = resolveConfig(tailwindConfig);

export const getInitials = (name: string) => {
  return name
    .match(/(^\S\S?|\s\S)?/g)!
    .map((v) => v.trim())
    .join('')
    .match(/(^\S|\S$)?/g)!
    .join('')
    .toLocaleUpperCase();
};

export const isValidUrl = (url: string) => {
  const urlPattern =
    /((https?|ftp):\/\/)?([a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}|[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5})(:[0-9]{1,5})?(\/.*)?/gi;
  return urlPattern.test(url);
};

export const redirectWithToken = (redirectUrl: string, token: string) => {
  if (process.env.NODE_ENV === 'development') {
    window.location.replace(`http://localhost:3000/feed?accessToken=${token}`);
  } else {
    window.location.replace(`${redirectUrl}/feed?accessToken=${token}`);
  }
};
