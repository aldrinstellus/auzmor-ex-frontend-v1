import React from 'react';
import CreatePostProvider from 'contexts/CreatePostContext';
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
}

const PostBuilder: React.FC<IPostBuilderProps> = ({
  data,
  showModal,
  mode = PostBuilderMode.Create,
  setShowModal,
}) => {
  return (
    <CreatePostProvider>
      <CreatePostModal
        showModal={showModal}
        setShowModal={setShowModal}
        data={data}
        mode={mode}
      />
    </CreatePostProvider>
  );
};

export default PostBuilder;
