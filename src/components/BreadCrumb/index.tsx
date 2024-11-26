import Icon from 'components/Icon';
import PopupMenu from 'components/PopupMenu';
import { Item } from 'contexts/DocumentPathContext';
import React, { FC, useEffect, useRef, useState } from 'react';

interface IBreadCrumbProps {
  items: Item[];
  onItemClick?: (item: Item) => void;
}

const BreadCrumb: FC<IBreadCrumbProps> = ({
  items,
  onItemClick = () => {},
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [popupItemIndex, setPopupItemIndex] = useState<number>(0);

  useEffect(() => {
    if (ref.current) {
      if (ref.current.clientWidth < ref.current.scrollWidth) {
        setPopupItemIndex(popupItemIndex + 1);
      } else {
        setPopupItemIndex(0);
      }
    }
  }, [items]);

  console.log(popupItemIndex);
  return (
    <div className="flex items-center gap-2 w-[700px]" ref={ref}>
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
      {popupItemIndex > 0 && <Icon name="arrowRight" size={20} hover={false} />}
      {items.slice(popupItemIndex).map((each, index) => (
        <div key={each.id} className="flex items-center gap-2">
          <div
            className={`flex text-2xl font-medium text-neutral-500 cursor-pointer truncate max-w-[240px] ${
              index === items.slice(popupItemIndex).length - 1 &&
              'font-bold text-neutral-900 cursor-default'
            }`}
            onClick={() => onItemClick(each)}
          >
            {each.label}
          </div>
          {index < items.slice(popupItemIndex).length - 1 && (
            <Icon name="arrowRight" size={20} hover={false} />
          )}
        </div>
      ))}
    </div>
  );
};

export default BreadCrumb;
