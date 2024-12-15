import { IPost } from 'interfaces';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export enum FeedModeEnum {
  Default = 'DEFAULT',
  Channel = 'CHANNEL',
  Personal = 'PERSONAL',
}

export interface IFeedStore {
  feed: { [key: string]: IPost };
  activeFeedPostCount: number;
  mode: FeedModeEnum;
  setFeedMode: (mode: FeedModeEnum) => void;
  setActiveFeedPostCount: (count: number) => void;
  getPost: (id: string) => IPost;
  getFeed: () => { [key: string]: IPost };
  setFeed: (feed: { [key: string]: IPost }) => void;
  updateFeed: (id: string, post: IPost) => void;
}

export const useFeedStore = create(
  immer<IFeedStore>((set, get) => ({
    feed: {},
    activeFeedPostCount: 0,
    mode: FeedModeEnum.Default,
    setFeedMode: (mode) =>
      set((state) => {
        state.mode = mode;
      }),
    setActiveFeedPostCount: (count) =>
      set((state) => {
        state.activeFeedPostCount = count;
      }),
    getPost: (id) => get().feed[id],
    getFeed: () => get().feed,
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
