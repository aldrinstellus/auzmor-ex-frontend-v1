import { create } from 'zustand';
import _ from 'lodash';
import { IComment } from 'components/Comments';

export interface ICommentStore {
  comment: { [key: string]: IComment };
  setComment: (comment: { [key: string]: IComment }) => void;
  updateComment: (id: string, comment: IComment) => void;
}

export const useCommentStore = create<ICommentStore>((set) => ({
  comment: {},
  setComment: (comment) =>
    set(() => ({
      comment: { ...comment },
    })),
  updateComment: (id, updatedComment) =>
    set(({ comment }: ICommentStore) => ({
      comment: { ...comment, [id]: { ...updatedComment } },
    })),
}));
