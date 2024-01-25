import Button, { Size, Variant } from 'components/Button';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import { ChannelUser } from 'mocks/Channels';
import { FC } from 'react';
import ChannelUserRow from './ChannelUser';

type ChannelRequestModalProps = {
  open: boolean;
  closeModal: () => void;
};
const ChannelRequestModal: FC<ChannelRequestModalProps> = ({
  open,
  closeModal,
}) => {
  const channelRequestCount = 0;
  // const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } ={} // useChannelRequests({}); api call

  const modalTitle = `Channel request (${channelRequestCount})`;
  return (
    <Modal open={open} closeModal={closeModal} className="max-w-[648px]">
      <Header title={modalTitle} onClose={closeModal} />
      <div className="max-h-[390px] min-h-[390px] overflow-y-auto w-full">
        <div
          className="divide-x divide-neutral-200"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {ChannelUser.map((user: any) => {
            return (
              <>
                <ChannelUserRow key={user?.id} user={user} />
              </>
            );
          })}
        </div>
        <div className="flex justify-end items-center h-16 px-6 py-4 bg-blue-50 rounded-b-9xl">
          <Button
            label="Close"
            variant={Variant.Secondary}
            size={Size.Small}
            className="py-[7px]"
            onClick={closeModal}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ChannelRequestModal;
