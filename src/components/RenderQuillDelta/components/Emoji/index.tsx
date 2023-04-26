import { emojiList } from 'components/RichTextEditor/emoji/emojiList';
import React, { ReactElement } from 'react';

type EmojiProps = {
  value: string;
};

export const Emoji: React.FC<EmojiProps> = (
  props: EmojiProps,
): ReactElement => {
  return (
    <span className="ql-emojiblot">
      <span className={`ap ap-${props.value}`}>
        {emojiList.find((emoji) => emoji.name === props.value)?.code_decimal}
      </span>
    </span>
  );
};
