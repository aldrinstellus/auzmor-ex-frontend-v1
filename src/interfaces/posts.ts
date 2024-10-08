import { IAudience } from './audience';
import { Metadata } from './links';
import { ILocation } from './locations';
import { ICreatedBy, IProfileImage } from './users';
import { DeltaStatic } from 'quill';

export interface IReactionsCount {
  [key: string]: number;
}

export interface IMention {
  name: string;
  entityId: string;
  entityType: string;
  image?: string;
  email?: string;
  location?: ILocation;
}

export interface IPollVotes {
  postId: string;
  optionId?: string;
  limit?: number;
  cursor?: string;
}

export interface IGetPollVote {
  id: string;
  primaryEmail: string;
}

export interface IShoutoutRecipient {
  fullName: string;
  profileImage: IProfileImage;
  status: string;
  workLocation: ILocation;
  designation: string;
  userId: string;
}

export type LinkAttachment = {
  url: string;
  title: string;
  description: string;
  image: string;
  favicon: string;
  _id: string;
};

export enum PostType {
  Update = 'UPDATE',
  Training = 'TRAINING',
  Event = 'EVENT',
  Forum = 'FORUM',
  Document = 'DOCUMENT',
  Poll = 'POLL',
  Shoutout = 'SHOUT_OUT',
  Birthday = 'BIRTHDAY',
  WorkAniversary = 'WORK_ANNIVERSARY',
  WelcomNewHire = 'WELCOME_NEW_HIRE',
  Repost = 'REPOST',
  Scheduled = 'SCHEDULED',
}

export const PostTypeMapping = {
  [PostType.Training]: [
    'PUBLISH_COURSE',
    'PUBLISH_PATH',
    'ASSIGN_COURSE',
    'ASSIGN_PATH',
  ],
  [PostType.Event]: ['PUBLISH_EVENT', 'ASSIGN_EVENT'],
  [PostType.Forum]: ['FORUM_POST', 'FORUM_POLL'],
};

export enum ActivityType {
  Created = 'CREATED',
  Commented = 'COMMENTED',
  Reacted = 'REACTED',
  Mentioned = 'MENTIONED',
  Bookemarked = 'BOOKMARKED',
}

export enum FeedType {
  Post = 'POST',
  Announcement = 'ANNOUNCEMENT',
  All = 'ALL',
}

export enum PostFilterKeys {
  PostType = 'type',
  ActorId = 'actorId',
  ActivityType = 'activityType',
  Limit = 'limit',
  Hashtags = 'hashtags',
  Sort = 'sort',
  Feed = 'feed',
  Next = 'next',
  Prev = 'prev',
  Bookmarks = 'bookmarks',
  Scheduled = 'scheduled',
  PostPreference = 'preference',
}

export enum PostFilterPreference {
  BookmarkedByMe = 'bookmarkedbyme',
  MyPosts = 'myPosts',
  MentionedInPost = 'mentionedInPost',
}

export interface IPostFilters {
  [PostFilterKeys.PostType]?: PostType[];
  [PostFilterKeys.PostPreference]?: PostFilterPreference[];
  [PostFilterKeys.ActorId]?: string;
  [PostFilterKeys.ActivityType]?: ActivityType;
  [PostFilterKeys.Limit]?: number;
  [PostFilterKeys.Hashtags]?: string[];
  [PostFilterKeys.Sort]?: { createdAt: 'ASC' | 'DESC' };
  [PostFilterKeys.Feed]?: FeedType;
  [PostFilterKeys.Next]?: number;
  [PostFilterKeys.Prev]?: number;
}

export interface ITranscodedData {
  l: string;
  m: string;
  s: string;
}

export interface IMedia {
  altText: string;
  blurhash: string;
  contentType: string; //'image/png'
  id: string;
  isDeleted: boolean;
  isPublic: boolean;
  name: string;
  original: string;
  size: string;
  thumbnailUrl: string;
  type: 'IMAGE' | 'VIDEO';
  coverImage?: { original: string } | null;
  transcodedData?: { image: ITranscodedData };
}

export interface IPollOption {
  _id?: string; //Has to be reverted to id once BE is fixed
  text: string;
  votes?: number;
}

export interface IPoll {
  question: string;
  closedAt: any;
  total?: number;
  options: IPollOption[];
  datepickerValue?: Date;
}

export interface IPost {
  content: {
    text: string;
    html: string;
    editor: DeltaStatic;
  };
  isAutomatedPost?: boolean;
  occasionContext?: Record<string, any>;
  mentions?: IMention[];
  createdBy?: ICreatedBy;
  intendedUsers?: ICreatedBy[];
  hashtags: string[] | [];
  files?: string[] | IMedia[];
  pollContext?: IPoll;
  type: PostType;
  audience: IAudience[];
  isAnnouncement: boolean;
  announcement: {
    actor?: Record<string, any>;
    end: string;
  };
  id: string;
  acknowledgementStats?: Record<string, any>;
  myAcknowledgement?: {
    reaction: string;
    type: string;
    id: string;
  };
  myVote?: {
    optionId: string;
  }[];
  link?: Metadata | string;
  myReaction?: {
    createdBy?: ICreatedBy;
    reaction?: string;
    type?: string;
    id?: string;
  };
  relevantComments: string[];
  reactionsCount: IReactionsCount;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  schedule: {
    dateTime: string;
    timeZone: string;
  } | null;
  bookmarked: boolean;
  acknowledged: boolean;
  shoutoutRecipients?: IShoutoutRecipient[];
  title: string;
  linkAttachments: Array<LinkAttachment>;
  cardContext: {
    resource: string;
    categories: string[];
    title: string;
    avatar: {
      url: string;
      text: string;
    };
    description: string;
    blockStrings: [
      {
        icon: string;
        text: string;
      },
      {
        icon: string;
        text: string;
      },
    ];
    image: {
      url: string;
      isOverlay: boolean;
    };
    cardBadgeIcon?: boolean;
  };
  ctaButton: {
    text: string;
    url: string;
  };
}

export interface IPostPayload {
  id?: string;
  content?: {
    text: string;
    html: string;
    editor: DeltaStatic;
  };
  mentions?: IMention[];
  createdBy?: {
    department?: string;
    designation?: string;
    fullName?: string;
    profileImage: {
      blurHash?: string;
      id: string;
      original: string;
    };
    status?: string;
    userId?: string;
    workLocation?: string;
  };
  hashtags?: string[] | [];
  files?: string[] | IMedia[];
  type: string;
  audience?: IAudience[];
  shoutoutRecipients?: string[] | IShoutoutRecipient[];
  isAnnouncement?: boolean;
  announcement?: {
    end: string;
  };
  pollContext?: IPoll;
  link?: Metadata | string;
  schedule?: {
    dateTime: string;
    timeZone: string;
  } | null;
}
