import React, { ReactElement, ReactNode } from 'react';
import IconButton, { Size, Variant } from 'components/IconButton';
import PopupMenu from 'components/PopupMenu';

interface ISortByOption {
  asc: string;
  desc: string;
}

export interface ISortProps {
  setFilter: (filter: string) => void;
  filterKey: string;
  filterValue: ISortByOption;
  title: ReactElement;
  entity: string;
  permission?: string[];
}

const Sort: React.FC<ISortProps> = ({
  setFilter,
  filterKey,
  filterValue,
  title,
  entity,
  permission,
}) => {
  return (
    <PopupMenu
      triggerNode={
        <IconButton
          icon="arrowSwap"
          variant={Variant.Secondary}
          size={Size.Medium}
          borderAround
          className="bg-white !p-[10px]"
          dataTestId="teams-sort"
        />
      }
      title={title}
      menuItems={[
        {
          icon: 'calendar',
          label: 'Date added',
          onClick: () => {
            setFilter(`${filterKey}:${filterValue.desc}`);
          },
          dataTestId: `${entity}-sortby-dateadded`,
          permissions: permission,
        },
        {
          icon: 'sortByAcs',
          label: 'A to Z',
          onClick: () => {
            setFilter(`${filterKey}:${filterValue.asc}`);
          },
          dataTestId: `${entity}-sortBy-asc`,
          permissions: [''],
        },
        {
          icon: 'sortByDesc',
          label: 'Z to A',
          onClick: () => {
            setFilter(`${filterKey}:${filterValue.desc}`);
          },
          dataTestId: `${entity}-sortBy-desc`,
          permissions: permission,
        },
      ]}
      className="right-48 w-[157px] top-12"
    />
  );
};

export default Sort;
