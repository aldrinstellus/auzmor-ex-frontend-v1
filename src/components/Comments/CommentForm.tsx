import React, { Dispatch, SetStateAction, useState } from 'react';
import Image from 'images/Image.png';
import Smily from 'images/smily.png';
import Send from 'images/send.png';

interface CommentFormProps {
  handleSubmit: (text: any, parentId?: string | null | undefined) => void;
  className?: string;
  setReplyInputBox: Dispatch<SetStateAction<boolean>>;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  handleSubmit,
  className,
  setReplyInputBox,
}) => {
  const [text, setText] = useState('');
  const onSubmit = (event: any) => {
    event.preventDefault();
    handleSubmit(text);
    setText('');
    setReplyInputBox(false);
  };
  return (
    <form onSubmit={onSubmit}>
      <div className={`flex flex-row items-center ${className} `}>
        <input
          className="py-3 px-5 gap-2 box-border border rounded-8 border-neutral-200 w-[550px] align-top"
          value={text}
          type="text"
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex ml-[-130px] flex-row items-center">
          <button>
            <img
              className="mx-2 cursor-pointer"
              width={24}
              height={24}
              src={Image}
            />
          </button>
          <button>
            <img
              className="mx-2 cursor-pointer"
              width={24}
              height={24}
              src={Smily}
            />
          </button>
          <button onClick={onSubmit}>
            <img
              className="mx-2 cursor-pointer"
              width={24}
              height={24}
              src={Send}
            />
          </button>
        </div>
      </div>
    </form>
  );
};
