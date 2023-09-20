import { emojiList } from 'components/RichTextEditor/emoji/emojiList';
import { FC, ReactElement } from 'react';

type EmojiProps = {
  value: string;
};

const Emoji: FC<EmojiProps> = ({ value }): ReactElement => {
  return (
    <span className="ql-emojiblot">
      <span className={`ap ap-${value}`}>
        {emojiList.find((emoji) => emoji.name === value)?.code_decimal}
      </span>
    </span>
  );
};

export default Emoji;
