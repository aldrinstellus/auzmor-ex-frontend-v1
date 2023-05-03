import apiService from 'utils/apiService';
import { DeltaStatic } from 'quill';

interface IPost {
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
}
interface IDeletePost {
  id: string;
}

export const createPost = async (payload: IPost) => {
  const data = await apiService.post('/posts', payload);
  return data;
};

export const getPosts = async () => {
  const data = await apiService.get('/posts');
  return data?.data?.result;
};

export const editPost = async (id: string, payload: IPost) => {
  const data = await apiService.put(`/posts/${id}`, payload);
  return data;
};

export const deletePost = async (id: string) => {
  const data = await apiService.delete(`/posts/${id}`);
  console.log(data, 'API');
  return data;
};
