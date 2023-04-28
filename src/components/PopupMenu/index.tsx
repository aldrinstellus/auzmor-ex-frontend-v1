import React, { ElementType, ReactNode } from 'react';
import { Menu } from '@headlessui/react';

export interface IMenuItem {
  renderNode: ReactNode;
  disabled?: boolean;
  as?: ElementType;
  isActive?: boolean;
  dataTestId?: string;
}

export interface IPopupMenuProps {
  triggerNode: ReactNode;
  menuItems: IMenuItem[];
}

const PopupMenu: React.FC<IPopupMenuProps> = ({ triggerNode, menuItems }) => {
  return (
    <Menu>
      <Menu.Button>{triggerNode}</Menu.Button>
      <Menu.Items className="bg-white rounded-9xl shadow-lg absolute z-[99999] bottom-full overflow-hidden">
        {menuItems.map((menuItem: IMenuItem, index: number) => (
          <Menu.Item
            key={`menu-item-${index}`}
            as={menuItem.as}
            data-test-id={menuItem.dataTestId}
            disabled={menuItem.disabled}
          >
            {menuItem.renderNode}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};

export default PopupMenu;
