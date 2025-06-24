/* Comment RTE - Post Level Comment Editor */
import { FC, useState } from 'react';
import { Comment } from './components/Comment';
import { DeltaStatic } from 'quill';
import useAuth from 'hooks/useAuth';
import Avatar from 'components/Avatar';
import { IMyReactions } from 'pages/Feed';
import {
  ICreatedBy,
  IMedia,
  IMention,
  IReactionsCount,
  IShoutoutRecipient,
} from 'interfaces';
import Spinner from 'components/Spinner';
import LoadMore from './components/LoadMore';
import CommentSkeleton from './components/CommentSkeleton';
import { CommentsRTE } from './components/CommentsRTE';
import Divider from 'components/Divider';
import {
  IMG_FILE_SIZE_LIMIT,
  IMediaValidationError,
  MediaValidationError,
} from 'contexts/CreatePostContext';
import { useUploadState } from 'hooks/useUploadState';
import { useFeedStore } from 'stores/feedStore';
import { useTranslation } from 'react-i18next';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

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
  relevantComments: string[];
  entityType: string;
  entityId: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: ICreatedBy;
  id: string;
  myReaction?: IMyReactions;
  reactionsCount: IReactionsCount;
  repliesCount: number;
  files: IMedia[];
  shoutoutRecipients?: IShoutoutRecipient[];
}

const Comments: FC<CommentsProps> = ({ entityId }) => {
  const { t } = useTranslation('post', { keyPrefix: 'commentComponent' });
  const WORK_ANNIVERSARY_SUGGESTIONS = [
    t('workAnniversary.title'),
    t('workAnniversary.congratulations'),
    t('workAnniversary.greatWork'),
  ];

  const BIRTHDAY_SUGGESTIONS = [
    t('birthday.title'),
    t('birthday.manyReturns'),
    t('birthday.wishes'),
  ];
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
  const useInfiniteComments = getApi(ApiEnum.GetComments);
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
  const [suggestions, setSuggestions] = useState<string>('');
  const getPost = useFeedStore((state) => state.getPost);

  const commentIds = data?.pages.flatMap((page: any) => {
    return page.data?.result?.data.map((comment: { id: string }) => comment);
  }) as { id: string }[];

  return (
    <div>
      <div className="flex flex-row items-center justify-between p-0 gap-2">
        <div>
          <Avatar
            name={user?.name || 'U'}
            size={32}
            image={user?.profileImage}
          />
        </div>
        <CommentsRTE
          className="w-0 flex-grow"
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
          suggestions={suggestions}
        />
      </div>
      {getPost(entityId)?.occasionContext?.type === 'WORK_ANNIVERSARY' && (
        <div className="flex mt-2 w-full justify-center">
          {WORK_ANNIVERSARY_SUGGESTIONS.map((suggestions: string) => (
            <div
              className="px-3 py-1.5 rounded-17xl border border-neutral-200 mx-2 text-xxs font-medium cursor-pointer"
              onClick={() => setSuggestions(suggestions)}
              key={suggestions}
            >
              {suggestions}
            </div>
          ))}
        </div>
      )}

      {getPost(entityId)?.occasionContext?.type === 'BIRTHDAY' && (
        <div className="flex mt-2 w-full justify-center">
          {BIRTHDAY_SUGGESTIONS.map((suggestions: string) => (
            <div
              className="px-3 py-1.5 rounded-17xl border border-neutral-200 mx-2 text-xxs font-medium cursor-pointer"
              onClick={() => setSuggestions(suggestions)}
              key={suggestions}
            >
              {suggestions}
            </div>
          ))}
        </div>
      )}

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
              <div className="flex flex-col gap-4">
                {commentIds
                  ?.filter(({ id }) => !!comment[id])
                  .map(({ id }, _i: any) => (
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
          </>
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
                        errorMsg: t('imageSizeExceedError', {
                          fileName: eachFile.name,
                          sizeLimit: IMG_FILE_SIZE_LIMIT,
                        }),
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
        aria-label={t('uploadFile')}
      />
    </div>
  );
};

export default Comments;
