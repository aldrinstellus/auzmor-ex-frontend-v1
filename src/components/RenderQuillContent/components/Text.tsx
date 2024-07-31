import { clsx } from 'clsx';
import { formatText, getStyles } from 'components/RenderQuillContent/utils';
import { FC, ReactElement, useMemo } from 'react';

type TextProps = {
  value: string;
  attributes: any;
  isLink: boolean;
  link: string;
  isHeading: boolean;
};
export const Text: FC<TextProps> = ({
  value,
  attributes,
  isLink,
  link,
  isHeading,
}): ReactElement => {
  const style = useMemo(
    () =>
      clsx({
        [`${getStyles(attributes)}`]: true,
        'text-xl font-bold': isHeading,
        'underline text-primary-500 text': isLink,
      }),
    [isHeading, attributes, isLink],
  );

  if (isLink) {
    return (
      <a
        href={link}
        target="_blank"
        role="button"
        className={style}
        rel="noreferrer"
      >
        {formatText(value)}
      </a>
    );
  }

  return <span className={style}>{formatText(value)}</span>;
};
