import apiService from 'utils/apiService';
import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import { DeltaStatic } from 'quill';
import { isValidUrl } from 'utils/misc';
import { IMedia } from 'contexts/CreatePostContext';
import { IComment } from 'components/Comments';
import { Metadata } from 'components/PreviewLink/types';
import { useFeedStore } from 'stores/feedStore';
import _ from 'lodash';

export interface IReactionsCount {
  [key: string]: number;
}

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
      id: string;
      original: string;
    };
    status?: string;
    userId?: string;
    workLocation?: string;
  };
  hashtags: string[] | [];
  files?: string[] | IMedia[];
  type: string;
  audience: Record<string, any>[];
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
  link?: Metadata | string;
  myReaction?: {
    createdBy?: ICreatedBy;
    reaction?: string;
    type?: string;
    id?: string;
  };
  reactionsCount: IReactionsCount;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  comment: IComment;
  schedule: {
    dateTime: string;
    timeZone: string;
  } | null;
  bookmarked: boolean;
  acknowledged: boolean;
}

export interface IPostPayload {
  id?: string;
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
      id: string;
      original: string;
    };
    status?: string;
    userId?: string;
    workLocation?: string;
  };
  hashtags: string[] | [];
  files?: string[] | IMedia[];
  type: string;
  audience: Record<string, any>[];
  isAnnouncement: boolean;
  announcement: {
    end: string;
  };
  link?: Metadata | string;
  schedule: {
    dateTime: string;
    timeZone: string;
  } | null;
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
  Bookmarks = 'bookmarks',
  Scheduled = 'scheduled',
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
  [PostFilterKeys.Bookmarks]?: boolean;
  [PostFilterKeys.Scheduled]?: boolean;
}

export const createPost = async (payload: IPostPayload) => {
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

export const updatePost = async (id: string, payload: IPostPayload) => {
  await apiService.put(`/posts/${id}`, payload);
};

export const deletePost = async (id: string) => {
  const data = await apiService.delete(`/posts/${id}`);
  return data;
};

export const fetchAnnouncement = async (
  postType: string,
  limit: number,
  excludeMyAnnouncements = true,
) => {
  const data = await apiService.get(
    `/posts?feed=${postType}&excludeMyAnnouncements=${excludeMyAnnouncements}&limit=${limit}`,
  );
  return data;
};

export const useAnnouncementsWidget = (
  limit = 1,
  queryKey = 'feed-announcements-widget',
) =>
  useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAnnouncement('ANNOUNCEMENT', limit),
    staleTime: 15 * 60 * 1000,
  });

export const announcementRead = async (postId: string) => {
  const data = await apiService.post(`/posts/${postId}/acknowledge`);
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

export const fetchFeed = async (
  context: QueryFunctionContext<
    (string | Record<string, any> | undefined)[],
    any
  >,
  feed: {
    [key: string]: IPost;
  },
  setFeed: (feed: { [key: string]: IPost }) => void,
) => {
  let response = null;
  if (
    !!context.queryKey[1] &&
    !!(context.queryKey[1] as Record<string, any>).bookmarks &&
    !!!context.pageParam
  ) {
    response = await apiService.get('/posts/my-bookmarks');
    setFeed({
      ..._.chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachPost: IPost) => ({ id: eachPost.id }),
    );
    return response;
  } else if (
    !!context.queryKey[1] &&
    !!(context.queryKey[1] as Record<string, any>).scheduled &&
    !!!context.pageParam
  ) {
    response = await apiService.get('/posts/scheduled');
    setFeed({
      ...feed,
      ..._.chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachPost: IPost) => ({ id: eachPost.id }),
    );
    return response;
  } else if (!!!context.pageParam) {
    response = await apiService.get('/posts', context.queryKey[1]);
    setFeed({
      ...feed,
      ..._.chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachPost: IPost) => ({ id: eachPost.id }),
    );
    return response;
  } else {
    response = await apiService.get(context.pageParam, context.queryKey[1]);
    setFeed({
      ...feed,
      ..._.chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachPost: IPost) => ({ id: eachPost.id }),
    );
    return response;
  }
};

export const useInfiniteFeed = (q?: Record<string, any>) => {
  const { feed, setFeed } = useFeedStore();
  return {
    ...useInfiniteQuery({
      queryKey: [
        (q as Record<string, any>).bookmarks ? 'my-bookmarks' : 'feed',
        q,
      ],
      queryFn: (context) => fetchFeed(context, feed, setFeed),
      getNextPageParam: (lastPage: any) => {
        const pageDataLen = lastPage?.data?.result?.data?.length;
        const pageLimit = lastPage?.data?.result?.paging?.limit;
        if (pageDataLen < pageLimit) {
          return null;
        }
        return lastPage?.data?.result?.paging?.next;
      },
      getPreviousPageParam: (currentPage: any) => {
        return currentPage?.data?.result?.paging?.prev;
      },
      staleTime: 5 * 60 * 1000,
    }),
    feed,
  };
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

export const getHashtags = async (q: string) => {
  const { data } = await apiService.get('hashtags', q);
  return data;
};

export const useGetHashtags = (q: string) => {
  return useQuery({
    queryKey: ['get-hashtags', q],
    queryFn: () => getHashtags(q),
    enabled: true,
  });
};

export const createBookmark = async (id: string) => {
  const { data } = await apiService.post(`/posts/${id}/bookmark`);
  return data;
};

export const deleteBookmark = async (id: string) => {
  const { data } = await apiService.delete(`/posts/${id}/bookmark`);
  return data;
};
