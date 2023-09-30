import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'components/../../tailwind.config.js';
import { IMedia } from 'contexts/CreatePostContext';
import { validImageTypes } from 'queries/files';
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
import { EditUserSection, UserRole, UserStatus } from 'queries/users';
import { MouseEvent, MouseEventHandler } from 'react';
import { ILocation } from 'queries/location';
import { IDesignation } from 'queries/designation';
import { IPost } from 'queries/post';
import moment from 'moment';

export const twConfig: any = resolveConfig(tailwindConfig);

export const userChannel = new BroadcastChannel('user');

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
  role: any,
) => {
  return userId === loggedInUserId
    ? EditUserSection.ABOUT
    : isAdmin && role === UserRole.Member
    ? EditUserSection.PROFESSIONAL
    : '';
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

export const redirectWithToken = ({
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
  return validImageTypes.indexOf(type) > -1 ? 'IMAGE' : 'VIDEO';
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

export const BlobToFile = (blob: Blob, fileName: string): File => {
  const file = new File([blob], fileName, { type: 'image/jpeg' });
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

export const getUserCardTooltipProps = (user: any) => {
  let workLocation: ILocation = { locationId: '', name: 'Field not specified' };
  if (typeof user?.workLocation === 'string') {
    workLocation.name = user?.workLocation;
  } else if (typeof user?.workLocation === 'object') {
    workLocation = user?.workLocation;
  }

  let designation: IDesignation = {
    designationId: '',
    name: 'Field not specified',
  };
  if (typeof user?.designation === 'string') {
    designation.name = user?.designation;
  } else if (typeof user?.designation === 'object') {
    designation = user?.designation;
  }
  return {
    id: user?.id || user?.userId || '',
    fullName:
      user?.fullName || user?.userName || user?.name || 'Field not specified',
    workEmail: user?.email || user?.workEmail || 'Field not specified',
    workLocation: workLocation,
    designation: designation,
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
