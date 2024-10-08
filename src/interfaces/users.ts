import { IDepartment } from './departments';
import { IDesignation } from './designations';
import { ILocation } from './locations';

export type User = {
  id: string;
  name: string;
  profileImage: {
    original: string;
  };
};

export interface IProfileImage {
  blurHash: string;
  id: string;
  original: string;
}

export interface INotificationSettings {
  post?: {
    app?: Record<string, boolean>;
    email?: Record<string, boolean>;
  };
  mentions?: {
    app?: Record<string, boolean>;
    email?: Record<string, boolean>;
  };
}

export interface IUserSettings {
  notificationSettings: INotificationSettings;
}

export enum UserRole {
  PrimaryAdmin = 'PRIMARYADMIN',
  Admin = 'ADMIN',
  Manager = 'MANAGER',
  Learner = 'LEARNER',
  Superadmin = 'SUPERADMIN',
  Member = 'MEMBER',
}

export enum UserStatus {
  Created = 'CREATED',
  Invited = 'INVITED',
  Attempted = 'ATTEMPTED',
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Deleted = 'DELETED',
  Failed = 'FAILED',
  Pending = 'PENDING',
}

export enum EditUserSection {
  ABOUT = 'about',
  PROFESSIONAL = 'professional',
  PROFILE = 'profile',
}

export interface ICreatedBy {
  department?: string;
  designation?: string;
  name?: string;
  fullName?: string;
  profileImage: IProfileImage;
  status?: string;
  userId?: string;
  workLocation?: string;
  email?: string;
}

export interface IGetUser {
  userId?: string;
  id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  primaryEmail?: string;
  preferredName?: string;
  org?: {
    id: string;
    name?: string;
    domain: string;
  };
  workEmail?: string;
  profileImage?: { blurHash: string; id: string; original: string };
  role?: UserRole;
  flags?: {
    isDeactivated: boolean;
    isReported: boolean;
  };
  createdAt?: string;
  status?: string;
  timeZone?: string;
  workLocation?: ILocation;
  department?: IDepartment;
  designation?: IDesignation;
  coverImage?: { blurHash: string; id: string; original: string };
  freezeEdit?: {
    department?: boolean;
    designation?: boolean;
    firstName?: boolean;
    fullName?: boolean;
    joinDate?: boolean;
    lastName?: boolean;
    manager?: boolean;
    middleName?: boolean;
  };
  manager?: {
    designation: string;
    fullName: string;
    profileImage: {
      id: string;
      original: string;
      blurHash: string;
    };
    userId: string;
    workLocation: string;
    status: string;
    department: string;
  };
  notificationSettings?: INotificationSettings;
  permissions?: string[];
  workPhone?: string | null;
  isPresent?: boolean;
}

export enum UserEditType {
  COMPLETE = 'complete',
  PARTIAL = 'partial',
  NONE = 'none',
}

export interface IPostUsersResponse {
  id?: string;
  createdAt: string | null;
  fullName: string;
  message: string;
  organization: string;
  reason: string;
  role: UserRole;
  status: UserStatus;
  workEmail: string;
}

export interface IPostUser {
  fullName: string;
  workEmail: string;
  role: string;
}

export interface IImageDetails {
  readonly id: string;
  readonly original: string;
  readonly small?: string;
  readonly medium?: string;
  readonly large?: string;
  readonly blurHash?: string;
}

export interface IUserDetails {
  userId: string;
  fullName: string;
  workLocation?: string;
  email?: string;
  department?: string;
  designation?: string;
  status: UserStatus;
  profileImage?: IImageDetails;
}
