import React, { ElementType, ReactNode } from 'react';
import { Menu } from '@headlessui/react';
import { twConfig } from 'utils/misc';
import Icon from 'components/Icon';
import useHover from 'hooks/useHover';

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
  return (
    <Menu>
      <Menu.Button>{triggerNode}</Menu.Button>
      <Menu.Items
        className={`bg-white rounded-9xl shadow-lg absolute z-[99999]  overflow-hidden ${className}`}
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
                  const [hovered, eventHandlers] = useHover();
                  if (menuItem.renderNode) {
                    return menuItem.renderNode;
                  }
                  return (
                    <div
                      className={`flex px-6 py-3 items-center hover:bg-primary-50 cursor-pointer space-x-3 ${
                        menuItem.disabled && '!cursor-default'
                      }`}
                      onClick={menuItem.onClick}
                      {...eventHandlers}
                    >
                      {menuItem.icon && (
                        <Icon
                          name={menuItem.icon}
                          size={16}
                          className={menuItem.iconClassName}
                          fill={
                            menuItem.fill ||
                            twConfig.theme.colors.primary['500']
                          }
                          stroke={
                            (menuItem.disabled &&
                              twConfig.theme.colors.neutral['200']) ||
                            menuItem.stroke
                          }
                          hover={hovered}
                          disabled={menuItem.disabled}
                        />
                      )}
                      <div
                        className={`text-sm text-neutral-900 font-medium whitespace-nowrap ${
                          menuItem.disabled && '!text-neutral-400'
                        }`}
                      >
                        {menuItem.label}
                      </div>
                    </div>
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
