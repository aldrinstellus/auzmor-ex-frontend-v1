import React, {
  ElementType,
  FC,
  Fragment,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  cloneElement,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
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
  isActive?: boolean;
  isBanner?: boolean;
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
  onClick?: MouseEventHandler<HTMLElement>;
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
  onClick,
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null
  );

  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.right - 176 + window.scrollX, // assuming width: w-44 (176px)
      });
    }
  };

  return (
    <Menu>
      <div ref={triggerRef} onClick={onClick}>
        <Menu.Button
          as="div"
          disabled={disabled}
          className="menu-trigger"
          onClick={handleOpen}
        >
          {triggerNode}
        </Menu.Button>
      </div>

      {(controlled ? isOpen : true) &&
        coords &&
        createPortal(
          <Menu.Items
            static={controlled}
            className={`bg-white rounded-9xl shadow-lg absolute z-[99999] overflow-hidden focus-visible:outline-none ${className}`}
            style={{
              position: 'absolute',
              top: coords.top,
              left: coords.left,
            }}
          >
            {title && title}
            {menuItems.map((menuItem: IMenuItem, idx: number) =>
              menuItem.isBanner ? (
                menuItem?.renderNode || null
              ) : (
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
                            { 'data-testid': menuItem.dataTestId }
                          );
                          return menuItemWithDataTestId;
                        }
                        return (
                          <PopupMenuItem
                            menuItem={menuItem}
                            border={idx !== menuItems?.length - 1}
                            isActive={menuItem.isActive || active}
                          />
                        );
                      }}
                    </Menu.Item>
                  )}
                </Fragment>
              )
            )}
            {footer && footer}
          </Menu.Items>,
          document.body
        )}
    </Menu>
  );
};

export default PopupMenu;
