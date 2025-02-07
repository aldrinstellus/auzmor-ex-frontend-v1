import React, { FC } from 'react';
import Modal from 'components/Modal';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { useParams } from 'react-router-dom';
import Icon from 'components/Icon';
import Divider from 'components/Divider';
import Spinner from 'components/Spinner';
import moment from 'moment';
import { downloadFromUrl } from 'utils/misc';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { useTranslation } from 'react-i18next';
import { Doc } from 'interfaces';
import Skeleton from 'react-loading-skeleton';
import { useMutation } from '@tanstack/react-query';

interface IFilePreviewProps {
  fileId: string;
  rootFolderId: string;
  open: boolean;
  canDownload: boolean;
  closeModal: () => void;
}

const FilePreview: FC<IFilePreviewProps> = ({
  fileId,
  rootFolderId,
  open,
  canDownload = false,
  closeModal,
}) => {
  const { t } = useTranslation('channelDetail', {
    keyPrefix: 'documentTab',
  });
  const { getApi } = usePermissions();
  const { channelId } = useParams();

  const useChannelDocById = getApi(ApiEnum.UseChannelDocById);
  const { data: fileData, isLoading: fileLoading } = useChannelDocById({
    channelId,
    fileId,
    rootFolderId,
  });

  const useChannelFilePreview = getApi(ApiEnum.GetChannelFilePreview);
  const { data, isLoading: previewLoading } = useChannelFilePreview({
    channelId,
    fileId: fileId,
  });

  const downloadChannelFile = getApi(ApiEnum.GetChannelDocDownloadUrl);
  const downloadChannelFileMutation = useMutation({
    mutationFn: (payload: {
      channelId: string;
      itemId: string;
      name: string;
    }) =>
      downloadChannelFile({
        channelId: payload.channelId,
        itemId: payload.itemId,
      }),
    onSuccess(data: any) {
      downloadFromUrl(
        data?.data?.result?.data?.downloadUrl,
        data?.data?.result?.data?.name,
      );
    },
    onError(response: any, variables) {
      const failMessage =
        response?.response?.data?.errors[0]?.reason === 'ACCESS_DENIED'
          ? t('accessDenied')
          : t('downloadFile.failure', { name: variables?.name });
      failureToastConfig({
        content: failMessage,
        dataTestId: 'file-download-toaster',
      });
    },
  });

  const isLoading = fileLoading || previewLoading;
  const isDownloading = downloadChannelFileMutation.isLoading;

  const file = fileData?.data?.result?.data as Doc;

  return (
    <Modal
      open={open}
      className="!h-[calc(100vh-62px)] !w-[calc(100vw-96px)] flex flex-col overflow-hidden"
    >
      <div className="flex items-center relative px-6 py-4 shrink-0">
        <div className="flex flex-grow items-start ">
          {fileLoading ? (
            <Skeleton width={256} height={40} />
          ) : (
            <div>
              <div className="text-base leading-normal text-neutral-900 font-semibold">
                {file?.name || ''}
              </div>
              <div className="text-xs text-neutral-900">
                {t('lastUpdatedDate', {
                  date: moment(file?.externalUpdatedAt || '').format(
                    'MMM DD, YYYY',
                  ),
                })}
              </div>
            </div>
          )}
        </div>
        <div className="flex absolute gap-3 right-4">
          {canDownload && !fileLoading && !!file.downloadable && (
            <div className="flex gap-2">
              {isDownloading && <Spinner />}
              <Icon
                name="download"
                color="text-neutral-900"
                disabled={isDownloading}
                onClick={() => {
                  downloadChannelFileMutation.mutate({
                    channelId: channelId || '',
                    itemId: fileId,
                    name: file?.name || '',
                  });
                }}
              />
            </div>
          )}
          <Icon name="close2" color="text-neutral-900" onClick={closeModal} />
        </div>
      </div>
      <Divider />
      <div className="flex items-center justify-center w-full h-full">
        {isLoading ? (
          <Spinner className="!h-24 !w-24" />
        ) : (
          <iframe
            src={data?.data?.result?.previewURL}
            className="w-full h-full mt-2"
            allowFullScreen
            allow="all"
            name="iframe_a"
            loading={isLoading}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms" // downloads are not allowed
          />
        )}
      </div>
    </Modal>
  );
};

export default FilePreview;
