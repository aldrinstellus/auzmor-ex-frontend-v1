import { formatText, getStyles } from 'components/RenderQuillContent/utils';
import { FC, ReactElement } from 'react';

type TextProps = {
  value: string;
  attributes: any;
  isLink: boolean;
};
export const Text: FC<TextProps> = ({
  value,
  attributes,
  isLink,
}): ReactElement => {
  switch (isLink) {
    case true:
      return (
        <a
          href={value}
          target="_blank"
          role="button"
          className={`${getStyles(attributes)} underline text-primary-500`}
          rel="noreferrer"
        >
          {formatText(value)}
        </a>
      );
    default:
      return <span className={getStyles(attributes)}>{formatText(value)}</span>;
  }
};
