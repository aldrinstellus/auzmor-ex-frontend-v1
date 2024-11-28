import Button, { Size, Variant } from 'components/Button';
import IconButton, {
  Variant as IconVariant,
  Size as IconSize,
} from 'components/IconButton';
import PopupMenu from 'components/PopupMenu';
import { Doc } from 'interfaces';
import React, { FC } from 'react';

interface IActionMenuProps {
  selectedItems: Doc[];
  changeView: (view: 'LIST' | 'GRID') => void;
  view: 'LIST' | 'GRID';
  onDeselect: () => void;
}

const ActionMenu: FC<IActionMenuProps> = ({
  view,
  changeView,
  selectedItems,
  onDeselect,
}) => {
  const menuItems = [
    {
      icon: 'list',
      label: 'List',
      onClick: () => changeView('LIST'),
    },
    {
      icon: 'grid',
      label: 'Grid',
      onClick: () => changeView('GRID'),
    },
  ];

  const showRename = selectedItems.length === 1;
  const showDownload = selectedItems.some((doc) => doc.downloadable);

  return (
    <div className="flex items-center justify-between w-full h-9">
      <div className="flex gap-10">
        <Button
          label={`${selectedItems.length} selected`}
          variant={Variant.Secondary}
          leftIcon="close"
          size={Size.Small}
          leftIconSize={14}
          className="!border-none !text-neutral-700 gap-1 !p-0"
          labelClassName="!font-semibold text-base group-hover:!text-primary-500"
          leftIconClassName="!text-neutral-500 group-hover:!text-primary-500"
          onClick={onDeselect}
        />
        {showDownload && (
          <Button
            label="Download"
            variant={Variant.Secondary}
            leftIcon="download"
            size={Size.Small}
            leftIconSize={16}
            className="!border-none !text-neutral-700 gap-1 !p-0"
            labelClassName="!font-semibold text-base group-hover:!text-primary-500"
            leftIconClassName="!text-neutral-500 group-hover:!text-primary-500"
          />
        )}
        <Button
          label="Add to starred"
          variant={Variant.Secondary}
          leftIcon="starOutline"
          size={Size.Small}
          leftIconSize={16}
          className="!border-none !text-neutral-700 gap-1 !p-0"
          labelClassName="!font-semibold text-base group-hover:!text-primary-500"
          leftIconClassName="!text-neutral-500 group-hover:!text-primary-500"
        />
        {showRename && (
          <Button
            label="Rename"
            variant={Variant.Secondary}
            leftIcon="edit"
            size={Size.Small}
            leftIconSize={16}
            className="!border-none !text-neutral-700 gap-1 !p-0"
            labelClassName="!font-semibold text-base group-hover:!text-primary-500"
            leftIconClassName="!text-neutral-500 group-hover:!text-primary-500"
          />
        )}
        <Button
          label="Delete"
          variant={Variant.Secondary}
          leftIcon="delete"
          size={Size.Small}
          leftIconSize={16}
          className="!border-none !text-neutral-700 gap-1 !p-0"
          labelClassName="!font-semibold text-base group-hover:!text-primary-500"
          leftIconClassName="!text-neutral-500 group-hover:!text-primary-500"
        />
      </div>
      <div className="flex relative">
        <PopupMenu
          triggerNode={
            <IconButton
              icon={view === 'GRID' ? 'grid' : 'list'}
              variant={IconVariant.Secondary}
              size={IconSize.Medium}
              borderAround
              className="bg-white !p-[10px]"
            />
          }
          menuItems={menuItems}
          className="mt-1 top-full right-0 border-1 border-neutral-200 focus-visible:outline-none"
        />
      </div>
    </div>
  );
};

export default ActionMenu;
