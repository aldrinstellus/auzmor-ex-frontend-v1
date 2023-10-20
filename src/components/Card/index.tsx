import { FC, ReactNode, useMemo } from 'react';
import clsx from 'clsx';
import useHover from 'hooks/useHover';

export type CardProps = {
  children?: ReactNode;
  className?: string;
  dataTestId?: string;
  shadowOnHover?: boolean;
};

const Card: FC<CardProps> = ({
  children,
  className = '',
  dataTestId = '',
  shadowOnHover = false,
}) => {
  const [isHovered, hoverEvents] = useHover();

  const cardStyle = useMemo(
    () =>
      clsx(
        { 'bg-white shadow rounded-9xl': true },
        { [className]: true },
        {
          'shadow-xl transition-all duration-300 ease-in-out':
            isHovered && shadowOnHover,
        },
        {
          'shadow-none transition-all duration-300 ease-out':
            !isHovered && shadowOnHover,
        },
      ),
    [isHovered],
  );

  return (
    <div className={cardStyle} data-testid={dataTestId} {...hoverEvents}>
      {children}
    </div>
  );
};

export default Card;
