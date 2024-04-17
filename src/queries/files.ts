import { IUser } from 'contexts/AuthContext';

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

export type DocType = {
  id?: string;
  remote_id?: string;
  created_at?: string;
  modified_at?: string;
  createdBy?: IUser;
  name: string;
  fileUrl: string;
  fileThumbnailUrl: string;
  size: number;
  mimeType: string;
  description?: string;
  folder?: string;
  permissions?: Array<Record<string, any>>;
  drive?: string;
  remote_created_at?: string;
  remote_updated_at?: string;
  remote_was_deleted?: boolean;
  field_mappings?: any;
  remote_data?: any;
};
