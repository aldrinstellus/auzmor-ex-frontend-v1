import {
  ElementType,
  FC,
  Fragment,
  ReactElement,
  ReactNode,
  cloneElement,
  useEffect,
} from 'react';
import { Menu } from '@headlessui/react';
import PopupMenuItem from './PopupMenuItem';

export interface IMenuItem {
  renderNode?: ReactElement;
  disabled?: boolean;
  as?: ElementType;
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
  className?: string;
}

export interface IPopupMenuProps {
  triggerNode: ReactNode;
  menuItems: IMenuItem[];
  className?: string;
  title?: ReactNode;
  footer?: ReactNode;
  disabled?: boolean;
  controlled?: boolean;
  isOpen?: boolean;
}

const PopupMenu: FC<IPopupMenuProps> = ({
  triggerNode,
  menuItems,
  className,
  title,
  footer,
  disabled = false,
  controlled,
  isOpen,
}) => {
  useEffect(() => {
    const triggers = document.getElementsByClassName('menu-trigger');
    if (triggers.length) {
      for (const node of triggers) {
        node.removeAttribute('aria-expanded');
      }
    }
  }, []);
  return (
    <Menu>
      <Menu.Button as="menu" disabled={disabled} className={'menu-trigger'}>
        {triggerNode}
      </Menu.Button>
      {(controlled ? isOpen : true) && (
        <Menu.Items
          static={controlled}
          className={`bg-white rounded-9xl shadow-lg absolute z-[99999] overflow-hidden focus-visible:outline-none ${className}`}
        >
          {title && title}
          {menuItems.map((menuItem: IMenuItem, idx: number) => (
            <Fragment key={`menu-item-${idx}-fragment`}>
              {!menuItem.disabled && (
                <Menu.Item
                  key={`menu-item-${idx}`}
                  as="button"
                  onClick={menuItem?.onClick}
                  className="w-full"
                >
                  {({ active }) => {
                    if (menuItem.renderNode) {
                      const menuItemWithDataTestId = cloneElement(
                        menuItem.renderNode,
                        { 'data-testid': menuItem.dataTestId },
                      );
                      return menuItemWithDataTestId;
                    }
                    return (
                      <PopupMenuItem
                        menuItem={menuItem}
                        border={idx !== menuItems?.length - 1}
                        isActive={active}
                      />
                    );
                  }}
                </Menu.Item>
              )}
            </Fragment>
          ))}
          {footer && footer}
        </Menu.Items>
      )}
    </Menu>
  );
};

export default PopupMenu;
