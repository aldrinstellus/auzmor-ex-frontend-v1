// I found this regex here - https://github.com/manishsaraan/email-validator/blob/master/index.js
export const EMAIL_REGEX =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export const TOAST_AUTOCLOSE_TIME = 5000;

// Found this regex here - https://stackoverflow.com/a/68780191
export const URL_REGEX =
  /^(https?|ftp):\/\/(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)((\/[^\s]*)?)$/;

// Found this regex here - https://stackoverflow.com/questions/16369642/javascript-how-to-use-a-regular-expression-to-remove-blank-lines-from-a-string
export const EMPTY_REGEX = /^\s*$(?:\r\n?|\n){3,}/gm;

export const MB = 1 * 1024 * 1024; // 1 MB
export const KB = 1 * 1024; // 1 KB

export const HEX_REGEX = /^#([0-9a-f]{6})$/i;

export const SESSION_ID = 'auz-session-id';

export const IS_PROD = process.env.REACT_APP_ENV === 'PRODUCTION';
