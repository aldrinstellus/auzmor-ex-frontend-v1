import React, { FC } from 'react';
import Modal from 'components/Modal';
import { Doc } from 'interfaces';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { useParams } from 'react-router-dom';
import Icon from 'components/Icon';
import Divider from 'components/Divider';
import Avatar from 'components/Avatar';
import Spinner from 'components/Spinner';

interface IFilePreviewProps {
  file: Doc;
  open: boolean;
  closeModal: () => void;
}

const FilePreview: FC<IFilePreviewProps> = ({ file, open, closeModal }) => {
  const { getApi } = usePermissions();
  const { channelId } = useParams();

  const useChannelFilePreview = getApi(ApiEnum.GetChannelFilePreview);
  const { data, isLoading } = useChannelFilePreview({
    channelId,
    fileId: file.id,
  });

  console.log(file);

  return (
    <Modal
      open={open}
      closeModal={closeModal}
      className="!w-[65vw] flex flex-col h-[80vh]"
    >
      <div className="flex items-center relative p-6">
        <div className="flex flex-grow justify-center items-start text-center">
          {file.name}
        </div>
        <div className="flex absolute gap-3 right-4">
          <Icon name="download" />
          <Icon name="starOutline" />
          <Icon name="export" />
        </div>
      </div>
      <Divider />
      <div className="flex rounded-9xl p-6 gap-2 items-center mx-4 mt-4 bg-[#F0F6FE]">
        <Avatar size={40} name={file.ownerName} image={file.ownerImage} />
        <div className="flex flex-grow justify-between">
          <div className="flex flex-col">
            <div className="text-sm font-bold text-neutral-900">
              {file.ownerName}
            </div>
            <div className="text-xs text-[#384D6F]">
              Customer Success Manager
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-xs text-[#384D6F]">
              Last Updated: <span>{file.externalUpdatedAt}</span>
            </div>
            <div className="text-xs text-[#384D6F]">8 min read</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-full">
        {isLoading ? (
          <Spinner />
        ) : (
          <iframe
            src={data?.data?.result?.previewURL}
            className="w-full h-full mt-2"
            allowFullScreen
            allow="all"
            name="iframe_a"
            loading={isLoading}
          />
        )}
      </div>
    </Modal>
  );
};

export default FilePreview;
