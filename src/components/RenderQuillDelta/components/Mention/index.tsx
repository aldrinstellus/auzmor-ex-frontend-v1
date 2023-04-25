import React, { ReactElement } from 'react';

type MentionProps = {
  value: string;
};

export const Mention: React.FC<MentionProps> = (
  props: MentionProps,
): ReactElement => {
  return (
    <span className="mention">
      <span contentEditable="false">
        <span className="ql-mention-denotation-char">{props?.value}</span>
      </span>
    </span>
  );
};
