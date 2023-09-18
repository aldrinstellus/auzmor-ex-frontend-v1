import { IPost } from 'queries/post';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import _ from 'lodash';

export interface IFeedStore {
  feed: { [key: string]: IPost };
  getPost: (id: string) => IPost;
  setFeed: (feed: { [key: string]: IPost }) => void;
  updateFeed: (id: string, post: IPost) => void;
}

export const useFeedStore = create(
  immer<IFeedStore>((set, get) => ({
    feed: {},
    getPost: (id) => get().feed[id],
    setFeed: (feed) =>
      set((state) => {
        state.feed = feed;
      }),
    updateFeed: (id, post) =>
      set((state) => {
        state.feed[id] = post;
      }),
  })),
);
