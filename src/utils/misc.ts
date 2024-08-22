import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'components/../../tailwind.config.js';
import { IMedia } from 'contexts/CreatePostContext';
import { validDocumentFileTypes, validImageTypes } from 'queries/files';
import { getItem, removeItem } from './persist';
import { DeltaStatic } from 'quill';
import {
  ITransformedOp,
  TransformedQuillDelta,
} from 'components/PostBuilder/components/RichTextEditor/mentions/types';
import DeactivatedCoverImage from 'images/deactivatedCoverPhoto.png';
import DefaultCoverImage from 'images/png/CoverImage.png';
import capitalize from 'lodash/capitalize';
import DeactivatedUser from 'images/DeactivatedUser.png';
import { EditUserSection, UserStatus } from 'queries/users';
import { MouseEvent, MouseEventHandler } from 'react';
import { ILocation } from 'queries/location';
import { IDepartment } from 'queries/department';
import { IDesignation } from 'queries/designation';
import { IPost } from 'queries/post';
import moment from 'moment';
import {
  EMPTY_REGEX,
  HEX_REGEX,
  patternHTTP,
  patternWithoutHTTP,
  SESSION_ID,
} from './constants';

export const twConfig: any = resolveConfig(tailwindConfig);

export const userChannel = new BroadcastChannel('user');

export const humanFileSize = (size: number) => {
  if (size === 0) return ' ';
  const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (
    +(size / Math.pow(1024, i)).toFixed(0) * 1 +
    ' ' +
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  );
};
export const getValidURL = (str: any) => {
  if (patternHTTP.test(str)) {
    return str;
  }
  if (patternWithoutHTTP.test(str)) {
    return `https://${str}`;
  }
  return null;
};

export const getInitials = (name: string) => {
  return name
    .match(/(^\S\S?|\s\S)?/g)!
    .map((v) => v.trim())
    .join('')
    .match(/(^\S|\S$)?/g)!
    .join('')
    .toLocaleUpperCase();
};

export const getProfileImage = (user: any, preferredKey = 'small') => {
  if (user?.status !== UserStatus.Inactive) {
    return user?.profileImage?.[preferredKey] || user?.profileImage?.original;
  }
  return DeactivatedUser;
};

export const getAvatarColor = (user: any) => {
  if (user?.status !== UserStatus.Inactive) {
    return '#343434';
  }
  return '#ffffff';
};

export const getCoverImage = (user: any) => {
  if (user?.status === UserStatus.Inactive) {
    return DeactivatedCoverImage;
  }
  return user?.coverImage?.original || DefaultCoverImage;
};
export const getChannelCoverImage = (channelData: any) => {
  return (
    channelData?.banner?.original || require('images/channelDefaultHero.png')
  );
};
export const getChannelLogoImage = (channelData: any) => {
  return (
    channelData?.displayImage?.original ||
    require('images/ChannelCover/Logo1.png')
  );
};

export const getFullName = (user: any) => {
  if (user?.status === UserStatus.Inactive) {
    return `${user?.fullName || user?.email || user?.workEmail} (deactivated)`;
  }
  return user?.fullName;
};

export const getEditSection = (
  userId: any,
  loggedInUserId: any,
  isAdmin: any,
) => {
  return userId === loggedInUserId || isAdmin ? EditUserSection.PROFILE : '';
};

export const isValidUrl = (url: string) => {
  const urlPattern =
    /((https?|ftp):\/\/)?([a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}|[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5})(:[0-9]{1,5})?(\/.*)?/gi;
  return urlPattern.test(url);
};

interface IRedirect {
  redirectUrl?: string;
  token?: string;
  showOnboard?: boolean;
}

// Deprecated. Use navigateWithToken function instead
export const redirectWithToken = async ({
  redirectUrl,
  token,
  showOnboard = false,
}: IRedirect) => {
  let url = getItem('redirect_post_login_to') || '/feed';
  if (url === '/') url = '/feed';
  removeItem('redirect_post_login_to');
  if (token) {
    url = `${url}?accessToken=${token}`;
  }
  if (showOnboard) {
    url += '&showOnboard=true';
  }
  if (process.env.NODE_ENV === 'development') {
    window.location.replace(`http://localhost:3000${url}`);
  } else {
    window.location.replace(`${redirectUrl}${url}`);
  }
};

export const getBlobUrl = (file: File) => {
  return URL.createObjectURL(file);
};

export const getType = (type: string) => {
  if (validImageTypes.indexOf(type) > -1) {
    return 'IMAGE';
  }
  if (validDocumentFileTypes.indexOf(type) > -1) {
    return 'DOCUMENT';
  }
  return 'VIDEO';
};

export const getMediaObj = (files: File[]): IMedia[] => {
  return files.map(
    (file: File) =>
      ({
        altText: 'No image',
        blurhash: '',
        contentType: file.type,
        id: '',
        isDeleted: false,
        isPublic: false,
        name: file.name,
        original: getBlobUrl(file),
        size: file.size.toString(),
        thumbnailUrl: '',
        type: getType(file.type),
      } as IMedia),
  );
};

export const isRegularPost = (
  post: IPost | undefined,
  currentDate: string,
  isAdmin: boolean,
) => {
  if (!post?.announcement?.end) return true;
  if (currentDate > post.announcement.end) return true;
  if (!isAdmin && post?.acknowledged) return true;
  return false;
};

export const isVideo = (type: string) => {
  if (validImageTypes.indexOf(type) === -1) {
    return true;
  }
  return false;
};

export const readFirstAxiosError = (err: any) => {
  if (err.response) {
    return err?.response?.data?.errors[0]?.message;
  }
  return 'Something went wrong!';
};

export const getSubDomain = (host: string) => {
  const domains = host.split('.');
  if (domains.length >= 4) {
    return domains[0];
  } else {
    return '';
  }
};

export const removeElementsByClass = (className: string) => {
  const elements = document.getElementsByClassName(className);
  while (elements.length > 0 && elements && elements[0].parentNode) {
    elements[0].parentNode.removeChild(elements[0]);
  }
};

// export const downloadURI = (uri: string, name: string) => {
//   const link = document.createElement('a');
//   link.download = name;
//   link.href = uri;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

export const downloadURI = (uri: string, name: string) => {
  const link = document.createElement('a');
  link.href = uri;
  link.download = name;
  document.body.appendChild(link);
  link.onclick = function () {
    setTimeout(function () {
      document.body.removeChild(link);
    }, 100);
  };
  link.click();
};

export const BlobToFile = (
  blob: Blob,
  fileName: string,
  mimeType?: string,
): File => {
  const file = new File([blob], fileName, { type: mimeType || 'image/jpeg' });
  return file;
};

export const isFiltersEmpty = <T extends Record<string, any>>(
  filters: T,
): Partial<T> => {
  const filteredValues: Partial<T> = {};
  for (const key in filters) {
    const value = filters[key];
    if (value !== '' && value !== null && value !== undefined) {
      filteredValues[key] = value;
    }
  }
  return filteredValues;
};

export const clearInputValue: MouseEventHandler<HTMLElement> = (
  event: MouseEvent<HTMLInputElement>,
) => {
  const element = event.target as HTMLInputElement;
  element.value = '';
};

export const canPerform = (checkFor?: string[], allPermissions?: string[]) => {
  if (allPermissions?.length && checkFor?.length) {
    return allPermissions.some((perm) => checkFor.includes(perm));
  }
  return false;
};

export const isSubset = (subset?: string[], set?: string[]) => {
  if (set && subset) {
    return subset.every((ele) => set.includes(ele));
  }
  return false;
};

export const hideEmojiPalette = (id = 'emoji-close-div') => {
  const ele = document.getElementById(id);
  ele?.click();
};

export const hideMentionHashtagPalette = () => {
  try {
    const mentionElements = document.getElementsByClassName(
      'ql-mention-list-container',
    );
    for (const ele of mentionElements) {
      ele.remove();
    }
    const hashtagElements = document.getElementsByClassName(
      'ql-hash-list-container',
    );
    for (const ele of hashtagElements) {
      ele.remove();
    }
  } catch (e) {
    console.log(e);
  }
};

export const getNouns = (label: string, count: number) => {
  if (count === 1) {
    return label;
  } else {
    return label + 's';
  }
};

export const operatorXOR = (...args: boolean[]): boolean => {
  const value = args.reduce(
    (accumulator, currentValue) => accumulator !== currentValue,
  );
  return value;
};

export const transformContent = (quillDelta?: DeltaStatic) => {
  const transformedQuillDelta: TransformedQuillDelta = { ops: [] };
  for (let i = 0; i < (quillDelta?.ops?.length || 0); i += 1) {
    const op = quillDelta?.ops ? quillDelta?.ops[i] : {};
    const transformedOp: any = { ...op };
    if (
      typeof op.insert === 'object' &&
      op.insert.mention &&
      op.insert.mention.denotationChar === '#'
    ) {
      transformedOp.insert = { hashtag: { ...op.insert.mention } };
    }
    transformedQuillDelta.ops.push(transformedOp);
  }

  transformedQuillDelta.ops = transformedList(transformedQuillDelta.ops).ops;

  return transformedQuillDelta;
};

export const transformedList = (ops: any) => {
  const transformedData: TransformedQuillDelta = { ops: [] };
  let listItem: Array<any> = [];
  for (let i = 0; i < (ops?.length || 0); i += 1) {
    if (ops[i]?.attributes?.list) {
      const listOp = {
        attributes: { list: ops[i].attributes.list },
        insert: [[...listItem]],
      };
      listItem = [];
      let update = false;
      let j = i + 1;
      for (; j < ops.length; j += 1) {
        if (typeof ops[j].insert === 'object') {
          listItem.push(ops[j]);
        } else {
          if (ops[j].insert.includes('\n') && !ops[j]?.attributes?.list) {
            transformedData.ops = [...transformedData.ops, listOp, ops[j]];
            listItem = [];
            i = j;
            update = false;
            break;
          } else if (ops[j].insert.includes('\n') && ops[j].attributes.list) {
            listOp.insert.push([...listItem]);
            listItem = [];
            update = true;
          } else if (!ops[j].insert.includes('\n')) {
            listItem.push(ops[j]);
          }
        }
      }
      if (update) {
        transformedData.ops = [...transformedData.ops, listOp];
        i = j;
      }
    } else {
      if (typeof ops[i].insert === 'object') {
        listItem.push(ops[i]);
      } else if (typeof ops[i].insert === 'string') {
        if (ops[i].insert.includes('\n')) {
          transformedData.ops = [...transformedData.ops, ...listItem, ops[i]];
          listItem = [];
        } else {
          listItem.push(ops[i]);
        }
      }
    }
  }
  return transformedData;
};

// Converting mention key to hashtag (if denotation is #)
export const quillHashtagConversion = (
  quillDelta: DeltaStatic | undefined,
): Record<string, any> | undefined => {
  const transformedQuillDelta: TransformedQuillDelta = { ops: [] };
  quillDelta?.ops?.forEach((op: any) => {
    const transformedOp: ITransformedOp = { ...op };
    if (
      typeof op.insert === 'object' &&
      op.insert.mention &&
      op.insert.mention.denotationChar === '#'
    ) {
      transformedOp.insert = { hashtag: { ...op.insert.mention } };
    } else {
      transformedOp.insert = op.insert;
    }
    transformedQuillDelta.ops.push(transformedOp);
  });
  return transformedQuillDelta;
};

export const titleCase = (input: string) => {
  return input
    .split(' ')
    .map((i) => capitalize(i))
    .join(' ');
};

export const enumToTitleCase = (input: string) => {
  return titleCase(input.replaceAll('_', ' '));
};

export const extractFirstWord = (str: string) => {
  const words = str.trim().split(' ');
  if (words.length > 0) {
    return words[0];
  }
  return '';
};

export const padZero = (num: number, places: number) =>
  String(num).padStart(places, '0');

export const convertUpperCaseToPascalCase = (value: string) => {
  if (!value) {
    return '';
  }
  return value[0] + value.substring(1, value.length).toLowerCase();
};

type Chainable<T> = {
  value: () => T;
  keyBy: (key: string) => Chainable<{ [key: string]: any }>;
};

export const chain = <T>(input: T): Chainable<T> => ({
  value: () => input,
  keyBy: (key: string) =>
    chain(
      (input as any[]).reduce((acc: { [key: string]: any }, item: any) => {
        acc[item[key]] = item;
        return acc;
      }, {}),
    ),
});

export const isEmptyEditor = (content: string, ops: any) => {
  for (const op of ops) {
    if (op.insert && op.insert.emoji) {
      return false;
    }
  }
  if (content === '\n' || content === '') {
    return true;
  }
  return false;
};

export const removeEmptyLines = (content: {
  text: string;
  html: string;
  editor: any;
}) => {
  for (const op of content.editor.ops) {
    if (op.insert) {
      try {
        // replace more than 2 empty lines with 2 empty lines
        op.insert = op.insert?.replaceAll(EMPTY_REGEX, '\n\n');
      } catch (e) {}
    }
  }

  // replace more than 2 empty lines with 2 empty lines
  content.html = content.html.replaceAll(
    /(<p><br><\/p>){3,}/gm,
    '<p><br/></p><p><br/></p>',
  );

  // replace more than 2 empty lines with 2 empty lines
  content.text = content.text?.replaceAll(EMPTY_REGEX, '\n\n');

  return content;
};

export const getWorkLocation = (user: any, fallbackValue: string) => {
  let workLocation: ILocation = { locationId: '', name: fallbackValue };
  if (typeof user?.workLocation === 'string') {
    workLocation.name = user?.workLocation;
  } else if (typeof user?.workLocation === 'object') {
    workLocation = user?.workLocation;
  } else if (typeof user?.location === 'string') {
    workLocation.name = user?.location;
  } else if (typeof user?.location === 'object') {
    workLocation = user?.location;
  }
  return workLocation;
};

export const getDesignation = (user: any, fallbackValue: string) => {
  let designation: IDesignation = {
    designationId: '',
    name: fallbackValue,
  };
  if (typeof user?.designation === 'string') {
    designation.name = user?.designation;
  } else if (typeof user?.designation === 'object') {
    designation = user?.designation;
  } else if (typeof user?.jobTitle === 'object') {
    designation = user?.jobTitle;
  }
  return designation;
};

export const getDepartment = (user: any, fallbackValue: string) => {
  let department: IDepartment = {
    departmentId: '',
    name: fallbackValue,
  };
  if (typeof user?.department === 'string') {
    department.name = user?.department;
  } else if (typeof user?.department === 'object') {
    department = user?.department;
  }
  return department;
};

export const getUserCardTooltipProps = (user: any, fallbackValue: string) => {
  const workLocation = getWorkLocation(user, fallbackValue);
  const designation = getDesignation(user, fallbackValue);
  const department = getDepartment(user, fallbackValue);

  return {
    id: user?.id || user?.userId || '',
    fullName: user?.fullName || user?.userName || user?.name || fallbackValue,
    workEmail: user?.email || user?.workEmail || fallbackValue,
    email: user?.email || user?.workEmail || fallbackValue,
    workLocation: workLocation,
    designation: designation,
    department: department,
    profileImage: user?.profileImage,
    status: user?.status,
  };
};

export const isNewEntity = (
  createdAt?: string,
  limit = -1000 * 60 * 60 * 24 * 7,
) => {
  if (createdAt) {
    const duration = moment.duration(moment(createdAt).diff(moment()));
    return duration.asMilliseconds() > limit;
  }
  return false;
};

export const mapRanges = (
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number,
  value: number,
) => {
  return newMin + ((newMax - newMin) / (oldMax - oldMin)) * (value - oldMin);
};

export const getMimeType = (fileName: string): string | undefined => {
  const extensionIndex = fileName.lastIndexOf('.');
  if (extensionIndex === -1) {
    return undefined;
  }

  const extension = fileName.substring(extensionIndex + 1);
  const mimeTypes: { [key: string]: string } = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    gif: 'image/gif',
    pdf: 'application/pdf',
    txt: 'text/plain',
    mp4: 'video/mp4',
    webm: 'video/webm',
    // Add more extensions and MIME types as needed
  };

  return mimeTypes[extension.toLowerCase()];
};

export const isDark = (hexcode: string) => {
  if (!(!!hexcode && HEX_REGEX.test(hexcode.toLocaleUpperCase()))) {
    return false;
  }

  const hex = hexcode.replace('#', '');
  const R = parseInt(hex.slice(0, 2), 16);
  const G = parseInt(hex.slice(2, 4), 16);
  const B = parseInt(hex.slice(4, 6), 16);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B < 255 / 2;
};

export const insertAt = (str: string, index: number, insertStr: string) => {
  return `${str.slice(0, index)}${insertStr}${str.slice(index)}`;
};

export const getLearnUrl = () => {
  const subdomain = getSubDomain(window.location.host);
  return `${insertAt(
    process.env.REACT_APP_LEARN_BASE_URL || 'https://learn.auzmor.com',
    'https://'.length,
    subdomain ? `${subdomain}.` : '',
  )}`;
};

export const getCookieValue = (key: string) => {
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${key}=`))
    ?.split('=')[1];
  return cookieValue;
};

export const deleteCookie = (key: string) => {
  document.cookie = ` ${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.auzmor.com;`;
};

export const getCookieParam = (key = SESSION_ID) => {
  if (process.env.REACT_APP_ENV === 'PRODUCTION') {
    return key;
  }
  const [hostname] =
    process.env.REACT_APP_LEARN_BASE_URL?.replace('https://', '').split('.') ||
    [];
  return `${hostname}-${key}`;
};

export const getSizeInMB: (sizeInBytes: number) => number = (sizeInBytes) => {
  return sizeInBytes / 8 / 1024;
};
