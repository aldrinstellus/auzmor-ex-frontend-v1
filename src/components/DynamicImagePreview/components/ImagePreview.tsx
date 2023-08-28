import Icon from 'components/Icon';
import React from 'react';
import { getBlobUrl, twConfig } from 'utils/misc';

interface IImagePreviewProps {
  selectedTemplate: any;
  imageFile: any;
  templateImageRef: React.RefObject<HTMLInputElement>;
  imageUploaderRef: React.RefObject<HTMLInputElement>;
  users: any[];
  onRemove: () => void;
}

const ImagePreview: React.FC<IImagePreviewProps> = ({
  selectedTemplate,
  imageFile,
  templateImageRef,
  imageUploaderRef,
  users,
  onRemove,
}) => {
  const formatUserList = () => {
    const count = users.length;
    if (count === 1) {
      return users[0].name;
    } else if (count === 2) {
      return `${users[0].name} and ${users[1].name}`;
    } else if (count === 3) {
      return `${users[0].name}, ${users[1].name} and ${users[2].name}`;
    } else if (count > 3) {
      return `${users[0].name}, ${users[1].name}, ${users[2].name} and ${
        count - 3
      } others`;
    }
    return '';
  };

  return (
    <div className="relative">
      <div className="absolute top-[14px] right-[14px] flex items-center gap-1">
        {imageFile && (
          <div className="p-[7px] bg-white rounded cursor-pointer border border-neutral-200">
            <Icon
              name="edit"
              color="text-neutral-900"
              size={16}
              onClick={() => {
                imageUploaderRef?.current?.click();
              }}
            />
          </div>
        )}
        <div className="p-[7px] bg-white rounded cursor-pointer border border-neutral-200">
          <Icon
            name="close"
            color="text-neutral-900"
            size={16}
            onClick={onRemove}
            dataTestId="kudos-remove-banner"
          />
        </div>
      </div>
      {imageFile && (
        <img
          src={getBlobUrl(imageFile)}
          className="object-contain w-full h-full max-h-[222px]"
        />
      )}
      {selectedTemplate && (
        <div
          ref={templateImageRef}
          className={`${selectedTemplate.bgColor} aspect-[2.5/1] max-h-[222px] w-full`}
        >
          <div
            className={`${selectedTemplate.bgColor} flex flex-col justify-center items-center p-2`}
            data-testid="kudos-banner-text"
          >
            <div className="mt-4">{selectedTemplate.label}</div>
            <div className="text-lg font-bold text-center">
              {formatUserList()}
            </div>
            <img
              src={selectedTemplate.image}
              className="object-contain w-full h-full max-h-[138px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
