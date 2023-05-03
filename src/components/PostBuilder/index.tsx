import React from 'react';
import CreatePostProvider from 'contexts/CreatePostContext';
import CreatePostModal from './components/CreatePostModal';

export interface IPostBuilderProps {
  data?: Record<string, any>;
  showModal: boolean;
  setShowModal: (flag: boolean) => void;
}

const PostBuilder: React.FC<IPostBuilderProps> = ({
  data = {},
  showModal,
  setShowModal,
}) => {
  return (
    <CreatePostProvider>
      <CreatePostModal
        showModal={showModal}
        setShowModal={setShowModal}
        data={data}
      />
    </CreatePostProvider>
  );
};

export default PostBuilder;
