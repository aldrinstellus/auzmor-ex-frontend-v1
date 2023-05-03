import React, { ElementType, ReactNode } from 'react';
import { Menu } from '@headlessui/react';
import { twConfig } from 'utils/misc';
import Icon from 'components/Icon';

export interface IMenuItem {
  renderNode?: ReactNode;
  disabled?: boolean;
  as?: ElementType;
  isActive?: boolean;
  dataTestId?: string;
  icon?: string;
  label?: string;
  onClick?: () => any;
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
  return (
    <Menu>
      <Menu.Button>{triggerNode}</Menu.Button>
      <Menu.Items
        className={`bg-white rounded-9xl shadow-lg absolute z-[99999] bottom-full overflow-hidden ${className}`}
      >
        {menuItems.map((menuItem: IMenuItem, index: number) => (
          <Menu.Item
            key={`menu-item-${index}`}
            as={menuItem.as}
            data-test-id={menuItem.dataTestId}
            disabled={menuItem.disabled}
          >
            {(() => {
              if (menuItem.renderNode) {
                return menuItem.renderNode;
              }
              return (
                <div
                  className="flex px-6 py-3 items-center hover:bg-primary-50 cursor-pointer space-x-3"
                  onClick={menuItem.onClick}
                >
                  {menuItem.icon && (
                    <Icon
                      name={menuItem.icon}
                      size={16}
                      // className="p-2 rounded-7xl border mr-2.5 bg-white"
                      fill={twConfig.theme.colors.primary['500']}
                    />
                  )}
                  <div className="text-sm text-neutral-900 font-medium whitespace-nowrap">
                    {menuItem.label}
                  </div>
                </div>
              );
            })()}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};

export default PopupMenu;
