import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import Tabs from 'components/Tabs';
import PollVoteTab from './PollVoteTab';
import { IPost } from 'queries/post';
import { FC } from 'react';

export interface IPollVotesModalProps {
  closeModal?: () => void;
  open: boolean;
  post: IPost;
}

const PollVotesModal: FC<IPollVotesModalProps> = ({
  closeModal,
  open,
  post,
}) => {
  const getClassName = (isActive: boolean) =>
    `flex font-extrabold ${isActive ? 'text-neutral-900' : 'text-neutral-500'}`;

  const pollOptions = (post.pollContext?.options || [])
    .filter((option) => option.votes)
    .sort((a, b) => a.votes! - b.votes!);

  return (
    <Modal open={open} closeModal={closeModal} className="max-w-xl">
      <Header
        title={
          <div className="flex items-center gap-3">
            <Icon name="chartOutline" size={24} color="text-neutral-900" />{' '}
            <span>See who voted</span>
          </div>
        }
        onClose={closeModal}
      />
      {pollOptions.length && (
        <Tabs
          tabContentClassName="px-6 h-[390px] overflow-y-auto" // update style
          tabs={[
            ...pollOptions.map((option) => ({
              tabLabel: (isActive: boolean) => (
                <div className={getClassName(isActive)}>
                  {`${option.text} (${option.votes})`}
                </div>
              ),
              tabContent: (
                <PollVoteTab
                  postId={post.id!}
                  optionId={option._id!}
                  limit={20}
                />
              ),
            })),
          ]}
        />
      )}
    </Modal>
  );
};

export default PollVotesModal;
