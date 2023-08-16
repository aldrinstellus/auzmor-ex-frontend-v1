import useHover from 'hooks/useHover';
import React from 'react';
import SvgAnnouncementChartOutline from './AnnouncementChartOutline';

type IIconProps = {
  size?: number;
  className?: string;
  isActive?: boolean;
};

const AnnouncementChartIcon: React.FC<IIconProps> = ({
  className = '',
  isActive,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();
  return (
    <div className={className} {...eventHandlers}>
      <SvgAnnouncementChartOutline
        {...props}
        isActive={isActive || isHovered}
      />
    </div>
  );
};

export default AnnouncementChartIcon;
