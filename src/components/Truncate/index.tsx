import { clsx } from 'clsx';
import Tooltip from 'components/Tooltip';
import { FC, useEffect, useMemo, useRef, useState } from 'react';

interface ITruncateProps {
  text: string;
  maxLength?: number;
  textRenderer?: (text: string) => React.ReactNode;
  className?: string;
  dataTestId?: string;
  onClick?: () => void;
  toolTipClassName?: string;
  toolTipTextClassName?: string;
}

const Truncate: FC<ITruncateProps> = ({
  text,
  maxLength,
  textRenderer,
  className = '',
  dataTestId,
  onClick,
  toolTipClassName = '',
  toolTipTextClassName = '',
}) => {
  const textElementRef = useRef<HTMLParagraphElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);

  const style = useMemo(
    () =>
      clsx({
        'whitespace-nowrap overflow-hidden text-ellipsis': true,
        [className]: true,
      }),
    [className, text],
  );
  const toolTipStyle = useMemo(
    () =>
      clsx({
        'z-10 text-wrap': true,
        [toolTipClassName]: true,
      }),
    [toolTipClassName],
  );

  const compareSize = () => {
    if (textElementRef.current) {
      const compare =
        textElementRef.current.scrollWidth > textElementRef.current.clientWidth;
      setIsOverflow(compare);
    }
  };

  useEffect(() => {
    if (maxLength && text.length > maxLength) {
      setIsOverflow(true);
    } else {
      compareSize();
      window.addEventListener('resize', compareSize);
    }
    return () => {
      window.removeEventListener('resize', compareSize);
    };
  }, [maxLength, text]);

  const truncatedText =
    maxLength && text.length > maxLength
      ? `${text.slice(0, maxLength - 3)}...`
      : text;

  return (
    <Tooltip
      tooltipContent={text}
      showTooltip={isOverflow}
      textClassName={toolTipTextClassName}
      className={toolTipStyle}
    >
      <p
        className={style}
        data-testid={dataTestId}
        onClick={onClick}
        ref={textElementRef}
      >
        {textRenderer ? textRenderer(truncatedText) : truncatedText}
      </p>
    </Tooltip>
  );
};

export default Truncate;
