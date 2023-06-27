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
  showModal: boolean;
  setShowModal: (flag: boolean) => void;
  mode?: PostBuilderMode;
  customActiveFlow?: CreatePostFlow;
}

const PostBuilder: React.FC<IPostBuilderProps> = ({
  data,
  showModal,
  mode = PostBuilderMode.Create,
  setShowModal,
  customActiveFlow = CreatePostFlow.CreatePost,
}) => {
  return (
    <CreatePostProvider>
      <CreatePostModal
        showModal={showModal}
        setShowModal={setShowModal}
        data={data}
        mode={mode}
        customActiveFlow={customActiveFlow}
      />
    </CreatePostProvider>
  );
};

export default PostBuilder;
