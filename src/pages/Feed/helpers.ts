import { getPosts } from 'queries/post';
import queryClient from 'utils/queryClient';
import { IFeed } from '.';

export const loader = () => async (): Promise<any> => {
  return queryClient
    .ensureQueryData({
      queryKey: ['activity-feed-posts'],
      queryFn: getPosts,
    })
    .then((response) => {
      return response?.data.map((data: any) => {
        return {
          content: {
            ...data.content,
            editor: JSON.parse(data.content.editor),
          },
          uuid: data.uuid,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          type: data.type,
          isAnnouncement: data.isAnnouncement,
        } as IFeed;
      });
    });
};
