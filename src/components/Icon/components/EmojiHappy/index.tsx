import React from 'react';
import useHover from 'hooks/useHover';
import { default as EmojiHappyFilled } from './EmojiHappyFilled';
import { default as EmojiHappyOutline } from './EmojiHappyOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const EmojiHappy: React.FC<IconProps> = ({
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
        <EmojiHappyFilled {...props} />
      ) : (
        <EmojiHappyOutline {...props} />
      )}
    </div>
  );
};

export default EmojiHappy;
