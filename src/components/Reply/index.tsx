import { FC, useState } from 'react';
import useAuth from 'hooks/useAuth';
import Avatar from 'components/Avatar';
import { Reply } from 'components/Reply/Reply';
import Spinner from 'components/Spinner';
import LoadMore from 'components/Comments/components/LoadMore';
import { useCommentStore } from 'stores/commentStore';
import CommentSkeleton from 'components/Comments/components/CommentSkeleton';
import { CommentsRTE } from 'components/Comments/components/CommentsRTE';
import { EntityType } from 'interfaces';
import {
  IMG_FILE_SIZE_LIMIT,
  IMediaValidationError,
  MediaValidationError,
} from 'contexts/CreatePostContext';
import { validImageTypesForComments } from 'components/Comments';
import { useUploadState } from 'hooks/useUploadState';
import { useTranslation } from 'react-i18next';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

interface CommentsProps {
  entityId: string;
  className?: string;
}

export interface activeCommentsDataType {
  id: string;
  type: string;
}

const Comments: FC<CommentsProps> = ({ entityId, className }) => {
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
  const [isCreateCommentLoading, setIsCreateCommentLoading] = useState(false);

  const useInfiniteComments = getApi(ApiEnum.GetComments);
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteComments({
      entityId: entityId,
      entityType: 'comment',
      limit: 4,
    });
  const { t } = useTranslation('profile');
  const { comment } = useCommentStore();

  const replyIds = data?.pages.flatMap((page: any) => {
    return page.data?.result?.data.map((reply: { id: string }) => reply);
  }) as { id: string }[];

  return (
    <div className={className}>
      {isLoading ? (
        <div className="ml-8">
          <CommentSkeleton />
        </div>
      ) : (
        <div className="ml-8">
          <div className="flex flex-row items-center justify-between mb-4 gap-2">
            <div>
              <Avatar
                name={user?.name || t('nameNotSpecified')}
                size={32}
                image={user?.profileImage}
              />
            </div>
            <CommentsRTE
              className="w-0 flex-grow py-1"
              entityId={entityId}
              entityType={EntityType.Comment.toLocaleLowerCase()}
              inputRef={inputRef}
              media={media}
              removeMedia={() => {
                setMedia([]);
                setFiles([]);
                setMediaValidationErrors([]);
              }}
              files={files}
              mediaValidationErrors={mediaValidationErrors}
              setIsCreateCommentLoading={setIsCreateCommentLoading}
              setMediaValidationErrors={setMediaValidationErrors}
              isCreateCommentLoading={isCreateCommentLoading}
            />
          </div>
          {replyIds && replyIds.length > 0 && (
            <div>
              {isCreateCommentLoading && <CommentSkeleton />}
              <div className="flex flex-col gap-4">
                {replyIds
                  .filter(({ id }) => !!comment[id])
                  .map(({ id }) => (
                    <Reply
                      // handleClick={handleClick}
                      comment={comment[id]}
                      key={id}
                    />
                  ))}
              </div>
              {hasNextPage && !isFetchingNextPage && (
                <LoadMore onClick={fetchNextPage} label="Load more replies" />
              )}
              {isFetchingNextPage && (
                <div className="flex justify-center items-center py-10">
                  <Spinner />
                </div>
              )}
            </div>
          )}
        </div>
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
    </div>
  );
};

export default Comments;
