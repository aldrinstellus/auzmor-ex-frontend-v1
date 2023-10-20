import { FC, ReactElement } from 'react';
import IconButton, { Size, Variant } from 'components/IconButton';
import PopupMenu from 'components/PopupMenu';
import useModal from 'hooks/useModal';
import Icon from 'components/Icon';

interface ISortByOption {
  asc: string;
  desc: string;
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
  dataTestId?: string;
}

const Sort: FC<ISortProps> = ({
  setFilter,
  filterKey,
  filterValue,
  title,
  footer,
  entity,
  permission,
  selectedValue,
  dataTestId,
}) => {
  const [open, openMenu, closeMenu] = useModal();
  return (
    <PopupMenu
      triggerNode={
        <div className="relative" onClick={openMenu}>
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
      controlled
      isOpen={open}
      title={
        title || (
          <div
            className="flex justify-between items-center px-6 py-2 font-sm font-medium text-neutral-900 border-b-1
                border-b-neutral-200"
          >
            <div>Sort by</div>
            <Icon name="close" size={16} onClick={closeMenu} />
          </div>
        )
      }
      footer={
        footer || (
          <div
            className="w-full px-6 py-2 font-sm font-bold text-neutral-400 text-center border-t-1
                border-t-neutral-200 cursor-pointer"
            onClick={() => {
              closeMenu();
              setFilter('');
            }}
          >
            Clear sort
          </div>
        )
      }
      menuItems={[
        {
          icon: 'sortByAcs',
          label: 'A to Z',
          onClick: () => {
            closeMenu();
            setFilter(`${filterKey.aToZ}:${filterValue.asc}`);
          },
          isActive: selectedValue === `${filterKey.aToZ}:${filterValue.asc}`,
          dataTestId: `${entity}-sortBy-asc`,
          permissions: [''],
        },
        {
          icon: 'sortByDesc',
          label: 'Z to A',
          onClick: () => {
            closeMenu();
            setFilter(`${filterKey.aToZ}:${filterValue.desc}`);
          },
          dataTestId: `${entity}-sortBy-desc`,
          isActive: selectedValue === `${filterKey.aToZ}:${filterValue.desc}`,
          permissions: permission,
        },
        {
          icon: 'calendar',
          label: 'Date added',
          onClick: () => {
            closeMenu();
            setFilter(`${filterKey.createdAt}:${filterValue.desc}`);
          },
          dataTestId: `${entity}-sortby-dateadded`,
          isActive:
            selectedValue === `${filterKey.createdAt}:${filterValue.desc}`,
          permissions: permission,
        },
      ]}
      className="right-60 w-[204px] top-12 border border-neutral-200"
    />
  );
};

export default Sort;
