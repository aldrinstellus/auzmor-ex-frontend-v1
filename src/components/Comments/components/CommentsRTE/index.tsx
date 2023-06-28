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
import { twConfig } from 'utils/misc';
import { IComment } from 'components/Comments';

export enum PostCommentMode {
  Create = 'CREATE',
  Edit = 'EDIT',
}

interface CommentFormProps {
  className?: string;
  entityId?: string;
  entityType: string;
  mode?: PostCommentMode;
}

export const CommentsRTE: React.FC<CommentFormProps> = ({
  className = '',
  entityId,
  entityType,
  mode = PostCommentMode.Create,
}) => {
  const queryClient = useQueryClient();
  const quillRef = useRef<ReactQuill>(null);

  const createCommentMutation = useMutation({
    mutationKey: ['create-comment'],
    mutationFn: createComment,
    onError: (error: any) => {
      console.log(error);
    },
    onSuccess: (data: any, variables, context) => {
      quillRef.current?.setEditorContents(quillRef.current?.getEditor(), '');
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  const updateCommentMutation = useMutation({
    mutationKey: ['update-comment'],
    mutationFn: (payload: any) => updateComment(payload.id || '', payload),
    onError: (error: any) => {
      console.log(error);
    },
    onSuccess: (data: any) => {
      quillRef.current?.setEditorContents(quillRef.current?.getEditor(), '');
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  const onSubmit = () => {
    if (mode === PostCommentMode.Create) {
      const commentData = {
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
        content: commentData,
        hashtags: [],
        mentions: [],
      };
      createCommentMutation.mutate(data);
    } else if (mode === PostCommentMode.Edit) {
      const commentData = {
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
        content: commentData,
        hashtags: [],
        mentions: [],
      };
      updateCommentMutation.mutate(data);
    }
  };

  return (
    <div className={`flex flex-row ${className} `}>
      <div className="flex items-center py-3 gap-2 border border-neutral-200 rounded-19xl border-solid w-full">
        <RichTextEditor
          toolbarId={`toolbar-${entityId}`}
          placeholder="Leave a Comment..."
          className="max-h-18 w-[70%] max-w-[70%]"
          ref={quillRef}
          dataTestId="postcomment-textbox"
          renderToolbar={() => (
            <div
              className="flex flex-row items-center z-10 -ml-32 absolute top-0 right-2 quill-toolbar"
              id={`toolbar-${entityId}-toolbar`}
            >
              <button className="ql-emoji" />
              <IconButton
                icon={'send'}
                className="flex mx-2 !p-0 !bg-inherit disabled:bg-inherit disabled:cursor-auto "
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
      </div>
    </div>
  );
};
