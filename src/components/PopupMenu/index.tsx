import React, { ElementType, ReactElement, ReactNode, useRef } from 'react';
import { Menu } from '@headlessui/react';
import PopupMenuItem from './PopupMenuItem';

export interface IMenuItem {
  renderNode?: ReactElement;
  disabled?: boolean;
  as?: ElementType;
  isActive?: boolean;
  dataTestId?: string;
  icon?: string;
  label?: ReactNode;
  labelClassName?: string;
  iconClassName?: string;
  iconWrapperClassName?: string;
  stroke?: string;
  fill?: string;
  onClick?: () => any;
  permissions?: string[];
}

export interface IPopupMenuProps {
  triggerNode: ReactNode;
  menuItems: IMenuItem[];
  className?: string;
  title?: ReactNode;
  disabled?: boolean;
}

const PopupMenu: React.FC<IPopupMenuProps> = ({
  triggerNode,
  menuItems,
  className,
  title,
  disabled = false,
}) => {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  return (
    <Menu>
      <Menu.Button as="div" ref={menuButtonRef} disabled={disabled}>
        {triggerNode}
      </Menu.Button>
      <Menu.Items
        className={`bg-white rounded-9xl shadow-lg absolute z-[99999] overflow-hidden ${className}`}
      >
        {title && title}
        {menuItems.map((menuItem: IMenuItem, idx: number) => (
          <>
            {!menuItem.disabled && (
              <Menu.Item key={`menu-item-${idx}`} as={menuItem.as}>
                {(() => {
                  if (menuItem.renderNode) {
                    const menuItemWithDataTestId = React.cloneElement(
                      menuItem.renderNode,
                      { 'data-testid': menuItem.dataTestId },
                    );
                    return menuItemWithDataTestId;
                  }
                  return (
                    <PopupMenuItem
                      menuItem={menuItem}
                      menuButtonRef={menuButtonRef}
                      border={idx !== menuItems?.length - 1}
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
