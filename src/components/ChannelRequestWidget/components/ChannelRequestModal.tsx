import Button, { Size, Variant } from 'components/Button';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import { FC, useEffect, useMemo } from 'react';
import ChannelUserRow from './ChannelUser';
import { CHANNEL_MEMBER_STATUS, IChannelRequest } from 'stores/channelStore';
import { useInView } from 'react-intersection-observer';
import Spinner from 'components/Spinner';
import SkeletonLoader from './SkeletonLoader';
import Divider from 'components/Divider';
import { groupByDate } from 'utils/time';
import Skeleton from 'react-loading-skeleton';
import { useTranslation } from 'react-i18next';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

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
  const { t } = useTranslation('channelDetail', {
    keyPrefix: 'channelRequestWidget',
  });
  const { getApi } = usePermissions();
  const useInfiniteChannelsRequest = getApi(ApiEnum.GetChannelMembers);
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading } =
    useInfiniteChannelsRequest(
      channelId,
      {
        limit: 30,
        status: CHANNEL_MEMBER_STATUS.PENDING,
      },
      true,
    );

  const requests = useMemo(
    () =>
      groupByDate(
        (data?.pages.flatMap((page: any) => {
          return (
            page?.data?.result?.data.map((request: IChannelRequest) => {
              try {
                return request;
              } catch (e) {}
            }) || []
          );
        }) || []) as IChannelRequest[],
      ),
    [data],
  );

  const { ref, inView } = useInView({
    root: document.getElementById('entity-search-request-body'),
    rootMargin: '20%',
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const modalTitle = (
    <p className="flex">
      {t('modalTitle')} &#40;&nbsp;
      {isLoading ? (
        <Skeleton count={1} className="!w-8 h-5" />
      ) : (
        requests?.length
      )}
      &nbsp;&#41;
    </p>
  );

  return (
    <Modal
      open={open}
      dataTestId="requestwidget-viewall-request-modal"
      closeModal={closeModal}
      className="max-w-[648px]"
    >
      <Header title={modalTitle} onClose={closeModal} />
      <ul className="h-[390px] flex flex-col overflow-y-auto w-full px-6 pt-4">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <>
            {!!requests.today.length && (
              <>
                <p className="mb-3 text-sm font-semibold">
                  {t('timeLabels.today')}
                </p>
                {requests.today?.map(
                  (request: IChannelRequest, index: number) => {
                    return (
                      <li key={request?.id}>
                        <ChannelUserRow request={request} />
                        {index !== requests.today.length - 1 && (
                          <Divider className="my-3 px-6" />
                        )}
                      </li>
                    );
                  },
                )}
              </>
            )}
            {!!requests.yesterday.length && (
              <>
                <p className="mb-3 mt-4 text-sm font-semibold">
                  {t('timeLabels.yesterday')}
                </p>
                {requests.yesterday?.map(
                  (request: IChannelRequest, index: number) => {
                    return (
                      <li key={request?.id}>
                        <ChannelUserRow request={request} />
                        {index !== requests.yesterday.length - 1 && (
                          <Divider className="my-3 px-6" />
                        )}
                      </li>
                    );
                  },
                )}
              </>
            )}
            {!!requests.older.length && (
              <>
                <p className="mb-3 mt-4 text-sm font-semibold">
                  {t('timeLabels.older')}
                </p>
                {requests.older?.map(
                  (request: IChannelRequest, index: number) => {
                    return (
                      <li key={request?.id}>
                        <ChannelUserRow request={request} />
                        {index !== requests.older.length - 1 && (
                          <Divider className="my-3 px-6" />
                        )}
                      </li>
                    );
                  },
                )}
              </>
            )}
          </>
        )}
        {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
        {isFetchingNextPage && (
          <div className="flex items-center w-full justify-center p-12">
            <Spinner />
          </div>
        )}
      </ul>
      {/* Footer */}
      <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          label={t('close')}
          variant={Variant.Secondary}
          size={Size.Small}
          className="py-[7px]"
          onClick={closeModal}
          dataTestId={'requestwidget-viewall-closemodal'}
        />
      </div>
    </Modal>
  );
};

export default ChannelRequestModal;
