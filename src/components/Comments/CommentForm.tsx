import React, { useRef, useState } from 'react';
import IconButton, {
  Variant as IconVariant,
  Size as SizeVariant,
} from 'components/IconButton';
import RichTextEditor from 'components/RichTextEditor';
import { useMutation } from '@tanstack/react-query';
import { createComments } from 'queries/reaction';
import queryClient from 'utils/queryClient';
import ReactQuill from 'react-quill';
import { DeltaStatic } from 'quill';

interface CommentFormProps {
  className?: string;
  entityId?: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  className = '',
  entityId,
}) => {
  const quillRef = useRef<ReactQuill>(null);

  const createCommentMutation = useMutation({
    mutationKey: ['create-comment-mutation'],
    mutationFn: createComments,
    onError: (error: any) => {
      console.log(error);
    },
    onSuccess: (data: any, variables, context) => {
      quillRef.current?.setEditorContents(quillRef.current?.getEditor(), '');
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  const onSubmit = () => {
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
      entityType: 'post',
      content: commentData,
      hashtags: [],
      mentions: [],
    };

    createCommentMutation.mutate(data);
  };

  return (
    <div className={`flex flex-row ${className} `}>
      <div className="flex items-center py-3 gap-2 border border-neutral-200 rounded-19xl border-solid w-full">
        <RichTextEditor
          placeholder="Leave a Comment..."
          className="max-h-6 overflow-y-auto w-full"
          ref={quillRef}
        />
      </div>

      <div className="flex flex-row items-center z-10 -ml-40">
        <IconButton
          icon={'emojiHappy'}
          className="mx-2 !p-0 cursor-pointer !bg-inherit hover:bg-inherit"
          size={SizeVariant.Large}
          variant={IconVariant.Primary}
        />
        <IconButton
          icon={'iconLinear'}
          className="mx-2 !p-0 cursor-pointer !bg-inherit hover:bg-inherit"
          size={SizeVariant.Large}
          variant={IconVariant.Primary}
        />
        <IconButton
          icon={'send'}
          className="mx-2 !p-0 !bg-inherit hover:bg-inherit disabled:bg-inherit disabled:cursor-auto "
          size={SizeVariant.Large}
          variant={IconVariant.Primary}
          onClick={() => {
            onSubmit();
          }}
        />
      </div>
    </div>
  );
};
