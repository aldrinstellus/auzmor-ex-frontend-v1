import Icon from 'components/Icon';
import React, { FC } from 'react';
import { Item } from 'contexts/DocumentPathContext';
import clsx from 'clsx';

interface IClassicBreadcrumbProps {
  items: Item[];
  labelClassName?: string;
  iconSize?: number;
  onItemClick?: (item: Item) => void;
}

const ClassicBreadcrumb: FC<IClassicBreadcrumbProps> = ({
  items,
  labelClassName = '',
  iconSize = 16,
  onItemClick = () => {},
}) => {
  const labelStyle = clsx({
    [labelClassName]: true,
    'flex font-medium text-neutral-500 cursor-pointer truncate': true,
  });
  return (
    <div className="flex items-center gap-2 w-full overflow-hidden">
      {items.map((each, index) => (
        <div key={each.id} className="flex items-center gap-2 h-6">
          <Icon name="folder" size={20} />
          <span
            className={`${
              index === items.length - 1 &&
              'font-bold text-neutral-900 cursor-default'
            } ${labelStyle}`}
            onClick={() => onItemClick(each)}
          >
            {each.label}
          </span>
          {index < items.length - 1 && (
            <Icon name="arrowRight" size={iconSize} hover={false} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ClassicBreadcrumb;
