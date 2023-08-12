import React from 'react';
import useHover from 'hooks/useHover';
import { default as SettingFilled } from './SettingFilled';
import { default as SettingOutline } from './SettingOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  isActive?: boolean;
};

const SettingIcon: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  disabled,
  isActive,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {!disabled && (hover || isHovered) ? (
        <SettingFilled {...props} />
      ) : (
        <SettingOutline {...props} />
      )}
    </div>
  );
};

export default SettingIcon;
