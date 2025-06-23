/* Comment RTE - Post Level Comment Editor */
import { FC, useState } from 'react';
import { Comment } from './Comment';
import useAuth from 'hooks/useAuth';
import Avatar from 'components/Avatar';
import {
  IMG_FILE_SIZE_LIMIT,
  IMediaValidationError,
  MediaValidationError,
} from 'contexts/CreatePostContext';
import Spinner from 'components/Spinner';
import LoadMore from 'components/Comments/components/LoadMore';
import CommentSkeleton from 'components/Comments/components/CommentSkeleton';
import { CommentsRTE } from './CommentsRTE';
import { useUploadState } from 'hooks/useUploadState';
import { useTranslation } from 'react-i18next';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';
import NoDataFound from 'components/NoDataFound';

export const validImageTypesForComments = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
];

interface CommentsProps {
  channelId?: string,
  entityId: string;
}

const Comments: FC<CommentsProps> = ({ channelId, entityId }) => {
  const { t } = useTranslation('channelDetail', { keyPrefix: 'documentTab' });
  const { user } = useAuth();
  const { getApi } = usePermissions();
  const {
    inputRef,
    media,
    setMedia,
    files,
    setFiles,
    mediaValidationErrors,
    setMediaValidationErrors,
    setUploads,
  } = useUploadState();
  const useInfiniteChannelDocumentComments = getApi(ApiEnum.GetChannelDocumentComments);
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    comment,
  } = useInfiniteChannelDocumentComments({
    channelId,
    fileId: entityId,
    limit: 4,
  });
  const [isCreateCommentLoading, setIsCreateCommentLoading] = useState(false);

  const commentIds: { id: string }[] =
  data?.pages.flatMap((page: any) => page.data?.data?.comments || []) ?? [];

  return (
    <div className='w-full h-full flex flex-col gap-2'>
      {isLoading ? (
        <div className='w-full h-[92%] flex flex-col'>
          <CommentSkeleton />
        </div>
      ) : (
        commentIds &&
        commentIds.length > 0 ? (
          <div className="h-[85%] max-h-[85%] overflow-y-auto">
            {isCreateCommentLoading && <CommentSkeleton />}
            <div className="flex flex-col gap-4 px-4">
              {commentIds.filter(({ id }) => !!comment[id])
                .map(({ id }) => (
                  <Comment key={id} commentId={id} />
                ))}
            </div>
            {hasNextPage && !isFetchingNextPage && (
              <LoadMore
                onClick={fetchNextPage}
                label={t('loadMoreComments')}
                dataTestId="comments-loadmorecta"
              />
            )}
            {isFetchingNextPage && (
              <div className="flex justify-center items-center py-10">
                <Spinner />
              </div>
            )}
          </div>
        ) : (
          <div className='w-full h-[85%] flex items-center justify-center'>
            <NoDataFound
                illustration="noCommentAvailable"
                labelHeader={
                  <div className='flex flex-col items-center justify-center'>
                    {t('noComments')}
                    <span className="text-sm font-semibold">
                      {t('noCommentAvailable')}
                    </span>
                  </div>
                }
                hideClearBtn
            />
          </div>
        )
      )}
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        accept={validImageTypesForComments.join(',')}
        onChange={(e) => {
          const mediaErrors: IMediaValidationError[] = [];
          if (e.target.files?.length) {
            setUploads(
              Array.prototype.slice
                .call(e.target.files)
                .filter((eachFile: File) => {
                  if (
                    !!![...validImageTypesForComments].includes(eachFile.type)
                  ) {
                    mediaErrors.push({
                      errorMsg: `File (${eachFile.name}) type not supported. Upload a supported file content`,
                      errorType: MediaValidationError.FileTypeNotSupported,
                      fileName: eachFile.name,
                    });
                    return false;
                  }
                  if (eachFile.type.match('image')) {
                    if (eachFile.size > IMG_FILE_SIZE_LIMIT * 1024 * 1024) {
                      mediaErrors.push({
                        errorType: MediaValidationError.ImageSizeExceed,
                        errorMsg: `The file “${eachFile.name}” you are trying to upload exceeds the 50MB attachment limit. Try uploading a smaller file`,
                        fileName: eachFile.name,
                      });
                      return false;
                    }
                    return true;
                  }
                })
                .map(
                  (eachFile: File) =>
                    new File(
                      [eachFile],
                      `id-${Math.random().toString(16).slice(2)}-${
                        eachFile.name
                      }`,
                      { type: eachFile.type },
                    ),
                ),
            );
            setMediaValidationErrors([...mediaErrors]);
          }
        }}
        data-testid="reply-uploadphoto"
        aria-label="upload image"
      />
      <div className="flex flex-row items-center justify-between gap-2 h-[15%] border-t border-gray-300">
        <div>
          <Avatar
            name={user?.name || 'U'}
            size={32}
            image={user?.profileImage}
          />
        </div>
        <CommentsRTE
          className="w-0 flex-grow"
          channelId={channelId}
          entityId={entityId}
          entityType="comment"
          inputRef={inputRef}
          media={media}
          removeMedia={() => {
            setMedia([]);
            setFiles([]);
            setMediaValidationErrors([]);
            if (inputRef.current) {
              inputRef.current.value = '';
            }
          }}
          files={files}
          mediaValidationErrors={mediaValidationErrors}
          setIsCreateCommentLoading={setIsCreateCommentLoading}
          setMediaValidationErrors={setMediaValidationErrors}
          isCreateCommentLoading={isCreateCommentLoading}
        />
      </div>
    </div>
  );
};

export default Comments;
