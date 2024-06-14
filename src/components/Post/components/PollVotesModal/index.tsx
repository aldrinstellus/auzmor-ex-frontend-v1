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
    `flex font-extrabold ${
      isActive ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
    }`;

  const pollOptions = (post.pollContext?.options || [])
    .filter((option) => option.votes)
    .sort((a, b) => b.votes! - a.votes!);

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
      {pollOptions.length ? (
        <Tabs
          tabContentClassName=""
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
                  limit={30}
                />
              ),
            })),
          ]}
        />
      ) : (
        <div className="flex flex-col w-full justify-center items-center gap-4 p-8">
          <div className="flex w-full justify-center">
            <img src={require('images/noResultAlt.png')} alt="No Data Found" />
          </div>
          <p className="font-bold text-xl text-neutral-900">No data found</p>
        </div>
      )}
    </Modal>
  );
};

export default PollVotesModal;
