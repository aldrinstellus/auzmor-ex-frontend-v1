import { create } from 'zustand';
import { IComment } from 'components/Comments';
import { chain } from 'utils/misc';

export interface ICommentStore {
  comment: { [key: string]: IComment };
  setComment: (comment: { [key: string]: IComment }) => void;
  updateComment: (id: string, comment: IComment) => void;
  appendComments: (comments: IComment[]) => void;
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
  appendComments: (comments) =>
    set(({ comment }: ICommentStore) => ({
      comment: { ...comment, ...chain(comments).keyBy('id').value() },
    })),
}));
