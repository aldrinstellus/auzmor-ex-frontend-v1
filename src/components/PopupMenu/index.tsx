import {
  ElementType,
  FC,
  Fragment,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  cloneElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Menu } from '@headlessui/react';
import PopupMenuItem from './PopupMenuItem';
import { createPortal } from 'react-dom';

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
  show?: boolean;
  isBeta?: boolean;
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
  useCustomPopupPosition?: boolean;
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
  onClick = () => {},
  useCustomPopupPosition = false,
}) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuItemsRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.left - 170,
      })
    }
  };

  useEffect(() => {
    const removePopup = () => {
      if (menuItemsRef.current) {
        menuItemsRef.current.style.display = 'none';
      }
    }
    if (useCustomPopupPosition) {
        document.addEventListener('scroll', removePopup, true);
    }
    return () => document.removeEventListener('scroll', removePopup, true);
  }, [useCustomPopupPosition]);

  useEffect(() => {
    const triggers = document.getElementsByClassName('menu-trigger');
    if (triggers.length) {
      for (const node of triggers) {
        node.removeAttribute('aria-expanded');
      }
    }
  }, []);

  const menuContent = (
    <Menu.Items
      static={controlled}
      className={`bg-white rounded-9xl shadow-lg absolute z-[99999] overflow-hidden focus-visible:outline-none ${className}`}
      ref={menuItemsRef}
      style={
        useCustomPopupPosition && coords
          ? {
              top: coords.top,
              left: coords.left,
            }
          : {}
      }
    >
      {title}
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
                      { 'data-testid': menuItem.dataTestId },
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
        ),
      )}
      {footer && footer}
    </Menu.Items>
  );

  return (
    <Menu>
      <Menu.Button
        as="menu"
        ref={triggerRef}
        disabled={disabled}
        className={'menu-trigger'}
        onClick={(e) => {
          updatePosition();
          onClick(e);
        }}
      >
        {triggerNode}
      </Menu.Button>
      {(controlled ? isOpen : true) &&
        (useCustomPopupPosition ? createPortal(menuContent, document.body) : menuContent)}
    </Menu>
  );
};

export default PopupMenu;
