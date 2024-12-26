import Icon from 'components/Icon';
import React, { FC } from 'react';
import { Item } from 'contexts/DocumentPathContext';

interface IClassicBreadcrumbProps {
  items: Item[];
  className?: string;
  onItemClick?: (item: Item) => void;
}

const ClassicBreadcrumb: FC<IClassicBreadcrumbProps> = ({
  items,
  className = '',
  onItemClick = () => {},
}) => {
  return (
    <div className="flex items-center gap-2 w-full overflow-hidden">
      {items.map((each, index) => (
        <div key={each.id} className="flex items-center gap-2 h-6">
          <Icon name="folder" size={20} />
          <span
            className={`flex font-medium text-neutral-500 cursor-pointer truncate ${
              index === items.length - 1 &&
              'font-bold text-neutral-900 cursor-default'
            } ${className}`}
            onClick={() => onItemClick(each)}
          >
            {each.label}
          </span>
          {index < items.length - 1 && (
            <Icon name="arrowRight" size={16} hover={false} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ClassicBreadcrumb;
