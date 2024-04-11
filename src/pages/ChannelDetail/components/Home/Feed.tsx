/* eslint-disable @typescript-eslint/no-unused-vars */
import CreatePostCard from 'components/PostBuilder/components/CreatePostCard';
import FinishSetup from './FinishSetup';
import Welcome from './Welcome';
import useModal from 'hooks/useModal';

const Feed = () => {
  const [open, showOpen, closeOpen] = useModal();
  return (
    <div>
      <div>
        <CreatePostCard openModal={showOpen} />
      </div>
      <Welcome />
      <FinishSetup />
    </div>
  );
};

export default Feed;
