import { FC, ReactElement, useEffect, useRef } from 'react';
import IconButton, { Size, Variant } from 'components/IconButton';
import PopupMenu from 'components/PopupMenu';
import useModal from 'hooks/useModal';
import { useTranslation } from 'react-i18next';

interface MenuItem {
  icon?: string;
  label: string;
  key: string;
  dataTestId: string;
}

export interface ISortProps {
  setFilter: (filter: string) => void;
  title?: ReactElement;
  footer?: ReactElement;
  entity: string;
  selectedValue?: string;
  controlled?: boolean;
  dataTestId?: string;
  sortOptions?: MenuItem[];
}

const Sort: FC<ISortProps> = ({
  setFilter,
  title,
  footer,
  entity,
  selectedValue = '',
  controlled,
  dataTestId,
  sortOptions,
}) => {
  const [open, openMenu, closeMenu] = useModal();
  const sortRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('components', {
    keyPrefix: 'Sort',
  });

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

  const defaultSortOptions = [
    {
      icon: 'sortByAcs',
      label: t('aToZ'),
      key: 'name:ASC',
      dataTestId: 'sortBy-asc',
    },
    {
      icon: 'sortByDesc',
      label: t('zToA'),
      key: 'name:DESC',
      dataTestId: 'sortBy-desc',
    },
    {
      icon: 'calendar',
      label: t('dateAdded'),
      key: 'createdAt:DESC',
      dataTestId: 'sortby-dateadded',
    },
  ];

  const menuItems = (sortOptions || defaultSortOptions).map((item: any) => ({
    icon: item.icon,
    label: item.label,
    onClick: () => handleClick(item.key),
    isActive: selectedValue === item.key,
    dataTestId: `${entity}-${item.dataTestId}`,
  }));

  const renderTitle = () =>
    title || (
      <div className="flex justify-between items-center px-6 py-2 font-sm font-medium text-neutral-900 border-b-1 border-b-neutral-200">
        <div>{t('sortBy')}</div>
      </div>
    );

  const renderFooter = () =>
    footer || (
      <div
        className="w-full px-6 py-2 font-sm font-bold text-neutral-500 hover:text-primary-500 text-center border-t-1 border-t-neutral-200 cursor-pointer"
        onClick={() => handleClick('')}
      >
        {t('clearSort')}
      </div>
    );

  return (
    <div ref={sortRef}>
      <PopupMenu
        controlled={controlled}
        triggerNode={
          <div className="relative group" onClick={open ? closeMenu : openMenu}>
            <IconButton
              icon="arrowSwap"
              variant={Variant.Secondary}
              size={Size.Medium}
              borderAround
              className="bg-white !p-[10px]"
              dataTestId={dataTestId}
              ariaLabel={t('sort')}
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
