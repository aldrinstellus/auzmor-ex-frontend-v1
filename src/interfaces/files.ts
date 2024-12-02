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

export type Directory = { id: string; name: 'string' };

export type Doc = {
  id: string;
  name: string;
  size: string;
  mimeType: string;
  parentId: string | null;
  externalId: string;
  externalUrl: string;
  isFolder: boolean;
  downloadable: boolean;
  fileType: string;
  ownerName: string;
  ownerImage?: string;
  path: string;
  externalCreatedAt: string;
  externalUpdatedAt: string;
  syncedAt: string;
  createdAt: string;
  updatedAt: string;
  fileThumbnailUrl: string;
};

export type GetDirectoriesResponse = {
  message: string;
  code: number;
  result: {
    data: Array<Directory>;
  };
};
export type GetFilesResponse = {
  message: string;
  code: number;
  result: {
    data: Array<Doc>;
  };
};
