import apiService from 'utils/apiService';
import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import { DeltaStatic } from 'quill';
import { isValidUrl, chain } from 'utils/misc';
import { IMedia, IPoll } from 'contexts/CreatePostContext';
import { IComment } from 'components/Comments';
import { Metadata } from 'components/PreviewLink/types';
import { useFeedStore } from 'stores/feedStore';
import { ITeam } from './teams';
import { IGetUser } from './users';
import { ILocation } from './location';

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

export enum AudienceEntityType {
  User = 'USER',
  Team = 'TEAM',
  Channel = 'CHANNEL',
}

export interface IAudience {
  entityType: AudienceEntityType;
  entityId: string;
  entity?: ITeam | IGetUser | false; // | IChannel
  name?: string;
}

export interface IProfileImage {
  blurHash: string;
  id: string;
  original: string;
}

export interface IShoutoutRecipient {
  fullName: string;
  profileImage: IProfileImage;
  status: string;
  workLocation: ILocation;
  designation: string;
  userId: string;
}

export interface IPost {
  content: {
    text: string;
    html: string;
    editor: DeltaStatic;
  };
  occasionContext?: Record<string, any>;
  mentions?: IMention[];
  createdBy?: {
    department?: string;
    designation?: string;
    fullName?: string;
    profileImage: {
      blurHash: string;
      id: string;
      original: string;
    };
    status?: string;
    userId?: string;
    workLocation?: string;
  };
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
  id?: string;
  acknowledgementStats?: Record<string, any>;
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
  shoutoutRecipients?: IShoutoutRecipient[];
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
    blurHash: string;
    id: string;
    original: string;
  };
  status?: string;
  userId?: string;
  workLocation?: string;
  email?: string;
}

// interface IAnnounce {
//   entityId: string;
//   entityType: string;
//   type: string;
//   reaction: string;
// }

export enum PostType {
  Update = 'UPDATE',
  Event = 'EVENT',
  Document = 'DOCUMENT',
  Poll = 'POLL',
  Shoutout = 'SHOUT_OUT',
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
  const fileIds = payload.files
    ? payload.files.map((file) => (typeof file === 'string' ? file : file.id))
    : payload.files;
  const shoutoutRecipentIds = payload.shoutoutRecipients
    ? payload.shoutoutRecipients.map((recipient) =>
        typeof recipient === 'string' ? recipient : recipient.userId,
      )
    : payload.shoutoutRecipients;
  const link =
    !payload.link || typeof payload.link === 'string'
      ? payload.link
      : payload.link.url;
  const data = await apiService.put(`/posts/${id}`, {
    ...payload,
    files: fileIds,
    shoutoutRecipients: shoutoutRecipentIds,
    link: link,
  });
  return data;
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

const fetchCelebrations = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>) => {
  if (pageParam === null) {
    return await apiService.get('/organizations/occasions', queryKey[1]);
  } else return await apiService.get(pageParam);
};

export const useCelebrations = (q?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ['celebrations', q],
    queryFn: fetchCelebrations,
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
  });
};

export const announcementRead = async (postId: string) => {
  const data = await apiService.post(`/posts/${postId}/acknowledge`);
  return data;
};

export const pollVote = async ({
  postId,
  optionId,
}: {
  postId: string;
  optionId: string;
}) => {
  const data = await apiService.post(`/posts/${postId}/votes`, { optionId });
  return data;
};

export const deletePollVote = async ({
  postId,
  optionId,
}: {
  postId: string;
  optionId: string;
}) => {
  const data = await apiService.delete(`/posts/${postId}/votes/${optionId}`);
  return data;
};

export const myProfileFeed = async (
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
  if (!!!context.pageParam) {
    response = await apiService.get('/posts/my-profile', context.queryKey[1]);
    setFeed({
      ...feed,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachPost: IPost) => ({ id: eachPost.id }),
    );
    return response;
  } else {
    response = await apiService.get(context.pageParam, context.queryKey[1]);
    setFeed({
      ...feed,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachPost: IPost) => ({ id: eachPost.id }),
    );
    return response;
  }
};

export const useInfiniteMyProfileFeed = (q?: Record<string, any>) => {
  const { feed, setFeed } = useFeedStore();
  return {
    ...useInfiniteQuery({
      queryKey: ['my-profile-feed', q],
      queryFn: (context) => myProfileFeed(context, feed, setFeed),
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

export const peopleProfileFeed = async (
  context: QueryFunctionContext<
    (string | Record<string, any> | undefined)[],
    any
  >,
  feed: {
    [key: string]: IPost;
  },
  setFeed: (feed: { [key: string]: IPost }) => void,
  userId: string,
) => {
  let response = null;
  if (!!!context.pageParam) {
    response = await apiService.get(
      `/posts/people-profile?memberId=${userId}`,
      context.queryKey[1],
    );
    setFeed({
      ...feed,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachPost: IPost) => ({ id: eachPost.id }),
    );
    return response;
  } else {
    response = await apiService.get(context.pageParam, context.queryKey[1]);
    setFeed({
      ...feed,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachPost: IPost) => ({ id: eachPost.id }),
    );
    return response;
  }
};

export const useInfinitePeopleProfileFeed = (
  userId: string,
  q?: Record<string, any>,
) => {
  const { feed, setFeed } = useFeedStore();
  return {
    ...useInfiniteQuery({
      queryKey: ['people-profile-feed', q, userId],
      queryFn: (context) => peopleProfileFeed(context, feed, setFeed, userId),
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
  if (!!!context.pageParam) {
    response = await apiService.get('/posts', context.queryKey[1]);
    setFeed({
      ...feed,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachPost: IPost) => ({ id: eachPost.id }),
    );
    return response;
  } else {
    response = await apiService.get(context.pageParam, context.queryKey[1]);
    setFeed({
      ...feed,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachPost: IPost) => ({ id: eachPost.id }),
    );
    return response;
  }
};

export const fetchScheduledPosts = async (
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
  if (!!!context.pageParam) {
    response = await apiService.get('/posts/scheduled');
    setFeed({
      ...feed,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachPost: IPost) => ({ id: eachPost.id }),
    );
    return response;
  } else {
    response = await apiService.get(context.pageParam, context.queryKey[1]);
    setFeed({
      ...feed,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachPost: IPost) => ({ id: eachPost.id }),
    );
    return response;
  }
};

export const fetchBookmarks = async (
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
  if (!!!context.pageParam) {
    response = await apiService.get('/posts/my-bookmarks');
    setFeed({
      ...feed,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachPost: IPost) => ({ id: eachPost.id }),
    );
    return response;
  } else {
    response = await apiService.get(context.pageParam, context.queryKey[1]);
    setFeed({
      ...feed,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachPost: IPost) => ({ id: eachPost.id }),
    );
    return response;
  }
};

const feedFunction: Record<string, any> = {
  feed: fetchFeed,
  bookmarks: fetchBookmarks,
  scheduledPosts: fetchScheduledPosts,
};

export const useInfiniteFeed = (pathname: string, q?: Record<string, any>) => {
  const { feed, setFeed } = useFeedStore();
  const queryKey = pathname.replaceAll('/', '');
  const queryFunction = queryKey === '' ? fetchFeed : feedFunction[queryKey];
  return {
    ...useInfiniteQuery({
      queryKey: [queryKey, q],
      queryFn: (context) => queryFunction(context, feed, setFeed),
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
      refetchOnMount: 'always',
    }),
    feed,
  };
};

const getPost = async (
  id: string,
  updateFeed: (id: string, post: IPost) => void,
  commentId?: string,
) => {
  const response = await apiService.get(
    `/posts/${id}${commentId ? '?commentId=' + commentId : ''}`,
  );
  updateFeed(id, response.data.result.data);
  response.data.result.data = { id: response.data.result.data.id };
  return response;
};

export const useGetPost = (id: string, commentId?: string) => {
  const updateFeed = useFeedStore((state) => state.updateFeed);
  return useQuery({
    queryKey: ['posts', id, commentId],
    queryFn: () => getPost(id, updateFeed, commentId),
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

export const getAcknowledgements = async (
  id: string,
  {
    pageParam = null,
    queryKey,
  }: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>,
) => {
  if (pageParam === null) {
    return await apiService.get(`/posts/${id}/acknowledgements`, queryKey[2]);
  } else return await apiService.get(pageParam);
};

export const useInfiniteAcknowledgements = (
  id: string,
  q?: Record<string, any>,
) => {
  return useInfiniteQuery({
    queryKey: ['acknowledgements', id, q],
    queryFn: (np: any) => getAcknowledgements(id, np),
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
  });
};

export const downloadAcknowledgementReport = async (id: string) => {
  const { data } = await apiService.get(
    `/posts/${id}/downloadAcknowledgementReport`,
  );
  return data;
};
