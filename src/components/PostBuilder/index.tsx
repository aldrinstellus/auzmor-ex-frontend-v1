import CreatePostProvider, { CreatePostFlow } from 'contexts/CreatePostContext';
import CreatePostModal from './components/CreatePostModal';
import { IPost } from 'queries/post';
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
  channelName?: string;
}

const PostBuilder: FC<IPostBuilderProps> = ({
  data,
  mode = PostBuilderMode.Create,
  open,
  openModal,
  closeModal,
  channelName,
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
        channelName={channelName}
      />
    </CreatePostProvider>
  );
};

export default PostBuilder;
