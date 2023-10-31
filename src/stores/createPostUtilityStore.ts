import { create } from 'zustand';

export interface ICreatePostUtilityStore {
  openCreatePostWithMedia: boolean; // Flag is used when clicked on create post from CreatePostCard image icon
  setOpenCreatePostWithMedia: (flag: boolean) => void;
  openCreatePostWithPolls: boolean;
  setOpenCreatePostWithPolls: (flag: boolean) => void;
  openCreatePostWithShoutout: boolean;
  setOpenCreatePostWithShoutout: (flag: boolean) => void;
  reset: () => void;
}

export const useCreatePostUtilityStore = create<ICreatePostUtilityStore>(
  (set) => ({
    openCreatePostWithMedia: false,
    setOpenCreatePostWithMedia: (flag: boolean) =>
      set(() => ({ openCreatePostWithMedia: flag })),
    openCreatePostWithPolls: false,
    setOpenCreatePostWithPolls: (flag: boolean) =>
      set(() => ({ openCreatePostWithPolls: flag })),
    openCreatePostWithShoutout: false,
    setOpenCreatePostWithShoutout: (flag: boolean) =>
      set(() => ({ openCreatePostWithShoutout: flag })),
    reset: () =>
      set(() => ({
        openCreatePostWithMedia: false,
        openCreatePostWithPolls: false,
        openCreatePostWithShoutout: false,
      })),
  }),
);
