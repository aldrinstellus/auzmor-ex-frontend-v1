import { IPost } from 'queries/post';
import { create } from 'zustand';
import _ from 'lodash';

export interface IFeedStore {
  feed: { [key: string]: IPost };
  setFeed: (feed: { [key: string]: IPost }) => void;
  updateFeed: (id: string, post: IPost) => void;
}

export const useFeedStore = create<IFeedStore>((set) => ({
  feed: {},
  setFeed: (feed) =>
    set(() => ({
      feed: { ...feed },
    })),
  updateFeed: (id, post) =>
    set(({ feed }: IFeedStore) => ({
      feed: { ...feed, [id]: { ...post } },
    })),
}));
