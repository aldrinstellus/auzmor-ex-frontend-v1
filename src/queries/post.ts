import apiService from 'utils/apiService';

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
  isAnnouncement: true;
  announcement: {
    end: string;
  };
}

interface IEditPost {
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
  type: string;
  audience: {
    users: string[];
  };
  isAnnouncement: true;
  announcement: {
    end: string;
  };
}

interface IDeletePost {}

export const createPost = async (payload: ICreatePost) => {
  const data = await apiService.post('/posts', payload);
  return data;
};

export const getPosts = async () => {
  const data = await apiService.get('/posts');
  return data?.data?.result;
};

export const editPost = async (payload: IEditPost) => {
  const data = await apiService.put('/posts', payload);
  return data;
};

export const deletePost = async (payload: IDeletePost) => {
  const data = await apiService.delete('/posts', payload);
  return data;
};
