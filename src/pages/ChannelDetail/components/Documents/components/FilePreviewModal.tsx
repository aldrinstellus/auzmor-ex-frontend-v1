import React, { FC } from 'react';
import Modal from 'components/Modal';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { useParams } from 'react-router-dom';
import Icon from 'components/Icon';
import Divider from 'components/Divider';
import Avatar from 'components/Avatar';
import Spinner from 'components/Spinner';
import moment from 'moment';
import { downloadFromUrl } from 'utils/misc';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { useTranslation } from 'react-i18next';
import { Doc } from 'interfaces';
import Skeleton from 'react-loading-skeleton';

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

  const getChannelDocDownloadUrl = getApi(ApiEnum.GetChannelDocDownloadUrl);

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

  const isLoading = fileLoading || previewLoading;

  const file = fileData?.data?.result?.data as Doc;

  return (
    <Modal
      open={open}
      closeModal={closeModal}
      className="!w-[65vw] flex flex-col h-[80vh] overflow-hidden"
      showModalCloseBtn
    >
      <div className="flex items-center relative p-6">
        <div className="flex flex-grow justify-center items-start text-center">
          {fileLoading ? <Skeleton width={256} /> : file?.name || ''}
        </div>
        <div className="flex absolute gap-3 right-4">
          {canDownload && !fileLoading && !!file.downloadable && (
            <Icon
              name="download"
              color="text-neutral-900"
              onClick={() => {
                getChannelDocDownloadUrl({
                  channelId,
                  itemId: fileId,
                })
                  .then(({ data }: Record<string, any>) => {
                    downloadFromUrl(
                      data?.result?.data?.downloadUrl,
                      data?.result?.data?.name,
                    );
                  })
                  .catch(() => {
                    failureToastConfig({
                      content: `Failed to download ${file?.name || ''}`,
                      dataTestId: 'file-download-toaster',
                    });
                  });
              }}
            />
          )}
          <a
            href={data?.data?.result?.launchURL}
            rel="noreferrer"
            target="_blank"
          >
            <Icon name="launch" color="text-neutral-900" />
          </a>
        </div>
      </div>
      <Divider />
      <div className="flex rounded-9xl p-4 gap-2 items-center mx-4 mt-4 bg-[#F0F6FE]">
        <Avatar
          size={40}
          name={file?.ownerName || ''}
          image={file?.ownerImage || ''}
          loading={fileLoading}
        />
        <div className="flex flex-grow justify-between">
          <div className="flex flex-col text-sm font-bold text-neutral-900">
            {fileLoading ? <Skeleton /> : file?.ownerName || ''}
          </div>
          <div className="flex flex-col items-end">
            {fileLoading ? (
              <Skeleton width={128} />
            ) : (
              <div className="flex text-xs text-[#384D6F]">
                {t('lastUpdated')}:{' '}
                <span>
                  {moment(file?.externalUpdatedAt || '').format('MMM DD, YYYY')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-full">
        {isLoading ? (
          <Spinner />
        ) : (
          <iframe
            src={data?.data?.result?.previewURL}
            className="w-full h-full mt-2"
            allowFullScreen
            allow="all"
            name="iframe_a"
            loading={isLoading}
          />
        )}
      </div>
    </Modal>
  );
};

export default FilePreview;
