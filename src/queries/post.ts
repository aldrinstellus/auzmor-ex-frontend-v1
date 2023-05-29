import apiService from 'utils/apiService';
import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import { DeltaStatic } from 'quill';
import { isValidUrl } from 'utils/misc';
import { IMyReactions } from 'pages/Feed';
import { Metadata } from 'components/PreviewLink/types';
import { IMedia } from 'contexts/CreatePostContext';
import { IComment } from 'components/Comments';

export interface IMention {
  name: string;
  entityId: string;
  entityType: string;
  image?: string;
  email?: string;
}

export interface IPost {
  content: {
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
    };
    status?: string;
    userId?: string;
    workLocation?: string;
  };
  hashtags:
    | [
        {
          name: string;
          id: string;
        },
      ]
    | [];
  files?: string[] | IMedia[];
  type: string;
  audience: {
    users: string[];
  };
  isAnnouncement: boolean;
  announcement: {
    end: string;
  };
  id?: string;
  myAcknowledgement?: {
    // createdBy: {
    //   department?: string;
    //   designation?: string;
    //   fullName?: string;
    //   profileImage: {
    //     blurHash?: string;
    //   };
    //   status?: string;
    //   userId?: string;
    //   workLocation?: string;
    // };
    reaction: string;
    type: string;
    id: string;
  };
  link?: string;
  myReactions?: [
    {
      createdBy: ICreatedBy;
      reaction: string;
      type: string;
      id: string;
    },
  ];
}

export interface IReaction {
  id: any;
  entityType: string;
  type: string;
  reaction: string;
  myReactions?: {
    createdBy: ICreatedBy;
    reaction: string;
    type: string;
    id: string;
  };
  myAcknowledgement?: {
    // createdBy: {
    //   department?: string;
    //   designation?: string;
    //   fullName?: string;
    //   profileImage: {
    //     blurHash?: string;
    //   };
    //   status?: string;
    //   userId?: string;
    //   workLocation?: string;
    // };
    reaction: string;
    type: string;
    id: string;
  };

  reactionCount?: object;
  turnOffComments?: boolean;
  commentsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MyObjectType {
  [key: string]: number;
}

export interface ICreatedBy {
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
}

export interface IGetPost {
  content: {
    text: string;
    html: string;
    editor: DeltaStatic;
  };
  mentions?: IMention[];
  createdBy?: ICreatedBy;
  hashtags:
    | [
        {
          name: string;
          id: string;
        },
      ]
    | [];
  files?: IMedia[];
  type: string;
  audience: {
    users: string[];
  };
  isAnnouncement: boolean;
  announcement: {
    end: string;
  };
  link: Metadata;
  id: string;
  myReaction: {
    createdBy: ICreatedBy;
    reaction: string;
    type: string;
    id: string;
  };
  myAcknowledgement?: {
    // createdBy: {
    //   department?: string;
    //   designation?: string;
    //   fullName?: string;
    //   profileImage: {
    //     blurHash?: string;
    //   };
    //   status?: string;
    //   userId?: string;
    //   workLocation?: string;
    // };
    reaction: string;
    type: string;
    id: string;
  };
  reactionsCount: MyObjectType;
  turnOffComments: boolean;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  comment?: IComment;
}

interface IDeletePost {
  id: string;
}

interface IAnnounce {
  entityId: string;
  entityType: string;
  type: string;
  reaction: string;
}

export enum PostType {
  Update = 'UPDATE',
  Event = 'EVENT',
  Document = 'DOCUMENT',
  Poll = 'POLL',
  ShoutOut = 'SHOUT_OUT',
  Birthday = 'BIRTHDAY',
  WorkAniversary = 'WORK_ANNIVERSARY',
  WelcomNewHire = 'WELCOME_NEW_HIRE',
  Repost = 'REPOST',
  Scheduled = 'SCHEDULED',
}

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
  MyPosts = 'myPosts',
  MentionedInPost = 'mentionedInPost',
  Limit = 'limit',
  Hashtags = 'hashtags',
  Sort = 'sort',
  Feed = 'feed',
  Next = 'next',
  Prev = 'prev',
}

export interface IPostFilters {
  [PostFilterKeys.PostType]?: PostType[];
  [PostFilterKeys.ActorId]?: string;
  [PostFilterKeys.ActivityType]?: ActivityType;
  [PostFilterKeys.MyPosts]?: boolean;
  [PostFilterKeys.MentionedInPost]?: boolean;
  [PostFilterKeys.Limit]?: number;
  [PostFilterKeys.Hashtags]?: string[];
  [PostFilterKeys.Sort]?: { createdAt: 'ASC' | 'DESC' };
  [PostFilterKeys.Feed]?: FeedType;
  [PostFilterKeys.Next]?: number;
  [PostFilterKeys.Prev]?: number;
}

export const createPost = async (payload: IPost) => {
  const data = await apiService.post('/posts', payload);
  return data;
};

export const getPreviewLink = async (previewUrl: string) => {
  if (!previewUrl) {
    return null;
  }
  const { data } = await apiService.get(`/links/unfurl?url=${previewUrl}`);
  return data;
};

export const usePreviewLink = (previewUrl: string) => {
  return useQuery({
    queryKey: ['preview-link', previewUrl],
    queryFn: () => getPreviewLink(previewUrl),
    staleTime: Infinity,
    enabled: isValidUrl(previewUrl),
  });
};

export const updatePost = async (id: string, payload: IPost) => {
  await apiService.put(`/posts/${id}`, payload);
};

export const deletePost = async (id: string) => {
  const data = await apiService.delete(`/posts/${id}`);
  return data;
};

export const fetchAnnouncement = async (postType: string, limit: number) => {
  const data = await apiService.get(`/posts?feed=${postType}&limit=${limit}`);
  return data;
};

export const useAnnouncementsWidget = () =>
  useQuery({
    queryKey: ['announcements-widget'],
    queryFn: () => fetchAnnouncement('ANNOUNCEMENT', 1),
    staleTime: 15 * 60 * 1000,
  });

export const announcementRead = async (payload: IAnnounce) => {
  const data = await apiService.post('/reactions', payload);
  return data;
};

export const myProfileFeed = ({ pageParam = null }) => {
  if (pageParam === null) return apiService.get('/posts/my-profile');
  else return apiService.get(pageParam);
};

export const useInfiniteMyProfileFeed = (q?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ['my-profile-feed', q],
    queryFn: myProfileFeed,
    getNextPageParam: (lastPage: any) => {
      return lastPage?.data?.result?.paging?.next;
    },
    getPreviousPageParam: (currentPage: any) => {
      return currentPage?.data?.result?.paging?.prev;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const peopleProfileFeed = (userId: string, { pageParam = null }) => {
  if (pageParam === null)
    return apiService.get(`/posts/people-profile?memberId=${userId}`);
  else return apiService.get(pageParam);
};

export const useInfinitePeopleProfileFeed = (
  userId: string,
  q?: Record<string, any>,
) => {
  return useInfiniteQuery({
    queryKey: ['people-profile-feed', q, userId],
    queryFn: () => peopleProfileFeed(userId, {}),
    getNextPageParam: (lastPage: any) => {
      return lastPage?.data?.result?.paging?.next;
    },
    getPreviousPageParam: (currentPage: any) => {
      return currentPage?.data?.result?.paging?.prev;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const fetchFeed = ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<(string | Record<string, any> | undefined)[], any>) => {
  if (pageParam === null) return apiService.get('/posts', queryKey[1]);
  else return apiService.get(pageParam, queryKey[1]);
};

export const useInfiniteFeed = (q?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ['feed', q],
    queryFn: fetchFeed,
    getNextPageParam: (lastPage: any) => {
      return lastPage?.data?.result?.paging?.next;
    },
    getPreviousPageParam: (currentPage: any) => {
      return currentPage?.data?.result?.paging?.prev;
    },
    staleTime: 5 * 60 * 1000,
  });
};

const getPost = async (id: string, commentId?: string) => {
  const data = await apiService.get(
    `/posts/${id}${commentId ? '?commentId=' + commentId : ''}`,
  );
  return data;
};

export const useGetPost = (id: string, commentId?: string) => {
  return useQuery({
    queryKey: ['get-post', id, commentId],
    queryFn: () => getPost(id, commentId),
  });
};
