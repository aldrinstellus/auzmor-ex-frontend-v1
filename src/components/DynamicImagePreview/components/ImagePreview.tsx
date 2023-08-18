import Icon from 'components/Icon';
import React from 'react';
import { getBlobUrl, twConfig } from 'utils/misc';

interface IImagePreviewProps {
  selectedTemplate: any;
  imageFile: any;
  templateImageRef: React.RefObject<HTMLInputElement>;
  imageUploaderRef: React.RefObject<HTMLInputElement>;
  users: [];
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
  return (
    <div className="relative">
      <div className="absolute top-1 right-1 flex items-center gap-1">
        {imageFile && (
          <Icon
            name="edit"
            disabled
            stroke={twConfig.theme.colors['black-white'].black}
            size={16}
            className="p-2 bg-white rounded cursor-pointer"
            onClick={() => {
              console.log(imageUploaderRef?.current);
              imageUploaderRef?.current?.click();
            }}
          />
        )}
        <Icon
          name="close"
          disabled
          stroke={twConfig.theme.colors['black-white'].black}
          size={16}
          className="p-2 bg-white rounded cursor-pointer"
          onClick={onRemove}
        />
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
          >
            <div className="mt-4">{selectedTemplate.label}</div>
            <div className="text-lg font-bold text-center">
              {users.slice(0, 2).map((user: any) => (
                <span key={user.id}>{user.name}</span>
              ))}
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
