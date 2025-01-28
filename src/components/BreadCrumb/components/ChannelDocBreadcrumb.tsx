import Icon from 'components/Icon';
import PopupMenu from 'components/PopupMenu';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Item } from 'contexts/DocumentPathContext';
import clsx from 'clsx';
import Truncate from 'components/Truncate';

interface IChannelDocBreadcrumbProps {
  items: Item[];
  width?: number | '100%' | '100vw' | '100vh';
  iconSize?: number;
  labelClassName?: string;
  onItemClick?: (item: Item) => void;
}

const ChannelDocBreadcrumb: FC<IChannelDocBreadcrumbProps> = ({
  items,
  width = 548,
  iconSize = 20,
  labelClassName = '',
  onItemClick = () => {},
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [popupItemIndex, setPopupItemIndex] = useState<number>(0);
  const labelStyle = clsx({
    'flex text-2xl font-medium text-neutral-500 cursor-pointer truncate max-w-[240px]':
      true,
    [labelClassName]: true,
  });

  useEffect(() => {
    if (ref.current) {
      if (ref.current.clientWidth < ref.current.scrollWidth) {
        setPopupItemIndex((popupItemIndex) => popupItemIndex + 1);
      }
    }
  }, [items, popupItemIndex]);

  const handleItemClick = (item: Item) => {
    onItemClick(item);
    setPopupItemIndex(0);
  };

  return (
    <div className="flex items-center gap-2" ref={ref} style={{ width }}>
      {popupItemIndex > 0 && (
        <div className="relative">
          <PopupMenu
            triggerNode={
              <div
                className="cursor-pointer relative"
                data-testid="comment-ellipsis"
              >
                <Icon name="more" ariaLabel="more" tabIndex={0} />
              </div>
            }
            menuItems={items.slice(0, popupItemIndex).map((each) => ({
              label: each.label,
              onClick: () => handleItemClick(each),
              stroke: 'text-neutral-900',
              dataTestId: 'post-ellipsis-edit-comment',
            }))}
            className="mt-1 border-1 border-neutral-200 focus-visible:outline-none"
          />
        </div>
      )}
      {popupItemIndex > 0 && <Icon name="arrowRight" size={20} hover={false} />}
      {items.slice(popupItemIndex).map((each, index) => (
        <div key={each.id} className="flex items-center gap-2">
          <div
            className={`${labelStyle} ${
              index === items.slice(popupItemIndex).length - 1 &&
              'font-bold text-neutral-900 cursor-default'
            }`}
            onClick={() => handleItemClick(each)}
          >
            <Truncate text={each.label} className="max-w-[240px]" />
          </div>
          {index < items.slice(popupItemIndex).length - 1 && (
            <Icon name="arrowRight" size={iconSize} hover={false} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ChannelDocBreadcrumb;
