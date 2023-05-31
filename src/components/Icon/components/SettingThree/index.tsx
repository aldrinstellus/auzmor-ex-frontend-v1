import React from 'react';
import useHover from 'hooks/useHover';
import { default as SettingThreeFilled } from './SettingThreeFilled';
import { default as SettingThreeOutline } from './SettingThreeOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const SettingThreeIcon: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {!disabled && (hover || isHovered) ? (
        <SettingThreeFilled {...props} />
      ) : (
        <SettingThreeOutline {...props} />
      )}
    </div>
  );
};

export default SettingThreeIcon;
