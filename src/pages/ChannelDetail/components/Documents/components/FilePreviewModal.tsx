import React, { FC } from 'react';
import { DocType } from 'queries/files';
import Modal from 'components/Modal';
import Icon from 'components/Icon';
import Avatar from 'components/Avatar';

interface IFilePreviewProps {
  file: DocType;
  open: boolean;
  closeModal: () => void;
}

const FilePreview: FC<IFilePreviewProps> = ({ file, open, closeModal }) => {
  const thumbnailUrl = new URL(file.fileThumbnailUrl);
  if (thumbnailUrl.searchParams.has('sz')) {
    thumbnailUrl.searchParams.set('sz', 'w1440');
  }
  const user = file.createdBy;

  return (
    <Modal
      open={open}
      closeModal={closeModal}
      className="!w-[65vw] flex flex-col h-[80vh]"
    >
      <div className="flex justify-center items-center border-b-1 p-6 relative">
        <span className="text-sm text-neutral-900 font-semibold">
          {file.name}
        </span>
        <div className="flex flex-row gap-3 absolute right-4">
          <Icon name="download" color="text-neutral-800" />
          <Icon name="postBookmark" color="text-neutral-800" />
          <Icon name="export" color="text-neutral-800" />
        </div>
      </div>
      {user?.name ? (
        <div className="m-4 mb-2 p-4 flex flex-row items-left gap-2 bg-sky-50 text-sm rounded-[12px] ">
          <Avatar
            size={40}
            name={user?.name || 'U'}
            image={user?.profileImage}
          />
          <div className="flex flex-col justify-center">
            <div className="text-sm font-bold">{user?.name}</div>
            <div className="text-neutral-500 text-xs">
              {user?.designation?.name}
            </div>
          </div>
        </div>
      ) : null}
      <div className="!w-full p-6 overflow-y-auto">
        <img src={thumbnailUrl.toString()} />
      </div>
    </Modal>
  );
};

export default FilePreview;
