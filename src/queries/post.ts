import apiService from 'utils/apiService';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { DeltaStatic } from 'quill';

export interface IPost {
  content: {
    text: string;
    html: string;
    editor: DeltaStatic;
  };
  mentions: string[];
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
}
interface IDeletePost {
  id: string;
}

export const createPost = async (payload: IPost) => {
  const data = await apiService.post('/posts', payload);
  return data;
};

export const fetchFeed = ({ pageParam = null }) => {
  if (pageParam === null) return apiService.get('/posts');
  else return apiService.get(pageParam);
};

export const getPreviewLink = async (previewUrl: string) => {
  const { data } = await apiService.get(`/links/unfurl?url=${previewUrl}`);
  return data;
};

export const usePreviewLink = (previewUrl: string) => {
  return useQuery({
    queryKey: ['preview-link', previewUrl],
    queryFn: () => getPreviewLink(previewUrl),
    staleTime: Infinity,
  });
};

export const updatePost = async (id: string, payload: IPost) => {
  await apiService.put(`/posts/${id}`, payload);
};

export const deletePost = async (id: string) => {
  const data = await apiService.delete(`/posts/${id}`);
  console.log(data, 'API');
  return data;
};

export const useInfiniteFeed = (q?: Record<string, any>) => {
  return useInfiniteQuery(['feed', q], fetchFeed, {
    getNextPageParam: (lastPage: any) => {
      return lastPage?.data?.result?.paging?.next;
    },
    getPreviousPageParam: (currentPage: any) => {
      return currentPage?.data?.result?.paging?.prev;
    },
    onSuccess: (data) => console.log(data),
  });
};
