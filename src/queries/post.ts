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
import { useCommentStore } from 'stores/commentStore';

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
  All = 'ALL',
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

// export type PostTitle = {
//   content: string;
//   target: {
//     link: string;
//     linkText: string;
//   };
// };

export type LinkAttachment = {
  url: string;
  title: string;
  description: string;
  image: string;
  favicon: string;
  _id: string;
};

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
  const mentionIds = payload.mentions
    ? payload.mentions.map((mention: any) =>
        typeof mention === 'string'
          ? mention
          : mention?.userId ?? mention?.entityId,
      )
    : payload.mentions;
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
    mentions: mentionIds,
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

const collectComments = (response: any, comments: IComment[]) => {
  response?.data.result.data.forEach((eachPost: IPost) => {
    const postComments = eachPost.relevantComments || [];

    postComments.forEach((comment: any) => {
      const commentReplies = (comment as any).relevantComments || [];
      comments.push(comment as any as IComment, ...commentReplies);
      comment.relevantComments = commentReplies.map((reply: any) => reply.id);
    });

    eachPost.relevantComments = postComments.map((comment: any) => comment.id);
  });
};

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
  appendComments: (comments: IComment[]) => void,
) => {
  let response: any = null;
  const comments: IComment[] = [];

  // Fetching data
  if (!!!context.pageParam) {
    response = await apiService.get('/posts/my-profile', context.queryKey[1]);
  } else {
    response = await apiService.get(context.pageParam, context.queryKey[1]);
  }

  // Collecting all comments
  collectComments(response, comments);

  // appending post to comment store
  appendComments(comments.flat());

  // Updating feed store
  setFeed({
    ...feed,
    ...chain(response.data.result.data).keyBy('id').value(),
  });

  // Updating response
  response.data.result.data = response.data.result.data.map(
    (eachPost: IPost) => ({ id: eachPost.id }),
  );

  // Setting next next param
  if (!!context.pageParam) {
    if (context.pageParam == response.data.result.paging.next) {
      response.data.result.paging.next = null;
    }
  }
  return response;
};

export const useInfiniteMyProfileFeed = (q?: Record<string, any>) => {
  const { feed, setFeed } = useFeedStore();
  const { appendComments } = useCommentStore();
  return {
    ...useInfiniteQuery({
      queryKey: ['my-profile-feed', q],
      queryFn: (context) =>
        myProfileFeed(context, feed, setFeed, appendComments),
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
  appendComments: (comments: IComment[]) => void,
) => {
  let response: any = null;
  const comments: IComment[] = [];

  // Fetching data
  if (!!!context.pageParam) {
    response = await apiService.get(
      `/posts/people-profile?memberId=${userId}`,
      context.queryKey[1],
    );
  } else {
    response = await apiService.get(context.pageParam, context.queryKey[1]);
  }

  // Collecting all comments
  collectComments(response, comments);

  // appending post to comment store
  appendComments(comments.flat());

  // Updating feed store
  setFeed({
    ...feed,
    ...chain(response.data.result.data).keyBy('id').value(),
  });

  // Updating response
  response.data.result.data = response.data.result.data.map(
    (eachPost: IPost) => ({ id: eachPost.id }),
  );

  // Setting next next param
  if (!!context.pageParam) {
    if (context.pageParam == response.data.result.paging.next) {
      response.data.result.paging.next = null;
    }
  }
  return response;
};

export const useInfinitePeopleProfileFeed = (
  userId: string,
  q?: Record<string, any>,
) => {
  const { feed, setFeed } = useFeedStore();
  const { appendComments } = useCommentStore();
  return {
    ...useInfiniteQuery({
      queryKey: ['people-profile-feed', q, userId],
      queryFn: (context) =>
        peopleProfileFeed(context, feed, setFeed, userId, appendComments),
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
  appendComments: (comments: IComment[]) => void,
) => {
  let response: any = null;
  const comments: IComment[] = [];

  // Fetching data
  if (!!!context.pageParam) {
    response = await apiService.get(
      '/posts',
      context.queryKey[1],
      context.signal,
    );
  } else {
    response = await apiService.get(context.pageParam, context.signal);
  }

  // Collecting all comments
  collectComments(response, comments);

  // appending post to comment store
  appendComments(comments.flat());

  // Updating feed store
  setFeed({
    ...feed,
    ...chain(response.data.result.data).keyBy('id').value(),
  });

  // Updating response
  response.data.result.data = response.data.result.data.map(
    (eachPost: IPost) => ({ id: eachPost.id }),
  );

  // Setting next next param
  if (!!context.pageParam) {
    if (context.pageParam == response.data.result.paging.next) {
      response.data.result.paging.next = null;
    }
  }
  return response;
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

  // Fetching data
  if (!!!context.pageParam) {
    response = await apiService.get('/posts/scheduled', context.queryKey[1]);
  } else {
    response = await apiService.get(context.pageParam);
  }

  // Updating feed store
  setFeed({
    ...feed,
    ...chain(response.data.result.data).keyBy('id').value(),
  });

  // Updating response
  response.data.result.data = response.data.result.data.map(
    (eachPost: IPost) => ({ id: eachPost.id }),
  );

  // Setting next next param
  if (!!context.pageParam) {
    if (context.pageParam == response.data.result.paging.next) {
      response.data.result.paging.next = null;
    }
  }
  return response;
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
  appendComments: (comments: IComment[]) => void,
) => {
  let response: any = null;
  const comments: IComment[] = [];

  // Fetching data
  if (!!!context.pageParam) {
    response = await apiService.get('/posts/my-bookmarks', context.queryKey[1]);
  } else {
    response = await apiService.get(context.pageParam);
  }

  // Collecting all comments
  collectComments(response, comments);

  // appending post to comment store
  appendComments(comments.flat());

  // Updating feed store
  setFeed({
    ...feed,
    ...chain(response.data.result.data).keyBy('id').value(),
  });

  // Updating response
  response.data.result.data = response.data.result.data.map(
    (eachPost: IPost) => ({ id: eachPost.id }),
  );

  // Setting next next param
  if (!!context.pageParam) {
    if (context.pageParam == response.data.result.paging.next) {
      response.data.result.paging.next = null;
    }
  }
  return response;
};

const feedFunction: Record<string, any> = {
  feed: fetchFeed,
  bookmarks: fetchBookmarks,
  scheduledPosts: fetchScheduledPosts,
};

export const useInfiniteFeed = (pathname: string, q?: Record<string, any>) => {
  const { feed, setFeed } = useFeedStore();
  const { appendComments } = useCommentStore();
  const queryKey = pathname.replaceAll('/', '') || 'feed';
  const queryFunction = queryKey === '' ? fetchFeed : feedFunction[queryKey];
  return {
    ...useInfiniteQuery({
      queryKey: [queryKey, q],
      queryFn: (context) =>
        queryFunction(context, feed, setFeed, appendComments),
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
  appendComments: (comments: IComment[]) => void,
  commentId?: string,
) => {
  const comments: IComment[] = [];
  const response = await apiService.get(
    `/posts/${id}${commentId ? '?commentId=' + commentId : ''}`,
  );

  // Collecting all comments
  const post = response.data.result.data;
  if ((post as any)?.comment) {
    if ((post as any)?.comment?.comment) {
      comments.push((post as any)?.comment?.comment);
    }
    comments.push((post as any)?.comment);
  }
  comments.push(...((post?.relevantComments as any as IComment[]) || []));
  comments.forEach((comment, index) => {
    comments[index].relevantComments = (comment?.relevantComments || []).map(
      (relevantComment: any) => relevantComment.id,
    );
    if ((comment as any).comment) {
      comments[index].relevantComments.push((comment as any).comment.id);
    }
  });

  // Update response
  response.data.result.data.relevantComments = [
    ...((post?.relevantComments as any as IComment[]) || []).map(
      (comment) => comment.id,
    ),
  ];

  // appending post to comment store
  appendComments(comments.flat());

  updateFeed(id, response.data.result.data);
  response.data.result.data = { id: response.data.result.data.id };
  return response;
};

export const useGetPost = (id: string, commentId?: string) => {
  const updateFeed = useFeedStore((state) => state.updateFeed);
  const { appendComments } = useCommentStore();
  return useQuery({
    queryKey: ['posts', id, commentId],
    queryFn: () => getPost(id, updateFeed, appendComments, commentId),
    refetchOnMount: 'always',
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
    cacheTime: 0,
  });
};

export const downloadAcknowledgementReport = async (id: string) => {
  const { data } = await apiService.get(
    `/posts/${id}/downloadAcknowledgementReport`,
  );
  return data;
};

export const myRecognitionFeed = async (
  context: QueryFunctionContext<
    (string | Record<string, any> | undefined)[],
    any
  >,
  feed: {
    [key: string]: IPost;
  },
  setFeed: (feed: { [key: string]: IPost }) => void,
  appendComments: (comments: IComment[]) => void,
) => {
  let response: any = null;
  const comments: IComment[] = [];

  // Fetching data
  if (!!!context.pageParam) {
    response = await apiService.get(
      'posts/recognitions/me',
      context.queryKey[1],
    );
  } else {
    response = await apiService.get(context.pageParam, context.queryKey[1]);
  }

  // Collecting all comments
  collectComments(response, comments);

  // appending post to comment store
  appendComments(comments.flat());

  // Updating feed store
  setFeed({
    ...feed,
    ...chain(response.data.result.data).keyBy('id').value(),
  });

  // Updating response
  response.data.result.data = response.data.result.data.map(
    (eachPost: IPost) => ({ id: eachPost.id }),
  );

  // Setting next next param
  if (!!context.pageParam) {
    if (context.pageParam == response.data.result.paging.next) {
      response.data.result.paging.next = null;
    }
  }
  return response;
};

export const useInfiniteMyRecognitionFeed = (q?: Record<string, any>) => {
  const { feed, setFeed } = useFeedStore();
  const { appendComments } = useCommentStore();
  return {
    ...useInfiniteQuery({
      queryKey: ['my-recognition-feed', q],
      queryFn: (context) =>
        myRecognitionFeed(context, feed, setFeed, appendComments),
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

export const peopleProfileRecognitionFeed = async (
  context: QueryFunctionContext<
    (string | Record<string, any> | undefined)[],
    any
  >,
  feed: {
    [key: string]: IPost;
  },
  setFeed: (feed: { [key: string]: IPost }) => void,
  userId: string,
  appendComments: (comments: IComment[]) => void,
) => {
  let response: any = null;
  const comments: IComment[] = [];

  // Fetching data
  if (!!!context.pageParam) {
    response = await apiService.get(
      `/posts/recognitions/${userId}`,
      context.queryKey[1],
    );
  } else {
    response = await apiService.get(context.pageParam, context.queryKey[1]);
  }

  // Collecting all comments
  collectComments(response, comments);

  // appending post to comment store
  appendComments(comments.flat());

  // Updating feed store
  setFeed({
    ...feed,
    ...chain(response.data.result.data).keyBy('id').value(),
  });

  // Updating response
  response.data.result.data = response.data.result.data.map(
    (eachPost: IPost) => ({ id: eachPost.id }),
  );

  // Setting next next param
  if (!!context.pageParam) {
    if (context.pageParam == response.data.result.paging.next) {
      response.data.result.paging.next = null;
    }
  }
  return response;
};

export const useInfinitePeopleProfileRecognitionFeed = (
  userId: string,
  q?: Record<string, any>,
) => {
  const { feed, setFeed } = useFeedStore();
  const { appendComments } = useCommentStore();
  return {
    ...useInfiniteQuery({
      queryKey: ['people-profile-recognition-feed', q, userId],
      queryFn: (context) =>
        peopleProfileRecognitionFeed(
          context,
          feed,
          setFeed,
          userId,
          appendComments,
        ),
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
