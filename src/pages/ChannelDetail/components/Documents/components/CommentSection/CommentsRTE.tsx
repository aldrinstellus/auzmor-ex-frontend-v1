import { FC, RefObject, useEffect, useRef, useState } from 'react';
import IconButton, {
  Variant as IconVariant,
  Size as SizeVariant,
} from 'components/IconButton';
import RichTextEditor from 'components/RichTextEditor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ReactQuill from 'react-quill';
import { DeltaStatic } from 'quill';
import {
  hideEmojiPalette,
  hideMentionHashtagPalette,
  isEmptyEditor,
  quillHashtagConversion,
  removeEmptyLines,
} from 'utils/misc';
import { produce } from 'immer';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import Button, { Size, Variant } from 'components/Button';
import MediaPreview, { Mode } from 'components/MediaPreview';
import {
  IMediaValidationError,
  MediaValidationError,
} from 'contexts/CreatePostContext';
import { IMedia, IMention, EntityType } from 'interfaces';
import { UploadStatus, useUpload } from 'hooks/useUpload';
import Banner, { Variant as BannerVariant } from 'components/Banner';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { useCommentStore } from 'stores/commentStore';
import { IComment } from 'components/Comments';

export enum DocCommentMode {
  Create = 'CREATE',
  Edit = 'EDIT',
}

interface CommentFormProps {
  className?: string;
  wrapperClassName?: string;
  channelId?: string,
  entityId?: string;
  entityType: string;
  mode?: DocCommentMode;
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
  toolbarId?: string;
}

interface IUpdateCommentPayload {
  content: { text: string; html: string; editor: DeltaStatic };
  hashtags: string[];
  mentions: Array<any>;
  files: string[];
}

export const CommentsRTE: FC<CommentFormProps> = ({
  className = '',
  wrapperClassName = '',
  channelId,
  entityId,
  entityType,
  mode = DocCommentMode.Create,
  commentData,
  setEditComment,
  inputRef = null,
  media = [],
  removeMedia = () => {},
  files = [],
  mediaValidationErrors = [],
  setIsCreateCommentLoading = () => {},
  setMediaValidationErrors = () => {},
  toolbarId,
}) => {
  const {
    comment,
    setComment,
    updateComment: updateStoredComment,
  } = useCommentStore();
  const queryClient = useQueryClient();
  const quillRef = useRef<ReactQuill>(null);
  const { uploadMedia, uploadStatus } = useUpload();
  const [isEmpty, setIsEmpty] = useState(true);
  const { getApi } = usePermissions();

  const createDocComment = getApi(ApiEnum.CreateChannelDocumentComments);
  const createCommentMutation = useMutation({
    mutationKey: ['create-comment'],
    mutationFn: ({
    channelId,
    fileId,
    payload,
  }: {
    channelId: string;
    fileId: string;
    payload: IUpdateCommentPayload;
  }) => createDocComment(channelId, fileId, payload),
    onError: () => {
      failureToastConfig({
        content: `Error adding ${entityType === 'comment' ? 'Comment' : 'Reply'}`,
        dataTestId: 'comment-toaster',
      });
    },
    onSuccess: async (data: any, _variables, _context) => {
      quillRef.current?.setEditorContents(quillRef.current?.getEditor(), '');
      removeMedia();
      await queryClient.setQueryData(
        ['comments', { channelId, fileId: entityId, limit: 4 }],
        (oldData) => {
          if (oldData) {
            return produce(oldData, (draft: any) => {
              draft.pages[0].data.data.comments = [
                { id: data.id },
                ...draft.pages[0].data.data.comments,
              ];
            });
          } else {
            queryClient.invalidateQueries(
              ['comments', { entityId, entityType, limit: 4 }],
              {
                exact: false,
              },
            );
          }
        },
      );
      if (entityType === 'comment' && entityId) {
        setComment({ ...comment, [data.id]: { ...data } });
      } else if (entityType === 'reply' && entityId) {
        console.log(entityId);
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

  const updateDocComment = getApi(ApiEnum.UpdateComment);
  const updateCommentMutation = useMutation({
  mutationKey: ['update-comment'],
  mutationFn: (variables: {
    commentId: string;
    payload: IUpdateCommentPayload;
  }) => {
    return updateDocComment(variables.commentId, variables.payload);
  },
  onMutate: async (variables) => {
    const { commentId, payload } = variables;
    const previousComment = comment[commentId];

    // Optimistically update the comment in store
    updateStoredComment(
      commentId,
      produce(previousComment, (draft) => {
        draft.content = { ...payload.content };
        draft.mentions = payload.mentions as IMention[];
        draft.hashtags = payload.hashtags;
      }),
    );

    // Optionally clear the editor & exit edit mode
    quillRef.current?.setEditorContents(quillRef.current?.getEditor(), '');
    setEditComment?.(false);

    return { previousComment };
  },
  onError: (error, variables, context) => {
    if (context?.previousComment) {
      updateStoredComment(variables.commentId, context.previousComment);
    }

    failureToastConfig({
      content: `Error Updating ${entityType === 'comment' ? 'Comment' : 'Reply'}`,
      dataTestId: 'comment-toaster',
    });
  },
  onSuccess: (data: any, variables) => {
    updateStoredComment(variables.commentId, { ...data });

    successToastConfig({
      content: `${entityType === 'comment' ? 'Comment' : 'Reply'} has been updated`,
      dataTestId: 'comment-toaster',
    });
  },
});

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
    if (mode === DocCommentMode.Create) {
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
        content: commentContent,
        mentions: mentionList,
        hashtags: hashtagList,
        files: fileIds,
      };
      createCommentMutation.mutate({
        channelId: channelId!,
        fileId: entityId!,
        payload: data,
      });
    } else if (mode === DocCommentMode.Edit) {
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
        content: commentContent,
        mentions: mentionList,
        hashtags: hashtagList,
        files: commentData?.files.map((media: IMedia) => media.id) || [],
      };
      updateCommentMutation.mutate({
        commentId: entityId!,
        payload: data,
      });
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
    <div className={`flex flex-row ${className}`}>
      <div
        className={`flex flex-col items-center py-3 gap-2 border border-neutral-200 rounded-19xl border-solid w-full focus-within:border-primary-500 ${wrapperClassName}`}
      >
        <RichTextEditor
          toolbarId={`toolbar-${toolbarId || entityId}`}
          defaultValue={commentData?.content?.editor}
          placeholder="Leave a comment..."
          className="max-w-full flex-grow text-sm"
          ref={quillRef}
          dataTestId="postcomment-textbox"
          onChangeEditor={onChangeEditor}
          renderToolbar={() => (
            <div
              className="z-10 quill-toolbar quill-toolbar-icons !relative gap-4 ml-auto"
              id={`toolbar-${toolbarId || entityId}-toolbar`}
            >
              {mode === DocCommentMode.Edit && (
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
                className="!flex justify-center !mx-0 !p-0 !bg-inherit disabled:bg-inherit disabled:!cursor-auto "
                size={SizeVariant.Large}
                variant={IconVariant.Primary}
                dataTestId="postcomment-mediacta"
                disabled={mode === DocCommentMode.Edit}
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
                dataTestId="postcomment-sendcta"
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
