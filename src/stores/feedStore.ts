import { IPost } from 'queries/post';
import { create } from 'zustand';

export const useFeedStore = create((set) => ({
  feed: {},
  setFeed: () =>
    set((state: { feed: { [key: string]: IPost } }) => ({
      feed: { ...state.feed },
    })),
}));
