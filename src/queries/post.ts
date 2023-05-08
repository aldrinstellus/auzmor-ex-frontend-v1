import apiService from 'utils/apiService';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { DeltaStatic } from 'quill';
import { isValidUrl } from 'utils/misc';
import { IMyReactions } from 'pages/Feed';
import { Metadata } from 'components/PreviewLink/types';
import { IMedia } from 'contexts/CreatePostContext';

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
  files?: string[];
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
      createdBy: {
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
    createdBy: {
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

export interface IGetPost {
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
    createdBy: {
      department?: string;
      designation?: string;
      fullName?: string;
      profileImage: {
        blurHash?: string;
        url?: string;
      };
      status?: string;
      userId?: string;
      workLocation?: string;
    };
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

export const useAnnouncements = () =>
  useQuery({
    queryKey: ['announcements-widget'],
    queryFn: () => fetchAnnouncement('ANNOUNCEMENT', 1),
    staleTime: 15 * 60 * 1000,
  });

export const announcementRead = async (payload: IAnnounce) => {
  const data = await apiService.post('/reactions', payload);
  return data;
};

export const fetchFeed = ({ pageParam = null }) => {
  if (pageParam === null) return apiService.get('/posts');
  else return apiService.get(pageParam);
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
