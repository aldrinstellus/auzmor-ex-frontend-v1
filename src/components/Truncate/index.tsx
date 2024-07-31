import { clsx } from 'clsx';
import Tooltip from 'components/Tooltip';
import { FC, useEffect, useMemo, useRef, useState } from 'react';

interface ITruncateProps {
  text: string;
  className?: string;
  dataTestId?: string;
  onClick?: () => void;
  toolTipClassName?: string;
  toolTipTextClassName?: string;
}

const Truncate: FC<ITruncateProps> = ({
  text,
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

  const compareSize = () => {
    if (textElementRef.current) {
      const compare =
        textElementRef.current.scrollWidth > textElementRef.current.clientWidth;
      setIsOverflow(compare);
    }
  };
  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
  }, []);
  useEffect(
    () => () => {
      window.removeEventListener('resize', compareSize);
    },
    [],
  );

  return (
    <Tooltip
      tooltipContent={text}
      showTooltip={isOverflow}
      textClassName={toolTipTextClassName}
      className={`z-10 ${toolTipClassName}`}
    >
      <p
        className={style}
        data-testid={dataTestId}
        onClick={onClick}
        ref={textElementRef}
      >
        {text}
      </p>
    </Tooltip>
  );
};

export default Truncate;
