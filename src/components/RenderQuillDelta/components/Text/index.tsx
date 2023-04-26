import { formatText, getStyles } from 'components/RenderQuillDelta/utils';
import React, { ReactElement } from 'react';

type TextProps = {
  value: string;
  attributes: any;
  isLink: boolean;
};
export const Text: React.FC<TextProps> = (props: TextProps): ReactElement => {
  switch (props?.isLink) {
    case true:
      return (
        <a className={getStyles(props?.attributes)}>
          {formatText(props?.value)}
        </a>
      );
    default:
      return (
        <span className={getStyles(props?.attributes)}>
          {formatText(props?.value)}
        </span>
      );
  }
};
