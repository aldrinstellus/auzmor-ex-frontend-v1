/* Comment RTE - Post Level Comment Editor */
import React, { useRef, useState } from 'react';
import { Comment } from './components/Comment';
import { useInfiniteComments } from 'queries/comments';
import { DeltaStatic } from 'quill';
import useAuth from 'hooks/useAuth';
import Avatar from 'components/Avatar';
import { ICreated, IMyReactions } from 'pages/Feed';
import { IMention, IReactionsCount, IShoutoutRecipient } from 'queries/post';
import Spinner from 'components/Spinner';
import { PRIMARY_COLOR } from 'utils/constants';
import LoadMore from './components/LoadMore';
import CommentSkeleton from './components/CommentSkeleton';
import { CommentsRTE } from './components/CommentsRTE';
import Divider from 'components/Divider';
import {
  IMG_FILE_SIZE_LIMIT,
  IMedia,
  IMediaValidationError,
  MediaValidationError,
} from 'contexts/CreatePostContext';
import { getMediaObj } from 'utils/misc';
import { useUploadState } from 'hooks/useUploadState';

export const validImageTypesForComments = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
];

interface CommentsProps {
  entityId: string;
}

export interface IComment {
  content: {
    text: string;
    html: string;
    editor: DeltaStatic;
  };
  mentions: IMention[];
  hashtags: string[];
  latestComments: object[];
  entityType: string;
  entityId: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: ICreated;
  id: string;
  myReaction?: IMyReactions;
  reactionsCount: IReactionsCount;
  repliesCount: number;
  comment: IComment;
  files: IMedia[];
  shoutoutRecipients?: IShoutoutRecipient[];
}

const Comments: React.FC<CommentsProps> = ({ entityId }) => {
  const { user } = useAuth();
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
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    comment,
  } = useInfiniteComments({
    entityId: entityId,
    entityType: 'post',
    limit: 4,
  });
  const [isCreateCommentLoading, setIsCreateCommentLoading] = useState(false);

  const commentIds = data?.pages.flatMap((page) => {
    return page.data?.result?.data.map((comment: { id: string }) => {
      try {
        return comment;
      } catch (e) {
        console.log('Error', { comment });
      }
    });
  }) as { id: string }[];

  return (
    <div>
      <div className="flex flex-row items-center justify-between p-0">
        <div className="flex-none grow-0 order-none pr-2">
          <Avatar
            name={user?.name || 'U'}
            size={32}
            image={user?.profileImage}
          />
        </div>
        <CommentsRTE
          className="w-full"
          entityId={entityId}
          entityType="post"
          inputRef={inputRef}
          media={media}
          removeMedia={() => {
            setMedia([]);
            setFiles([]);
            setMediaValidationErrors([]);
            inputRef!.current!.value = '';
          }}
          files={files}
          mediaValidationErrors={mediaValidationErrors}
          setIsCreateCommentLoading={setIsCreateCommentLoading}
          setMediaValidationErrors={setMediaValidationErrors}
          isCreateCommentLoading={isCreateCommentLoading}
        />
      </div>
      {isLoading ? (
        <div>
          <Divider className="my-4" />
          <CommentSkeleton />
        </div>
      ) : (
        commentIds &&
        commentIds.length > 0 && (
          <>
            <Divider className="mt-4" />
            <div className="pt-4">
              {isCreateCommentLoading && <CommentSkeleton />}
              {commentIds
                ?.filter(({ id }) => !!comment[id])
                .map(({ id }, i: any) => (
                  <Comment key={id} comment={comment[id]} />
                ))}
              {hasNextPage && !isFetchingNextPage && (
                <LoadMore
                  onClick={fetchNextPage}
                  label="Load more comments"
                  dataTestId="comments-loadmorecta"
                />
              )}
              {isFetchingNextPage && (
                <div className="flex justify-center items-center py-10">
                  <Spinner color={PRIMARY_COLOR} />
                </div>
              )}
            </div>
          </>
        )
      )}
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        accept={validImageTypesForComments.join(',')}
        onChange={(e) => {
          console.log(e);
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
                        errorMsg: `The file “${eachFile.name}" you are trying to upload exceeds the 5MB attachment limit. Try uploading a smaller file`,
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
        data-testid="comment-uploadphoto"
      />
    </div>
  );
};

export default Comments;
