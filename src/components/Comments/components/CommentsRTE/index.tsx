import { FC, RefObject, useEffect, useRef, useState } from 'react';
import IconButton, {
  Variant as IconVariant,
  Size as SizeVariant,
} from 'components/IconButton';
import RichTextEditor from 'components/RichTextEditor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment, updateComment } from 'queries/comments';
import ReactQuill from 'react-quill';
import { DeltaStatic } from 'quill';
import { toast } from 'react-toastify';
import {
  hideEmojiPalette,
  hideMentionHashtagPalette,
  isEmptyEditor,
  quillHashtagConversion,
  removeEmptyLines,
  twConfig,
} from 'utils/misc';
import { produce } from 'immer';
import { useCommentStore } from 'stores/commentStore';
import { useFeedStore } from 'stores/feedStore';
import FailureToast from 'components/Toast/variants/FailureToast';
import Icon from 'components/Icon';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import Button, { Size, Variant } from 'components/Button';
import { IComment } from 'components/Comments';
import MediaPreview, { Mode } from 'components/MediaPreview';
import {
  IMedia,
  IMediaValidationError,
  MediaValidationError,
} from 'contexts/CreatePostContext';
import { EntityType } from 'queries/files';
import { UploadStatus, useUpload } from 'hooks/useUpload';
import { IMention } from 'queries/post';
import Banner, { Variant as BannerVariant } from 'components/Banner';

export enum PostCommentMode {
  Create = 'CREATE',
  Edit = 'EDIT',
  SendWish = 'SEND_WISH',
}

interface CommentFormProps {
  className?: string;
  wrapperClassName?: string;
  entityId?: string;
  entityType: string;
  mode?: PostCommentMode;
  setEditComment?: (edit: boolean) => void;
  commentData?: IComment;
  inputRef?: RefObject<HTMLInputElement> | null;
  media?: IMedia[];
  removeMedia?: () => void;
  files?: File[];
  mediaValidationErrors?: IMediaValidationError[];
  setIsCreateCommentLoading?: (state: boolean) => void;
  setMediaValidationErrors?: (errors: IMediaValidationError[]) => void;
  isCreateCommentLoading?: boolean;
  suggestions?: string;
  toolbarId?: string;
}

interface IUpdateCommentPayload {
  entityId: string;
  entityType: string;
  content: { text: string; html: string; editor: DeltaStatic };
  hashtags: string[];
  mentions: Array<any>;
  files: string[];
}

export const CommentsRTE: FC<CommentFormProps> = ({
  className = '',
  wrapperClassName = '',
  entityId,
  entityType,
  mode = PostCommentMode.Create,
  commentData,
  setEditComment,
  inputRef = null,
  media = [],
  removeMedia = () => {},
  files = [],
  mediaValidationErrors = [],
  setIsCreateCommentLoading = () => {},
  setMediaValidationErrors = () => {},
  suggestions,
  toolbarId,
}) => {
  const {
    comment,
    setComment,
    updateComment: updateStoredComment,
  } = useCommentStore();
  const getPost = useFeedStore((state) => state.getPost);
  const updateFeed = useFeedStore((state) => state.updateFeed);
  const queryClient = useQueryClient();
  const quillRef = useRef<ReactQuill>(null);
  const { uploadMedia, uploadStatus } = useUpload();
  const [isEmpty, setIsEmpty] = useState(true);

  const createCommentMutation = useMutation({
    mutationKey: ['create-comment'],
    mutationFn: createComment,
    onError: () => {
      toast(
        <FailureToast
          content={`Error adding ${
            entityType === 'post' ? 'Comment' : 'Reply'
          }`}
          dataTestId="comment-toaster"
        />,
        {
          closeButton: (
            <Icon name="closeCircleOutline" color="text-red-500" size={20} />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.red['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
    },
    onSuccess: async (data: any, _variables, _context) => {
      quillRef.current?.setEditorContents(quillRef.current?.getEditor(), '');
      removeMedia();
      if (mode === PostCommentMode.SendWish) {
        queryClient.invalidateQueries(['celebrations'], {
          exact: false,
        });
        if (entityId) {
          queryClient.invalidateQueries(['posts', entityId], {
            exact: false,
          });
          const post = getPost(entityId);
          if (post && post.id)
            updateFeed(
              entityId,
              produce(post, (draft) => {
                draft.commentsCount = draft.commentsCount
                  ? draft.commentsCount + 1
                  : 1;
              }),
            );
        }
        return;
      }
      await queryClient.setQueryData(
        ['comments', { entityId, entityType, limit: 4 }],
        (oldData) =>
          produce(oldData, (draft: any) => {
            draft.pages[0].data.result.data = [
              { id: data.id },
              ...draft.pages[0].data.result.data,
            ];
          }),
      );
      if (entityType === 'post' && entityId) {
        setComment({ ...comment, [data.id]: { ...data } });
        const post = getPost(entityId);
        updateFeed(
          entityId,
          produce(post, (draft) => {
            draft.commentsCount = draft.commentsCount
              ? draft.commentsCount + 1
              : 1;
          }),
        );
      } else if (entityType === 'comment' && entityId) {
        const updatedComment = produce(comment[entityId], (draft) => {
          draft.repliesCount = draft.repliesCount ? draft.repliesCount + 1 : 1;
        });
        setComment({
          ...comment,
          [data.id]: { ...data },
          [entityId]: updatedComment,
        });
      }
    },
    onSettled: () => {
      setIsCreateCommentLoading(false);
    },
  });

  const updateCommentMutation = useMutation({
    mutationKey: ['update-comment'],
    mutationFn: (payload: IUpdateCommentPayload) => {
      return updateComment(entityId || '', payload);
    },
    onMutate: (variables) => {
      const previousComment = comment[variables.entityId!];

      updateStoredComment(
        variables.entityId!,
        produce(comment[variables.entityId!], (draft) => {
          draft.content = {
            ...variables.content,
          };
          draft.mentions = variables.mentions;
          draft.hashtags = variables.hashtags;
        }),
      );
      quillRef.current?.setEditorContents(quillRef.current?.getEditor(), '');
      setEditComment && setEditComment(false);
      return { previousComment };
    },
    onError: (error: any, variables, context) => {
      if (context?.previousComment) {
        updateStoredComment(variables.entityId, context?.previousComment);
      }
      toast(
        <FailureToast
          content={`Error Updating ${
            entityType === 'post' ? 'Comment' : 'Reply'
          }`}
          dataTestId="comment-toaster"
        />,
        {
          closeButton: (
            <Icon name="closeCircleOutline" color="text-red-500" size={20} />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.red['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
    },
    onSuccess: (data: any, variables) => {
      updateStoredComment(variables.entityId!, { ...data });
      toast(
        <SuccessToast
          content={`${
            entityType === 'post' ? 'Comment' : 'Reply'
          } has been updated`}
          dataTestId="comment-toaster"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              color="text-primary-500"
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.primary['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
    },
  });

  useEffect(() => {
    if (suggestions && quillRef.current) {
      quillRef.current?.setEditorContents(
        quillRef.current?.getEditor(),
        suggestions,
      );
    }
  }, [suggestions]);

  const onSubmit = async () => {
    let fileIds: string[] = [];
    const mentionList: IMention[] = [];
    const hashtagList: string[] = [];

    hideMentionHashtagPalette();
    hideEmojiPalette();
    setIsCreateCommentLoading(true);

    if (files.length) {
      const uploadedMedia = await uploadMedia(files, EntityType.Comment);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      fileIds = uploadedMedia.map((media: IMedia) => media.id);
    }
    if (mode === PostCommentMode.Create || mode === PostCommentMode.SendWish) {
      let fileIds: string[] = [];
      if (files.length) {
        const uploadedMedia = await uploadMedia(files, EntityType.Comment);
        fileIds = uploadedMedia.map((media: IMedia) => media.id);
      }
      const commentContent = removeEmptyLines({
        text:
          quillRef.current
            ?.makeUnprivilegedEditor(quillRef.current?.getEditor())
            .getText() || '',
        html:
          quillRef.current
            ?.makeUnprivilegedEditor(quillRef.current?.getEditor())
            .getHTML() || '',
        editor: quillRef.current
          ?.makeUnprivilegedEditor(quillRef.current?.getEditor())
          .getContents() as DeltaStatic,
      });
      quillHashtagConversion(commentContent?.editor)?.ops?.forEach(
        (op: Record<string, any>) => {
          if (op?.insert && op?.insert.mention) {
            mentionList.push(op.insert.mention.id);
          } else if (op.insert && op?.insert?.hashtag) {
            hashtagList.push(op?.insert?.hashtag?.value);
          }
        },
      );
      const data = {
        entityId: entityId || '',
        entityType: entityType,
        content: commentContent,
        mentions: mentionList,
        hashtags: hashtagList,
        files: fileIds,
      };
      createCommentMutation.mutate(data);
    } else if (mode === PostCommentMode.Edit) {
      const commentContent = removeEmptyLines({
        text:
          quillRef.current
            ?.makeUnprivilegedEditor(quillRef.current?.getEditor())
            .getText() || '',
        html:
          quillRef.current
            ?.makeUnprivilegedEditor(quillRef.current?.getEditor())
            .getHTML() || '',
        editor: quillRef.current
          ?.makeUnprivilegedEditor(quillRef.current?.getEditor())
          .getContents() as DeltaStatic,
      });
      quillHashtagConversion(commentContent?.editor)?.ops?.forEach(
        (op: Record<string, any>) => {
          if (op?.insert && op?.insert.mention) {
            mentionList.push(op.insert.mention.id);
          } else if (op.insert && op?.insert?.hashtag) {
            hashtagList.push(op?.insert?.hashtag?.value);
          }
        },
      );
      const data: IUpdateCommentPayload = {
        entityId: entityId!,
        entityType: entityType,
        content: commentContent,
        mentions: mentionList,
        hashtags: hashtagList,
        files: commentData?.files.map((media: IMedia) => media.id) || [],
      };
      updateCommentMutation.mutate(data);
    }
  };

  const onChangeEditor = (content: any) => {
    const refinedContent = removeEmptyLines({
      editor: content.json,
      text: content.text,
      html: content.html,
    });
    setIsEmpty(
      isEmptyEditor(refinedContent.text, refinedContent.editor.ops || []),
    );
  };

  const getDataTestIdForErrors = (errorType: MediaValidationError) => {
    switch (errorType) {
      case MediaValidationError.MediaLengthExceed:
        return 'createpost-maxnumberuploadlimitreached-error';
      case MediaValidationError.ImageSizeExceed:
        return 'createpost-imageuploadlimitreached-error';
      case MediaValidationError.VideoSizeExceed:
        return 'createpost-videouploadlimitreached-error';
      case MediaValidationError.FileTypeNotSupported:
        return 'createpost-filetypenotsupported-error';
    }
  };

  useEffect(() => {
    if (quillRef.current) {
      onChangeEditor({
        text: quillRef.current
          ?.makeUnprivilegedEditor(quillRef.current?.getEditor())
          .getText(),
        json: quillRef.current
          ?.makeUnprivilegedEditor(quillRef.current?.getEditor())
          .getContents(),
        html: quillRef.current
          ?.makeUnprivilegedEditor(quillRef.current?.getEditor())
          .getHTML(),
      });
    }
  }, []);

  const loading =
    createCommentMutation.isLoading ||
    updateCommentMutation.isLoading ||
    uploadStatus === UploadStatus.Uploading;

  return (
    <div className={`flex flex-row ${className} `}>
      <div
        className={`flex flex-col items-center py-3 gap-2 border border-neutral-200 rounded-19xl border-solid w-full focus-within:border-primary-500 ${wrapperClassName}`}
      >
        <RichTextEditor
          toolbarId={`toolbar-${toolbarId || entityId}`}
          defaultValue={commentData?.content?.editor}
          placeholder={
            mode === PostCommentMode.SendWish
              ? 'Wish them now...'
              : 'Leave a comment...'
          }
          className="max-w-full flex-grow text-sm"
          ref={quillRef}
          dataTestId="postcomment-textbox"
          onChangeEditor={onChangeEditor}
          renderToolbar={() => (
            <div
              className="z-10 quill-toolbar quill-toolbar-icons !relative gap-4 ml-auto"
              id={`toolbar-${toolbarId || entityId}-toolbar`}
            >
              {mode === PostCommentMode.Edit && (
                <Button
                  label={'Cancel'}
                  size={Size.Small}
                  variant={Variant.Secondary}
                  className="text-sm !mx-0 !w-auto"
                  dataTestId="cancel-edit-comment"
                  onClick={() => setEditComment && setEditComment(false)}
                />
              )}
              <IconButton
                icon="image"
                className="!flex justify-center !mx-0 !p-0 !bg-inherit disabled:bg-inherit disabled:cursor-auto "
                size={SizeVariant.Large}
                variant={IconVariant.Primary}
                dataTestId={
                  mode === PostCommentMode.SendWish
                    ? 'send-image'
                    : 'postcomment-mediacta'
                }
                onClick={() => {
                  hideMentionHashtagPalette();
                  hideEmojiPalette();
                  inputRef && inputRef?.current?.click();
                }}
              />
              <button
                className="ql-emoji !mx-0 h-6 w-6"
                data-testid="send-gif"
                onMouseDown={() => hideMentionHashtagPalette()}
              />
              <IconButton
                icon={'send'}
                loading={loading}
                className="!flex justify-center !mx-0 !p-0 !bg-inherit disabled:bg-inherit disabled:cursor-auto "
                size={SizeVariant.Large}
                variant={IconVariant.Primary}
                onClick={onSubmit}
                dataTestId={
                  mode === PostCommentMode.SendWish
                    ? 'send-wishes-cta'
                    : 'postcomment-sendcta'
                }
                disabled={mediaValidationErrors.length > 0 || isEmpty}
              />
            </div>
          )}
        />
        {media.length > 0 && (
          <div className="w-full flex justify-start pl-6">
            <MediaPreview
              className="w-64 h-32 overflow-hidden rounded-9xl"
              media={media}
              mode={Mode.Edit}
              showAddMediaButton={false}
              showEditButton={false}
              onCloseButtonClick={removeMedia}
            />
          </div>
        )}
        {commentData && commentData?.files.length > 0 && (
          <div className="w-full flex justify-start pl-6 pointer-events-none opacity-50">
            <MediaPreview
              className="w-64 h-32 overflow-hidden rounded-9xl"
              media={commentData.files}
              showAddMediaButton={false}
              showEditButton={false}
            />
          </div>
        )}
        {mediaValidationErrors.map((error, index) => (
          <div className="px-4 mb-1 w-full" key={index}>
            <Banner
              title={error.errorMsg}
              variant={BannerVariant.Error}
              action={<></>}
              onClose={() => {
                setMediaValidationErrors([
                  ...mediaValidationErrors.filter(
                    (mediaError) => mediaError.errorType !== error.errorType,
                  ),
                ]);
                removeMedia();
              }}
              dataTestId={getDataTestIdForErrors(error.errorType)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
