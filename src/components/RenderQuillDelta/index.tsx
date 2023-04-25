import React, { ReactElement } from 'react';
import { emojiList } from 'components/RichTextEditor/emoji/emojiList';
import { Delta, DeltaOperation } from 'quill';

const formatText = (text: string) => {
  return Array.from(text, (char, index) =>
    char === '\n' ? <br key={index} /> : char,
  );
};

function RenderDeltaOperation(deltaOperation: DeltaOperation): ReactElement {
  // If the delta operation corresponds to a mention
  if (deltaOperation.insert?.mention) {
    return (
      <span
        className="mention"
        data-index={deltaOperation.insert.mention?.index}
        data-denotion-char={deltaOperation.insert?.mention?.denotationChar}
        data-id={deltaOperation.insert.mention?.id}
      >
        <span contentEditable="false">
          <span className="ql-mention-denotation-char">
            {deltaOperation.insert.mention?.value}
          </span>
        </span>
      </span>
    );
  }

  // If the delta operation corresponds to a emoji
  else if (deltaOperation.insert?.emoji) {
    return (
      <span className="ql-emojiblot">
        <span contentEditable="false">
          <span className={`ap ap-${deltaOperation.insert.emoji}`}>
            {emojiList.find(
              (emoji) => emoji.name === deltaOperation.insert.emoji,
            )?.code_decimal || ''}
          </span>
        </span>
      </span>
    );
  }

  // If the delta operation does not correspond to a mention/hashtag/emoji
  else {
    const styles: any = {};

    Object.keys(
      deltaOperation?.attributes ? deltaOperation.attributes : [],
    ).forEach((key) => {
      const value = deltaOperation.attributes
        ? deltaOperation.attributes[key]
        : undefined;

      // For bold text
      if (key === 'bold' && value === true) {
        styles.fontWeight = 'bold';
      }

      // For italic text
      if (key === 'italic' && value === true) {
        styles.fontStyle = 'italic';
      }

      // For underlined text
      if (key === 'underline' && value === true) {
        styles.textDecoration = 'underline';
      }
    });

    return <span style={styles}>{formatText(deltaOperation.insert)}</span>;
  }
}

type RenderQuillDeltaProps = {
  delta: Delta;
};

export const RenderQuillDelta: React.FC<RenderQuillDeltaProps> = ({
  delta,
}): ReactElement => {
  const content = delta?.ops?.map((op: DeltaOperation, index: number) => {
    if (op?.insert) {
      if (op.insert?.attributes?.link) {
        return (
          <a key={index} href={op.insert.attributes.link}>
            {RenderDeltaOperation(op)}
          </a>
        );
      } else {
        return <span key={index}>{RenderDeltaOperation(op)}</span>;
      }
    }
  });

  return <div>{content}</div>;
};
