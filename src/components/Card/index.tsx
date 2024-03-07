import { FC, ReactNode, useMemo } from 'react';
import clsx from 'clsx';
import useHover from 'hooks/useHover';

export type CardProps = {
  children?: ReactNode;
  className?: string;
  dataTestId?: string;
  shadowOnHover?: boolean;
  onClick?: () => void;
};

const Card: FC<CardProps> = ({
  children,
  className = '',
  dataTestId = '',
  shadowOnHover = false,
  onClick = () => {},
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
    <div
      className={cardStyle}
      data-testid={dataTestId}
      {...hoverEvents}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
