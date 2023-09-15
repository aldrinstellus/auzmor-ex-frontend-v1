import React, { useRef } from 'react';
import { IMenuItem } from '.';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';
import useHover from 'hooks/useHover';
import clsx from 'clsx';
import IconWrapper from 'components/Icon/components/IconWrapper';

type PopupMenuItemProps = {
  menuItem: IMenuItem;
  menuButtonRef: React.RefObject<HTMLButtonElement>;
  border?: boolean;
};

const PopupMenuItem: React.FC<PopupMenuItemProps> = ({
  menuItem,
  menuButtonRef,
  border = false,
}) => {
  const [hovered, eventHandlers] = useHover();
  const itemRef = useRef<HTMLButtonElement>(null);
  return (
    <div
      className={clsx(
        {
          'flex px-6 py-3 items-center hover:bg-primary-50 cursor-pointer space-x-3 group':
            true,
        },
        { 'border-b-1 border-b-neutral-200': border },
        { '!cursor-default': menuItem.disabled },
        { 'bg-primary-50': menuItem.isActive },
      )}
      onClick={() => {
        menuButtonRef.current?.click();
        menuItem?.onClick && menuItem.onClick();
      }}
      {...eventHandlers}
      data-testid={menuItem.dataTestId}
    >
      {menuItem.icon && (
        <div className={menuItem.iconWrapperClassName}>
          <Icon
            name={menuItem.icon}
            size={16}
            color={
              menuItem.isActive
                ? 'text-primary-500'
                : (menuItem.disabled && 'text-neutral-200') || menuItem.stroke
            }
            className={menuItem.iconClassName}
            hover={hovered}
            disabled={menuItem.disabled}
          />
        </div>
      )}
      <div
        className={clsx(
          { 'text-sm text-neutral-900 font-medium whitespace-nowrap': true },
          {
            'text-primary-500':
              !menuItem.disabled && (hovered || menuItem.isActive),
          },
          { '!text-neutral-400': menuItem.disabled },
          { [`${menuItem.labelClassName}`]: true },
        )}
      >
        {menuItem.label}
      </div>
    </div>
  );
};

export default PopupMenuItem;
