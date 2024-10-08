// I found this regex here - https://github.com/manishsaraan/email-validator/blob/master/index.js
export const EMAIL_REGEX =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export const TOAST_AUTOCLOSE_TIME = 5000;

// Found this regex here - https://stackoverflow.com/questions/16369642/javascript-how-to-use-a-regular-expression-to-remove-blank-lines-from-a-string
export const EMPTY_REGEX = /^\s*$(?:\r\n?|\n){3,}/gm;

export const MB = 1 * 1024 * 1024; // 1 MB
export const KB = 1 * 1024; // 1 KB

export const HEX_REGEX = /^#([0-9a-f]{6})$/i;

export const SESSION_ID = 'auz-session-id';

export const IS_PROD = process.env.REACT_APP_ENV === 'PRODUCTION';

export const validImageTypes = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/avif',
  'image/bmp',
  'image/gif',
  'image/svg+xml',
  'image/tiff',
  'image/webp',
  'image/x-icon',
];

export const validVideoTypes = [
  'video/x-msvideo',
  'video/avi',
  'video/mp4',
  'video/mpeg',
  'video/ogg',
  'video/mp2t',
  'video/webm',
  'video/3gpp',
  'video/3gpp2',
];

export const validDocumentFileTypes = [
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];
