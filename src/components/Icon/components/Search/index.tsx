import React from 'react';
import useHover from 'hooks/useHover';
import { default as SearchFilled } from './SearchFilled';
import { default as SearchOutline } from './SearchOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Search: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {!disabled && (hover || isHovered) ? (
        <SearchFilled {...props} />
      ) : (
        <SearchOutline {...props} />
      )}
    </div>
  );
};

export default Search;
