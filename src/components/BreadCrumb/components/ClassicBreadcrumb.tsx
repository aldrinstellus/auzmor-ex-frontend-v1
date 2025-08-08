import Icon from 'components/Icon';
import React, { FC } from 'react';
import { Item } from 'contexts/DocumentPathContext';
import clsx from 'clsx';

interface IClassicBreadcrumbProps {
  items: Item[];
  labelClassName?: string;
  iconWrapperClassName?: string;
  wrapperClassName?: string;
  iconSize?: number;
  folderIconSize?: number;
  onItemClick?: (
    item: Item,
    e?: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => void;
}

const ClassicBreadcrumb: FC<IClassicBreadcrumbProps> = ({
  items,
  labelClassName = '',
  iconWrapperClassName = '',
  wrapperClassName = '',
  iconSize = 16,
  folderIconSize,
  onItemClick = () => {},
}) => {
  const labelStyle = clsx({
    [labelClassName]: true,
    'flex font-medium text-neutral-500 cursor-pointer truncate': true,
  });
  return (
  <div className="flex items-center gap-2 w-full">
    <div className={`sticky left-0 z-10 flex items-center h-full ${iconWrapperClassName}`}>
      <Icon name="folder" size={folderIconSize || 20} />
    </div>
    <div className={`${wrapperClassName} flex items-center w-full h-full`}>
      <div className="flex items-center gap-2 pr-2">
        {items.map((each, index) => (
          <div key={each.id} className="flex items-center gap-2 h-6">
            <span
              className={`${
                index === items.length - 1
                  ? 'font-bold text-neutral-900 cursor-default'
                  : 'cursor-pointer'
              } ${labelStyle}`}
              onClick={(e) => onItemClick(each, e)}
            >
              {each.label}
            </span>
            {index < items.length - 1 && (
              <Icon name="arrowRight" size={iconSize} hover={false} />
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);
};

export default ClassicBreadcrumb;
