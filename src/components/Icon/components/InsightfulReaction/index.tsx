import React from 'react';
import { default as Insightful } from './Insightful';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const InsightfulReaction: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      <Insightful {...props} />
    </div>
  );
};

export default InsightfulReaction;
