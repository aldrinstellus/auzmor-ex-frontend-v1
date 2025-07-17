import React, { FC, useEffect } from 'react';
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
import { getIconFromMime } from './Doc';
import NoDataFound from 'components/NoDataFound';
import { getExtension } from '../../utils';
import CommentCard, { CommentVariant } from 'components/Comments/index';
import { ICommentPayload } from 'components/Comments/components/CommentsRTE';
import PreviewLink from 'components/PreviewLink';
import { PREVIEW_CARD_VARIANT } from 'utils/constants';
import { useChannelRole } from 'hooks/useChannelRole';
import useRole from 'hooks/useRole';
import { isLearnerRoute } from 'components/LxpNotificationsOverview/utils/learnNotification';

interface IFilePreviewProps {
  fileId: string;
  rootFolderId: string;
  open: boolean;
  canDownload: boolean;
  canComment: boolean;
  canPostComment: boolean;
  closeModal: () => void;
}

const FilePreview: FC<IFilePreviewProps> = ({
  fileId,
  rootFolderId,
  open,
  canDownload = false,
  canComment = false,
  canPostComment = false,
  closeModal,
}) => {
  const { t } = useTranslation('channelDetail', {
    keyPrefix: 'documentTab',
  });
  const { getApi } = usePermissions();
  const { channelId } = useParams();
  const [isIframeLoading, setIsIframeLoading] = React.useState(true);
  const [showComment, setShowComment] = React.useState(false);

  const useChannelDocById = getApi(ApiEnum.UseChannelDocById);
  const { data: fileData, isLoading: fileLoading } = useChannelDocById({
    channelId,
    fileId,
    rootFolderId,
  });

  const useChannelFilePreview = getApi(ApiEnum.GetChannelFilePreview);
  const {
    data,
    isLoading: previewLoading,
    isError,
  } = useChannelFilePreview({
    channelId,
    fileId,
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

  useEffect(() => {
    const elem = document.getElementById('videoplayer');
    if (elem) {
      elem?.setAttribute('oncontextmenu', 'return false;');
    }
  });

  const { isAdmin } = useRole();
  const { isChannelAdmin } = useChannelRole(channelId);
  const canDeleteComment = (isChannelAdmin || isAdmin) && !isLearnerRoute();

  const isLoading = fileLoading || previewLoading;
  const isDownloading = downloadChannelFileMutation.isLoading;

  const file = fileData?.data?.result?.data as Doc;
  const previewUrl = data?.data?.result?.previewURL;
  const isImage = file?.mimeType?.startsWith('image/');
  const isSupportedVideo = ['video/mp4', 'video/webm'].includes(file?.mimeType);
  const fileExtension = getExtension(file?.name || '');
  const isLink = fileExtension === '.url';
  const allowIframePreview =
    isImage ||
    isLink ||
    ['.html', '.htm', '.md'].includes(fileExtension) ||
    ['doc', 'pdf', 'ppt', 'xls'].includes(getIconFromMime(file?.mimeType));

  const showSpinner = isLoading;
  const showNoPreview =
    !isLink &&
    (isError || (!isLoading && !isSupportedVideo && !allowIframePreview));
  const showVideo = !isLoading && !isError && isSupportedVideo;
  const showIframe = !isLink && !isLoading && !isError && allowIframePreview;

  return (
    <Modal
      open={open}
      className="!h-[calc(100vh-62px)] !w-[calc(100vw-96px)] flex flex-col overflow-hidden"
    >
      <div className="w-full h-[10%] flex items-center relative px-6 py-4 shrink-0">
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
          {(canComment || isChannelAdmin) && (
            <Icon
              name={showComment ? 'commentFilled' : 'comment'}
              color="text-red-500"
              onClick={() => {
                setShowComment(!showComment);
              }}
            />
          )}
          {canDownload && !fileLoading && !isLink && !!file.downloadable && (
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
          {isLink && previewUrl ? (
            <Icon
              name="launch"
              color="text-neutral-900"
              onClick={() => {
                window.open(previewUrl, '_blank', 'noopener,noreferrer');
              }}
            />
          ) : null}
          <Icon name="close2" color="text-neutral-900" onClick={closeModal} />
        </div>
      </div>
      <Divider />
      <div className="flex items-center justify-center w-full h-[90%] overflow-hidden bg-neutral-100">
        {/* Main Content */}
        <div
          className={`bg-gray-200 transition-all duration-300 ease-in-out ${
            showComment ? 'w-[66%]' : 'w-full'
          } flex items-center justify-center h-full px-8 pt-8`}
        >
          {showSpinner ? (
            <Spinner className="!h-24 !w-24 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          ) : null}
          {showNoPreview ? (
            <NoDataFound
              illustration="noPreviewAvailable"
              labelHeader={
                <span className="text-sm font-semibold">
                  {t('noPreviewAvailable')}
                </span>
              }
              hideClearBtn
            />
          ) : null}
          {showVideo ? (
            <div className="flex w-full h-full justify-center">
              <video
                id="videoplayer"
                src={previewUrl}
                controls
                controlsList="nodownload"
                className="w-full h-full object-contain"
              />
            </div>
          ) : null}
          {showIframe && !showSpinner ? (
            <div className="w-full h-full relative">
              {isIframeLoading && (
                <Spinner className="absolute !h-24 !w-24 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
              <iframe
                src={previewUrl}
                className="w-full h-full p-2"
                allowFullScreen
                allow="all"
                name="iframe_a"
                onLoad={() => setIsIframeLoading(false)}
                sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups allow-popups-to-escape-sandbox"
              />
            </div>
          ) : isLink ? (
            <div className="w-full h-full">
              <PreviewLink
                previewUrl={previewUrl}
                showCloseIcon={false}
                variant={PREVIEW_CARD_VARIANT.document}
                cardClassName="w-[70%] h-[80%] max-h-[80%]"
              />
            </div>
          ) : null}
        </div>
        {/* Comment Section */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            showComment ? 'w-[34%] px-3 pt-3 pb-3' : 'w-0 overflow-hidden'
          } relative h-[100%] bg-white`}
        >
          {showComment && (
            <CommentCard
              className="h-full"
              variant={CommentVariant.Document}
              entityId={fileId || ''}
              getApiEnum={ApiEnum.GetChannelDocumentComments}
              createApiEnum={ApiEnum.CreateChannelDocumentComments}
              getApiParams={{
                fileId,
                channelId,
                limit: 4,
              }}
              createApiParams={(payload: ICommentPayload) => ({
                channelId,
                fileId,
                payload,
              })}
              showEmptyState={true}
              canPostComment={canPostComment}
              canDeleteComment={canDeleteComment}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default FilePreview;
