import React, { Dispatch, SetStateAction, useState } from 'react';
import IconButton, {
  Variant as IconVariant,
  Size as SizeVariant,
} from 'components/IconButton';
import RichTextEditor from 'components/RichTextEditor';

interface CommentFormProps {
  handleSubmit: (text: any, parentId?: string | null | undefined) => void;
  className?: string;
  setReplyInputBox: Dispatch<SetStateAction<boolean>>;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  handleSubmit,
  className = '',
  setReplyInputBox,
}) => {
  const [text, setText] = useState('');
  const [editorValue, setEditorValue] = useState<{
    html: string;
    text: string;
    json: Record<string, any>;
  }>({ html: '', json: {}, text: '' });

  const onSubmit = (event: any) => {
    event.preventDefault();
    console.log(editorValue);
    //handleSubmit(text);
    setText('');
    setReplyInputBox(false);
  };
  return (
    <div className={`flex flex-row ${className} `}>
      <input
        className="py-3 px-5 gap-2 box-border border rounded-[32px] border-neutral-200 w-[550px] align-top"
        value={text}
        type="text"
        onChange={(e) => setText(e.target.value)}
      />

      {/* <div className="flex flex-row items-center py-3 px-5 gap-2 border border-neutral-200 rounded-[32px] border-solid w-[100%]">
        <RichTextEditor
          placeholder="Leave a Comment..."
          className="max-h-6 overflow-y-auto w-full min-h-[24px] "
          onChangeEditor={(content) => setEditorValue({ ...content })}
        />
      </div> */}

      <div className="flex ml-[-130px] flex-row items-center">
        <IconButton
          icon={'emojiHappy'}
          className="mx-2 !p-0 cursor-pointer bg-inherit hover:bg-inherit"
          //  onClick={onClose}
          size={SizeVariant.Large}
          variant={IconVariant.Primary}
        />
        <IconButton
          icon={'iconLinear'}
          className="mx-2 !p-0 cursor-pointer bg-inherit hover:bg-inherit"
          // onClick={onClose}
          size={SizeVariant.Large}
          variant={IconVariant.Primary}
        />
        <IconButton
          icon={'send'}
          className="mx-2 !p-0 cursor-pointer bg-inherit hover:bg-inherit disabled:bg-inherit "
          size={SizeVariant.Large}
          variant={IconVariant.Primary}
          disabled={text ? false : true}
          onClick={onSubmit}
        />
      </div>
    </div>
  );
};
