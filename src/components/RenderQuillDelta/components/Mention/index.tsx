import React, { ReactElement } from 'react';
import { MentionUserCard } from '../MentionUserCard';

type MentionProps = {
  value: string;
};

export const Mention: React.FC<MentionProps> = (
  props: MentionProps,
): ReactElement => {
  return (
    <div>
      <span className="mention relative inline-block">
        <MentionUserCard
          fullName="Akshay Rajpurohit"
          email="akshay.r@auzmor.com"
          className="absolute -top-36 z-10 left-0 shadow-lg opacity-0 transition-opacity duration-200 hover:opacity-100 min-w-max"
        />
        <span className="cursor-pointer" contentEditable="false">
          <span className="ql-mention-denotation-char">{props?.value}</span>
        </span>
      </span>
    </div>
  );
};
