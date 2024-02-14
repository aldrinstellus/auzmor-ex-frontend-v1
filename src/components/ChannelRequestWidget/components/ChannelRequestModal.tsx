import Button, { Size, Variant } from 'components/Button';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import { FC } from 'react';
import ChannelUserRow from './ChannelUser';
import { useChannelRequests } from 'queries/channel';

type ChannelRequestModalProps = {
  open: boolean;
  closeModal: () => void;
  channelId?: string;
};
const ChannelRequestModal: FC<ChannelRequestModalProps> = ({
  channelId = '',
  open,
  closeModal,
}) => {
  const channelRequestCount = 0;
  const { data: ChannelRequest } = useChannelRequests(channelId);

  const modalTitle = `Channel request (${channelRequestCount})`;
  return (
    <Modal
      open={open}
      dataTestId="requestwidget-viewall-request-modal"
      closeModal={closeModal}
      className="max-w-[648px] "
    >
      <Header title={modalTitle} onClose={closeModal} />
      <div className="max-h-[390px]  overflow-y-auto w-full">
        <div className="divide-y divide-neutral-200">
          {ChannelRequest?.map((user: any) => {
            return (
              <div className="py-2" key={user?.id}>
                <ChannelUserRow user={user?.user} />
              </div>
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
            dataTestId={'requestwidget-viewall-closemodal'}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ChannelRequestModal;
