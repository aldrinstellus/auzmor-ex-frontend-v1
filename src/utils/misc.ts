import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'components/../../tailwind.config.js';
import { IMedia } from 'contexts/CreatePostContext';
import { validImageTypes } from 'queries/files';
import { getItem, removeItem } from './persist';
import { EMAIL_REGEX } from './constants';

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

export const isSubset = (subset?: string[], set?: string[]) => {
  if (set && subset) {
    return subset.every((ele) => set.includes(ele));
  }
  return false;
};
