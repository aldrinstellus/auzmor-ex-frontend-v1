import React, { ElementType, ReactNode, useRef } from 'react';
import { Menu } from '@headlessui/react';
import { twConfig } from 'utils/misc';
import Icon from 'components/Icon';
import useHover from 'hooks/useHover';
import PopupMenuItem from './PopupMenuItem';

export interface IMenuItem {
  renderNode?: ReactNode;
  disabled?: boolean;
  as?: ElementType;
  isActive?: boolean;
  dataTestId?: string;
  icon?: string;
  label?: string;
  iconClassName?: string;
  stroke?: string;
  fill?: string;
  onClick?: () => any;
  permissions?: string[];
}

export interface IPopupMenuProps {
  triggerNode: ReactNode;
  menuItems: IMenuItem[];
  className?: string;
}

const PopupMenu: React.FC<IPopupMenuProps> = ({
  triggerNode,
  menuItems,
  className,
}) => {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  return (
    <Menu>
      <Menu.Button ref={menuButtonRef}>{triggerNode}</Menu.Button>
      <Menu.Items
        className={`bg-white rounded-9xl shadow-lg absolute z-[99999] overflow-hidden ${className}`}
      >
        {menuItems.map((menuItem: IMenuItem, index: number) => (
          <>
            {!menuItem.disabled && (
              <Menu.Item
                key={`menu-item-${index}`}
                as={menuItem.as}
                data-testid={menuItem.dataTestId}
                disabled={menuItem.disabled}
              >
                {(() => {
                  if (menuItem.renderNode) {
                    return menuItem.renderNode;
                  }
                  return (
                    <PopupMenuItem
                      menuItem={menuItem}
                      menuButtonRef={menuButtonRef}
                    />
                  );
                })()}
              </Menu.Item>
            )}
          </>
        ))}
      </Menu.Items>
    </Menu>
  );
};

export default PopupMenu;
