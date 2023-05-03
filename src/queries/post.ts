import apiService from 'utils/apiService';
import { useQuery } from '@tanstack/react-query';

interface ICreatePost {
  content: {
    text: string;
    html: string;
    editor: string;
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
}

export const createPost = async (payload: ICreatePost) => {
  const data = await apiService.post('/posts', payload);
  return data;
};

export const getPosts = async () => {
  const data = await apiService.get('/posts');
  return data?.data?.result;
};

export const getPreviewLink = async (previewUrl: string) => {
  const data = await apiService.get(`links/unfurl?url=${previewUrl}`);
  return data?.data;
};

export const usePreviewLink = (previewUrl: string) => {
  return useQuery({
    queryKey: ['preview-link', previewUrl],
    queryFn: () => getPreviewLink(previewUrl),
    staleTime: Infinity,
  });
};
