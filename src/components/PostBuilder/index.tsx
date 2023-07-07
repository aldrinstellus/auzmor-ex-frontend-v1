import React from 'react';
import CreatePostProvider, { CreatePostFlow } from 'contexts/CreatePostContext';
import CreatePostModal from './components/CreatePostModal';
import { IPost } from 'queries/post';

export enum PostBuilderMode {
  Create = 'CREATE',
  Edit = 'EDIT',
}

export interface IPostBuilderProps {
  data?: IPost;
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  mode?: PostBuilderMode;
  customActiveFlow?: CreatePostFlow;
}

const PostBuilder: React.FC<IPostBuilderProps> = ({
  data,
  mode = PostBuilderMode.Create,
  open,
  openModal,
  closeModal,
  customActiveFlow = CreatePostFlow.CreatePost,
}) => {
  return (
    <CreatePostProvider>
      <CreatePostModal
        open={open}
        openModal={openModal}
        closeModal={closeModal}
        data={data}
        mode={mode}
        customActiveFlow={customActiveFlow}
      />
    </CreatePostProvider>
  );
};

export default PostBuilder;
