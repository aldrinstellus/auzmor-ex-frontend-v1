/* eslint-disable @typescript-eslint/no-unused-vars */
import CreatePostCard from 'components/PostBuilder/components/CreatePostCard';
import FinishSetup from './FinishSetup';
import Welcome from './Welcome';
import useModal from 'hooks/useModal';
import { IChannel } from 'stores/channelStore';
import { FC } from 'react';
import PostBuilder from 'components/PostBuilder';

type AppProps = {
  channelData: IChannel;
};
const Feed: FC<AppProps> = ({ channelData }) => {
  const [open, openModal, closeModal] = useModal(undefined, false);
  return (
    <div>
      <div>
        <CreatePostCard openModal={openModal} />
      </div>
      <Welcome />
      <FinishSetup channelData={channelData} />
      {open && (
        <PostBuilder
          open={open}
          openModal={openModal}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default Feed;
