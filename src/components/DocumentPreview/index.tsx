import React, { FC, memo } from 'react';

// components
import Card from 'components/Card';
import CommentCard from 'components/Comments/index';

// hooks
import { useTranslation } from 'react-i18next';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';
import { ICommentPayload } from 'components/Comments/components/CommentsRTE';
import { PREVIEW_CARD_VARIANT } from 'utils/constants';
import PreviewLink from 'components/PreviewLink';
import { isLearnerRoute } from 'components/LxpNotificationsOverview/utils/learnNotification';
import { useChannelRole } from 'hooks/useChannelRole';
import useRole from 'hooks/useRole';
import { getExtension } from 'pages/ChannelDetail/components/utils';
import Spinner from 'components/Spinner';
import NoDataFound from 'components/NoDataFound';

type DocumentPreviewProps = {
  channelId: string;
  fileId: string;
  canViewComment?: boolean;
  canPostComment?: boolean;
};

const DocumentPreview: FC<DocumentPreviewProps> = ({
  channelId,
  fileId,
  canViewComment,
  canPostComment,
}) => {
  const { t } = useTranslation('channelDetail', {
      keyPrefix: 'documentTab',
    });
  const { getApi } = usePermissions();
  const [isIframeLoading, setIsIframeLoading] = React.useState(true);

  const useChannelFilePreview = getApi(ApiEnum.GetChannelFilePreview);
  const {
    data,
    isLoading: previewLoading,
    isError,
  } = useChannelFilePreview({
    channelId,
    fileId,
  });

  const { isAdmin } = useRole();
  const { isChannelAdmin } = useChannelRole(channelId);
  const canDeleteComment = isChannelAdmin || (isAdmin && !isLearnerRoute());
  const fileName = data?.data?.result?.name;
  const fileExtension = getExtension(fileName || '');
  const previewUrl = data?.data?.result?.previewURL;
  const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.avif'].includes(fileExtension);
  const isSupportedVideo = ['.mp4', '.webm'].includes(fileExtension);
  const isLink = fileExtension === '.url';
  const allowIframePreview =
    isImage ||
    isLink ||
    ['.html', '.htm', '.md'].includes(fileExtension) ||
    ['.doc', '.pdf', '.ppt', '.xlsx'].includes(fileExtension);

  const showNoPreview = !isLink &&
    (isError || (!previewLoading && !isSupportedVideo && !allowIframePreview));
  const showVideo = !previewLoading && !isError && isSupportedVideo;
  const showIframe = !isLink && !previewLoading && !isError && allowIframePreview;

  return (
    <>
      <Card className="flex flex-col">
        <div className="post-content px-4 py-3 flex flex-col gap-3">
          <div
            className="bg-gray-200 min-h-[400px] transition-all duration-300 ease-in-out w-full flex items-center justify-center h-full px-8 pt-8">
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
            {showIframe ? (
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
        </div>
        {/* Comments */}
          <div className="pb-3 px-6">
            <CommentCard
              className="h-full"
              entityId={fileId || ''}
              getApiEnum={ApiEnum.GetChannelDocumentComments}
              createApiEnum={ApiEnum.CreateChannelDocumentComments}
              deleteApiEnum={ApiEnum.DeleteChannelDocumentComments}
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
              deleteApiParams={{
                channelId,
                fileId,
              }}
              canPostComment={canPostComment && canViewComment}
              canDeleteComment={canDeleteComment}
            />
          </div>
      </Card>
    </>
  );
};

export default memo(DocumentPreview);
