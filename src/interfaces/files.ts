import { IUser } from 'contexts/AuthContext';

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
  modifiedAt?: string;
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
