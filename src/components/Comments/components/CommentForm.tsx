import React, { useRef } from 'react';
import IconButton, {
  Variant as IconVariant,
  Size as SizeVariant,
} from 'components/IconButton';
import RichTextEditor from 'components/RichTextEditor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComments } from 'queries/reaction';
import ReactQuill from 'react-quill';
import { DeltaStatic } from 'quill';

interface CommentFormProps {
  className?: string;
  entityId: string;
  entityType: string;
  defaultValue?: string;
  inputRef?: any;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  className = '',
  entityId,
  entityType,
  defaultValue,
  inputRef,
}) => {
  const queryClient = useQueryClient();

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
      entityType: entityType,
      content: commentData,
      hashtags: [],
      mentions: [],
    };

    createCommentMutation.mutate(data);
  };

  return (
    <div className={`flex flex-row ${className} `}>
      <div
        ref={inputRef}
        className="flex items-center py-3 gap-2 border border-neutral-200 rounded-19xl border-solid w-full"
      >
        <RichTextEditor
          placeholder="Leave a Comment..."
          className="max-h-18 overflow-y-auto w-[70%] max-w-[70%]"
          ref={quillRef}
          defaultValue={defaultValue}
        />
      </div>

      <div className="flex flex-row items-center z-10 -ml-32">
        <IconButton
          icon={'iconLinear'}
          className="flex mx-2 !p-0 cursor-pointer !bg-inherit hover:bg-inherit"
          size={SizeVariant.Large}
          variant={IconVariant.Primary}
          dataTestId="postcomment-attachmediacta"
        />
        <IconButton
          icon={'emojiHappy'}
          className="flex mx-2 !p-0 cursor-pointer !bg-inherit hover:bg-inherit"
          size={SizeVariant.Large}
          variant={IconVariant.Primary}
          dataTestId="postcomment-addemojiscta"
        />
        <IconButton
          icon={'send'}
          className="flex mx-2 !p-0 !bg-inherit hover:bg-inherit disabled:bg-inherit disabled:cursor-auto "
          size={SizeVariant.Large}
          variant={IconVariant.Primary}
          onClick={() => {
            onSubmit();
          }}
          dataTestId="postcomment-sendcta"
        />
      </div>
    </div>
  );
};
