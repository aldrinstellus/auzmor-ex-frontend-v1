import Button, { Size, Variant } from 'components/Button';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import { FC, useEffect } from 'react';
import ChannelUserRow from './ChannelUser';
import { useInfiniteChannelsRequest } from 'queries/channel';
import { IChannelRequest } from 'stores/channelStore';
import { useInView } from 'react-intersection-observer';
import Spinner from 'components/Spinner';

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
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteChannelsRequest(channelId, {
      limit: 30,
    });

  const requests = data?.pages.flatMap((page) => {
    return (
      page?.data?.result?.data.map((request: IChannelRequest) => {
        try {
          return request;
        } catch (e) {}
      }) || []
    );
  }) as IChannelRequest[];

  const { ref, inView } = useInView({
    root: document.getElementById('entity-search-request-body'),
    rootMargin: '20%',
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  console.log(requests);

  const modalTitle = `Channel request (${requests?.length})`;
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
          {requests?.map((request: IChannelRequest) => {
            return (
              <div className="py-2" key={request?.id}>
                <ChannelUserRow request={request} channelId={channelId} />
              </div>
            );
          })}
          {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
          {isFetchingNextPage && (
            <div className="flex items-center w-full justify-center p-12">
              <Spinner />
            </div>
          )}
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
