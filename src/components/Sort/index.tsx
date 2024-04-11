import { FC, ReactElement, useEffect, useRef } from 'react';
import IconButton, { Size, Variant } from 'components/IconButton';
import PopupMenu from 'components/PopupMenu';
import useModal from 'hooks/useModal';

interface ISortByOption {
  asc: string;
  desc: string;
}

interface MenuItem {
  icon: string;
  label: string;
  onClick: () => void;
  isActive: boolean;
  dataTestId: string;
  permissions: string[];
}

export interface ISortProps {
  setFilter: (filter: string) => void;
  filterKey: Record<string, any>;
  filterValue: ISortByOption;
  title?: ReactElement;
  footer?: ReactElement;
  entity: string;
  permission?: string[];
  selectedValue?: string;
  controlled?: boolean;
  dataTestId?: string;
}

const Sort: FC<ISortProps> = ({
  setFilter,
  filterKey,
  filterValue,
  title,
  footer,
  entity,
  permission = [],
  selectedValue = '',
  controlled,
  dataTestId,
}) => {
  const [open, openMenu, closeMenu] = useModal();
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [closeMenu]);

  const handleClick = (filterValue: string) => {
    closeMenu();
    setFilter(filterValue);
  };

  const menuItems: MenuItem[] = [
    {
      icon: 'sortByAcs',
      label: 'A to Z',
      onClick: () => handleClick(`${filterKey.aToZ}:${filterValue.asc}`),
      isActive: selectedValue === `${filterKey.aToZ}:${filterValue.asc}`,
      dataTestId: `${entity}-sortBy-asc`,
      permissions: [''],
    },
    {
      icon: 'sortByDesc',
      label: 'Z to A',
      onClick: () => handleClick(`${filterKey.aToZ}:${filterValue.desc}`),
      isActive: selectedValue === `${filterKey.aToZ}:${filterValue.desc}`,
      dataTestId: `${entity}-sortBy-desc`,
      permissions: permission,
    },
    {
      icon: 'calendar',
      label: 'Date added',
      onClick: () => handleClick(`${filterKey.createdAt}:${filterValue.desc}`),
      dataTestId: `${entity}-sortby-dateadded`,
      isActive: selectedValue === `${filterKey.createdAt}:${filterValue.desc}`,
      permissions: permission,
    },
  ];

  const renderTitle = () =>
    title || (
      <div className="flex justify-between items-center px-6 py-2 font-sm font-medium text-neutral-900 border-b-1 border-b-neutral-200">
        <div>Sort by</div>
      </div>
    );

  const renderFooter = () =>
    footer || (
      <div
        className="w-full px-6 py-2 font-sm font-bold text-neutral-500 hover:text-primary-500 text-center border-t-1 border-t-neutral-200 cursor-pointer"
        onClick={() => handleClick('')}
      >
        Clear sort
      </div>
    );

  return (
    <div ref={sortRef}>
      <PopupMenu
        controlled={controlled}
        triggerNode={
          <div className="relative" onClick={open ? closeMenu : openMenu}>
            <IconButton
              icon="arrowSwap"
              variant={Variant.Secondary}
              size={Size.Medium}
              borderAround
              className="bg-white !p-[10px]"
              dataTestId={dataTestId}
            />
            {selectedValue && (
              <div className="h-2 w-2 rounded-full bg-red-500 absolute top-[2px] right-[2px]" />
            )}
          </div>
        }
        isOpen={open}
        title={renderTitle()}
        footer={renderFooter()}
        menuItems={menuItems}
        className="right-60 w-[204px] top-12 border border-neutral-200"
      />
    </div>
  );
};

export default Sort;
