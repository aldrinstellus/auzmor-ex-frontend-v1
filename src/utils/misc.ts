export const getInitials = (name: string) => {
  return name
    .match(/(^\S\S?|\s\S)?/g)!
    .map((v) => v.trim())
    .join('')
    .match(/(^\S|\S$)?/g)!
    .join('')
    .toLocaleUpperCase();
};

export const redirectWithToken = (redirectUrl: string, token: string) => {
  if (process.env.NODE_ENV === 'development') {
    window.location.replace(`http://localhost:3000?accessToken=${token}`);
  } else {
    window.location.replace(`${redirectUrl}?accessToken=${token}`);
  }
};
