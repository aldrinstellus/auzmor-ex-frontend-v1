import { formatText, getStyles } from 'components/RenderPost/utils';
import React, { ReactElement } from 'react';

type TextProps = {
  value: string;
  attributes: any;
  isLink: boolean;
};
export const Text: React.FC<TextProps> = ({
  value,
  attributes,
  isLink,
}): ReactElement => {
  switch (isLink) {
    case true:
      return <a className={getStyles(attributes)}>{formatText(value)}</a>;
    default:
      return <span className={getStyles(attributes)}>{formatText(value)}</span>;
  }
};
