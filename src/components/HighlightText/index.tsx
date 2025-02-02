import React, { FC } from 'react';
import { escapeRegExp } from 'lodash';

interface IHighlightTextProps {
  text: string;
  subString?: string;
  className?: string;
}

const HighlightText: FC<IHighlightTextProps> = ({
  text,
  subString,
  className = 'text-primary-500 font-bold',
}) => {
  if (!subString) {
    return <span>{text}</span>;
  }

  const parts = text.split(new RegExp(`(${escapeRegExp(subString)})`, 'gi'));

  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === subString.toLowerCase() ? (
          <span key={index} className={className}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </span>
  );
};

export default HighlightText;
