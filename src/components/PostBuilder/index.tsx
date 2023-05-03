import React from 'react';
import CreatePostProvider from 'contexts/CreatePostContext';
import CreatePostModal from './components/CreatePostModal';

export interface IPostBuilderProps {
  showModal: boolean;
  setShowModal: (flag: boolean) => void;
}

const PostBuilder: React.FC<IPostBuilderProps> = ({
  showModal,
  setShowModal,
}) => {
  return (
    <CreatePostProvider>
      <CreatePostModal showModal={showModal} setShowModal={setShowModal} />
    </CreatePostProvider>
  );
};

export default PostBuilder;
