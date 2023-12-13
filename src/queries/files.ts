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

export enum EntityType {
  Post = 'POST',
  Comment = 'COMMENT',
  UserProfileImage = 'USER_PROFILE_IMAGE',
  UserCoverImage = 'USER_COVER_IMAGE',
  OrgLogo = 'ORG_LOGO',
  OrgLoginImage = 'ORG_LOGIN_IMAGE',
  OrgFavicon = 'ORG_FAVICON',
  OrgLoginVideo = 'ORG_LOGIN_VIDEO',
  AppIcon = 'APP_ICON',
  UserImport = 'DOCUMENT',
}
