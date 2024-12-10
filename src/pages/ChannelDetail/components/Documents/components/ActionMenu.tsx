import clsx from 'clsx';
import Button, { Size, Variant } from 'components/Button';
import ConfirmationBox from 'components/ConfirmationBox';
import IconButton, {
  Variant as IconVariant,
  Size as IconSize,
} from 'components/IconButton';
import PopupMenu from 'components/PopupMenu';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import useModal from 'hooks/useModal';
import { usePermissions } from 'hooks/usePermissions';
import { Doc } from 'interfaces';
import React, { FC, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import queryClient from 'utils/queryClient';
import RenameChannelDocModal from './RenameChannelDocModal';

interface IActionMenuProps {
  selectedItems: Doc[];
  changeView: (view: 'LIST' | 'GRID') => void;
  view: 'LIST' | 'GRID';
  onDeselect: () => void;
  onRename: (name: string) => void;
}

const ActionMenu: FC<IActionMenuProps> = ({
  view,
  changeView,
  selectedItems,
  onDeselect,
  onRename,
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
  const [confirm, showConfirm, closeConfirm] = useModal();
  const [renameModal, showRenameModal, closeRenameModal] = useModal();
  const [pauseActions, setPauseAction] = useState(false);
  const { getApi } = usePermissions();
  const deleteChannelDoc = getApi(ApiEnum.DeleteChannelDoc);
  const showRename = selectedItems.length === 1;
  const showDownload = selectedItems.some((doc) => doc.downloadable);
  const { channelId } = useParams();

  const handleDeleteDoc = async () => {
    closeConfirm();
    setPauseAction(() => true);
    for (const item of selectedItems) {
      try {
        await deleteChannelDoc({ channelId, itemId: item.id });
        successToastConfig({ content: `“${item.name}” file deleted` });
      } catch (e) {
        failureToastConfig({
          content: `Failed to delete ${item.name}`,
          dataTestId: 'file-delete-toaster',
        });
      }
    }
    await queryClient.invalidateQueries(['get-channel-files'], {
      exact: false,
    });
    onDeselect();
    setPauseAction(() => false);
  };

  const btnStyle = useMemo(
    () =>
      clsx({
        '!border-none !text-neutral-700 gap-1 !p-0 disabled:bg-white disabled:!text-neutral-200':
          true,
      }),
    [pauseActions],
  );

  const labelStyle = useMemo(
    () =>
      clsx({
        '!font-semibold text-base': true,
        'group-hover:!text-primary-500': !pauseActions,
      }),
    [pauseActions],
  );

  const leftIconStyle = useMemo(
    () =>
      clsx({
        '!text-neutral-500 ': true,
        '!text-neutral-200': pauseActions,
        'group-hover:!text-primary-500 ': !pauseActions,
      }),
    [pauseActions],
  );

  return (
    <div className="flex items-center justify-between w-full h-9">
      <div className="flex gap-10">
        <Button
          label={`${selectedItems.length} selected`}
          variant={Variant.Secondary}
          leftIcon="close"
          size={Size.Small}
          leftIconSize={14}
          className={btnStyle}
          labelClassName={labelStyle}
          leftIconClassName={leftIconStyle}
          onClick={onDeselect}
          disabled={pauseActions}
        />
        {showDownload && (
          <Button
            label="Download"
            variant={Variant.Secondary}
            leftIcon="download"
            size={Size.Small}
            leftIconSize={16}
            className={btnStyle}
            labelClassName={labelStyle}
            leftIconClassName={leftIconStyle}
            disabled={pauseActions}
          />
        )}
        {/* <Button
          label="Add to starred"
          variant={Variant.Secondary}
          leftIcon="starOutline"
          size={Size.Small}
          leftIconSize={16}
          className={btnStyle}
          labelClassName={labelStyle}
          leftIconClassName={leftIconStyle}
        /> */}
        {showRename && (
          <Button
            label="Rename"
            variant={Variant.Secondary}
            leftIcon="edit"
            size={Size.Small}
            leftIconSize={16}
            className={btnStyle}
            labelClassName={labelStyle}
            leftIconClassName={leftIconStyle}
            disabled={pauseActions}
            onClick={showRenameModal}
          />
        )}
        <Button
          label="Delete"
          variant={Variant.Secondary}
          leftIcon="delete"
          size={Size.Small}
          leftIconSize={16}
          className={btnStyle}
          labelClassName={labelStyle}
          leftIconClassName={leftIconStyle}
          onClick={showConfirm}
          disabled={pauseActions}
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

      <ConfirmationBox
        open={confirm}
        onClose={closeConfirm}
        title={`Delete ${selectedItems.length > 1 ? 'files' : 'file'}?`}
        description={
          <span>Are you sure you want to delete? This cannot be undone</span>
        }
        success={{
          label: 'Delete',
          className: 'bg-red-500 text-white ',
          onSubmit: handleDeleteDoc,
        }}
        discard={{
          label: 'Cancel',
          className: 'text-neutral-900 bg-white ',
          onCancel: closeConfirm,
        }}
      />

      {renameModal && (
        <RenameChannelDocModal
          isOpen={renameModal}
          closeModal={closeRenameModal}
          defaultName={selectedItems[0].name}
          onSave={onRename}
        />
      )}
    </div>
  );
};

export default ActionMenu;
