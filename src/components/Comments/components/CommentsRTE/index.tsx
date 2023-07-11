import React, { useRef } from 'react';
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
import { twConfig } from 'utils/misc';
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
import { IMedia, IMediaValidationError } from 'contexts/CreatePostContext';
import { EntityType } from 'queries/files';
import {useUpload} from 'hooks/useUpload';

export enum PostCommentMode {
  Create = 'CREATE',
  Edit = 'EDIT',
}

interface CommentFormProps {
  className?: string;
  entityId?: string;
  entityType: string;
  mode?: PostCommentMode;
  setEditComment?: (edit: boolean) => void;
  commentData?: IComment;
  inputRef?: React.RefObject<HTMLInputElement> | null;
  media?: IMedia[];
  removeMedia?: () => void;
  files?: File[];
  mediaValidationErrors?: IMediaValidationError[];
  setIsCreateCommentLoading?: (state: boolean) => void;
}

interface IUpdateCommentPayload {
  entityId: string;
  entityType: string;
  content: {text: string, html: string, editor: DeltaStatic};
  hashtags: Array<any>;
  mentions: Array<any>;
  files: string[];
}

export const CommentsRTE: React.FC<CommentFormProps> = ({
  className = '',
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
  setIsCreateCommentLoading = () => {}
}) => {
  const {
    comment,
    setComment,
    updateComment: updateStoredComment,
  } = useCommentStore();
  const { feed, updateFeed } = useFeedStore();
  const queryClient = useQueryClient();
  const quillRef = useRef<ReactQuill>(null);
  const {uploadMedia} = useUpload();

  const createCommentMutation = useMutation({
    mutationKey: ['create-comment'],
    mutationFn: createComment,
    onMutate: () => {setIsCreateCommentLoading(true)},
    onError: (error: any) => {
      console.log(error);
    },
    onSuccess: async (data: any, variables, context) => {
      quillRef.current?.setEditorContents(quillRef.current?.getEditor(), '');
      removeMedia();
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
        updateFeed(
          entityId,
          produce(feed[entityId], (draft) => {
            draft.commentsCount = draft.commentsCount + 1;
          }),
        );
      } else if (entityType === 'comment' && entityId) {
        const updatedComment = produce(comment[entityId], (draft) => {
          draft.repliesCount = draft.repliesCount + 1;
        });
        setComment({
          ...comment,
          [data.id]: { ...data },
          [entityId]: updatedComment,
        });
      }
    },
    onSettled:() => {
      setIsCreateCommentLoading(false);
    }
  });

  const updateCommentMutation = useMutation({
    mutationKey: ['update-comment'],
    mutationFn: (payload: IUpdateCommentPayload) => {
      return updateComment(entityId || '', payload);
    },
    onMutate: (variables) => {
      const previousComment = comment[variables.entityId!]

      updateStoredComment(variables.entityId!, produce(comment[variables.entityId!], (draft) => {
        draft.content = {
          ...variables.content
        }
        draft.mentions = variables.mentions
        draft.hashtags = variables.hashtags
      }))
      quillRef.current?.setEditorContents(quillRef.current?.getEditor(), '');
      setEditComment && setEditComment(false);
      return {previousComment}
    },
    onError: (error: any, variables, context) => {
      if(context?.previousComment){
        updateStoredComment(variables.entityId, context?.previousComment)
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
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors.red['500']}
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.red['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
        },
      );
    },
    onSuccess: (data: any) => {
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
              stroke={twConfig.theme.colors.primary['500']}
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
        },
      );
    },
  });

  const onSubmit = async () => {
    let fileIds:string[] = [];
    if(files.length){
      const uploadedMedia = await uploadMedia(files, EntityType.Comment);
      fileIds = uploadedMedia.map((media: IMedia) => media.id)
    }
    if (mode === PostCommentMode.Create) {
      const commentContent = {
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
      };
      const data = {
        entityId: entityId || '',
        entityType: entityType,
        content: commentContent,
        hashtags: [],
        mentions: [],
        files: fileIds
      };
      createCommentMutation.mutate(data);
    } else if (mode === PostCommentMode.Edit) {
      const commentContent = {
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
      };
      const data: IUpdateCommentPayload = {
        entityId: entityId!,
        entityType: entityType,
        content: commentContent,
        hashtags: [],
        mentions: [],
        files: commentData?.files.map((media: IMedia) => media.id) || []
      };
      updateCommentMutation.mutate(data);
    }
  };

  return (
    <div className={`flex flex-row ${className} `}>
      <div className="flex flex-col items-center py-3 gap-2 border border-neutral-200 rounded-19xl border-solid w-full">
        <RichTextEditor
          toolbarId={`toolbar-${entityId}`}
          defaultValue={commentData?.content?.editor}
          placeholder="Leave a comment..."
          className="max-h-18 w-[70%] max-w-[70%]"
          ref={quillRef}
          dataTestId="postcomment-textbox"
          renderToolbar={() => (
            <div
              className="flex flex-row items-center z-10 -ml-32 absolute top-0 right-2 quill-toolbar"
              id={`toolbar-${entityId}-toolbar`}
            >
              <div className="mr-6">
                {mode === PostCommentMode.Edit && (
                  <Button
                    label={'Cancel'}
                    size={Size.Small}
                    variant={Variant.Secondary}
                    className="text-sm"
                    dataTestId="cancel-edit-comment"
                    onClick={() => setEditComment && setEditComment(false)}
                  />
                )}
              </div>
              {mode !== PostCommentMode.Edit && <IconButton icon={'imageOutline'}
                className="flex mx-0 !p-0 !bg-inherit disabled:bg-inherit disabled:cursor-auto "
                size={SizeVariant.Large}
                variant={IconVariant.Primary}
                dataTestId="postcomment-mediacta"
                onClick={() => inputRef && inputRef?.current?.click()}
                fill={twConfig.theme.colors.primary['500']} />}
              <button className="ql-emoji" />
              <IconButton
                icon={'send'}
                className="flex mx-0 !p-0 !bg-inherit disabled:bg-inherit disabled:cursor-auto "
                size={SizeVariant.Large}
                variant={IconVariant.Primary}
                onClick={() => {
                  onSubmit();
                }}
                dataTestId="postcomment-sendcta"
                fill={twConfig.theme.colors.primary['500']}
              />
            </div>
          )}
        />
        {media.length > 0 && <div className='w-full flex justify-start pl-6'><MediaPreview className='w-64 h-32 overflow-hidden rounded-9xl' media={media} mode={Mode.Edit} showAddMediaButton={false} showEditButton={false} onCloseButtonClick={removeMedia}/></div>}
        {commentData && commentData?.files.length > 0 && <div className='w-full flex justify-start pl-6 pointer-events-none opacity-50'><MediaPreview className='w-64 h-32 overflow-hidden rounded-9xl' media={commentData.files} showAddMediaButton={false} showEditButton={false}/></div>}
        {mediaValidationErrors.map((error: IMediaValidationError, index: number) => <div key={index} className="text-red-500 flex justify-start w-full pl-6"><div className='mr-2'><Icon name='infoCircle' stroke={twConfig.theme.colors.red['500']} /></div><div className='truncate'>{error.errorMsg}</div></div>)}
      </div>
    </div>
  );
};
