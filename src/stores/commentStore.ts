import { create } from 'zustand';
import { IComment } from 'components/Comments';

export interface ICommentStore {
  comment: { [key: string]: IComment };
  appendComments: (comment: { [id: string]: IComment }) => void;
  setComment: (comment: { [key: string]: IComment }) => void;
  updateComment: (id: string, comment: IComment) => void;
}

export const useCommentStore = create<ICommentStore>((set) => ({
  comment: {},
  appendComments: (comment: { [id: string]: IComment }) =>
    set((state) => ({ comment: { ...state.comment, ...comment } })),
  setComment: (comment) =>
    set(() => ({
      comment: { ...comment },
    })),
  updateComment: (id, updatedComment) =>
    set(({ comment }: ICommentStore) => ({
      comment: { ...comment, [id]: { ...updatedComment } },
    })),
}));
