import CreatePostProvider, { CreatePostFlow } from 'contexts/CreatePostContext';
import CreatePostModal from './components/CreatePostModal';
import { IPost } from 'interfaces';
import { FC } from 'react';

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

const PostBuilder: FC<IPostBuilderProps> = ({
  data,
  mode = PostBuilderMode.Create,
  open,
  openModal,
  closeModal,
  customActiveFlow = CreatePostFlow.CreatePost,
}) => {
  return (
    <CreatePostProvider data={data}>
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
