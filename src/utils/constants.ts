// I found this regex here - https://github.com/manishsaraan/email-validator/blob/master/index.js
export const EMAIL_REGEX =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export const TOAST_AUTOCLOSE_TIME = 2000;

// Found this regex here - https://stackoverflow.com/a/68780191
export const URL_REGEX =
  /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/;

// Found this regex here - https://stackoverflow.com/questions/16369642/javascript-how-to-use-a-regular-expression-to-remove-blank-lines-from-a-string
export const EMPTY_REGEX = /^\s*$(?:\r\n?|\n){3,}/gm;

export const BRANDING = {
  primaryColor: '#119dbd',
  secondaryColor: '#F97316',
  pageTitle: 'Page Title',
  favicon: 'https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
  loginConfig: {
    layout: 'RIGHT', // LEFT | RIGHT | CENTER Default: RIGHT
    backgroundType: 'IMAGE', // IMAGE | VIDEO | COLOR  Default: IMAGE
    image:
      'https://images.hdqwalls.com/download/reindeer-silhouette-grazing-in-the-field-4n-3840x2160.jpg',
    video:
      'https://media.istockphoto.com/id/1222958227/video/big-sur-bixby-bridge-route-1-california-state-route-atlantic-ocean-aerial-drone.mp4?s=mp4-640x640-is&k=20&c=UslDy-nOXnXWubMOzXV3Ya3p7xMJbuA2W71X-oyNArM=',
    text: 'Welcome to auzmor office',
    color: '#123456',
  },
};

export const MB = 1 * 1024 * 1024; // 1 MB
export const KB = 1 * 1024; // 1 KB

export const HEX_REGEX = /^#([0-9a-f]{3}){1,2}$/i;
