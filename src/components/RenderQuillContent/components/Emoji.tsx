import { emojiList } from 'components/RichTextEditor/emoji/emojiList';
import React, { ReactElement } from 'react';

type EmojiProps = {
  value: string;
};

const Emoji: React.FC<EmojiProps> = ({ value }): ReactElement => {
  return (
    <span className="ql-emojiblot">
      <span className={`ap ap-${value}`}>
        {emojiList.find((emoji) => emoji.name === value)?.code_decimal}
      </span>
    </span>
  );
};

export default Emoji;
