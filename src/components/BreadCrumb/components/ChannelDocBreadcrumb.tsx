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
  onItemClick?: (
    item: Item,
    e?: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => void;
}

const ChannelDocBreadcrumb: FC<IChannelDocBreadcrumbProps> = ({
  items,
  width = 630,
  iconSize = 20,
  labelClassName = '',
  onItemClick = () => {},
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [popupItemIndex, setPopupItemIndex] = useState<number>(0);
  const labelStyle = clsx({
    'flex text-2xl font-medium text-neutral-500 cursor-pointer truncate': true,
    [labelClassName]: true,
  });

  useEffect(() => {
    setPopupItemIndex(Math.max(0, items.length - 2));
  }, [items]);

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
              onClick: () => onItemClick(each),
              stroke: 'text-neutral-900',
              dataTestId: 'post-ellipsis-edit-comment',
            }))}
            className="mt-1 border-1 border-neutral-200 focus-visible:outline-none"
          />
        </div>
      )}
      {popupItemIndex > 0 && (
        <Icon name="arrowRight" size={20} hover={false} className="flex" />
      )}
      {items.slice(popupItemIndex).map((each, index) => (
        <div
          key={each.id}
          className={`flex items-center gap-2 ${
            index === items.length - 1 && 'flex-grow'
          }`}
        >
          <div
            className={`${labelStyle} ${
              index === items.slice(popupItemIndex).length - 1 &&
              'font-bold text-neutral-900 cursor-default flex-grow'
            }`}
            onClick={() => onItemClick(each)}
          >
            <Truncate
              text={each.label}
              className={index !== items.length - 1 ? 'max-w-[240px]' : ''}
            />
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
