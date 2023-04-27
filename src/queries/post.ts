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

export const createPost = async (payload: ICreatePost) => {
  const data = await apiService.post('/posts', payload);
  return data;
};
