import React, { useRef, useState } from 'react';
import Icon from 'components/Icon';
import { clearInputValue, getBlobUrl } from 'utils/misc';
import useModal from 'hooks/useModal';
import ImageResosition from './ImageReposition';

export interface IImageUploaderProps {
  setImageFile: (file: any) => void;
  imageFile?: any;
}

const ImageUploader: React.FC<IImageUploaderProps> = ({ setImageFile }) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<any>(null);
  const [openEditImage, openEditImageModal, closeEditImageModal] = useModal(
    undefined,
    false,
  );
  return (
    <div className="py-10 flex flex-col justify-center items-center gap-2">
      <Icon name="folderOpen" size={40} />
      <div
        className="bg-white rounded-[24px] border-1
            border-neutral-200 px-4 py-2 text-sm font-bold
            flex items-center gap-1 cursor-pointer"
        onClick={() => imageRef?.current?.click()}
      >
        <Icon name="galleryExport" size={16} />
        <span>Upload an image</span>
        <input
          id="file-input"
          type="file"
          ref={imageRef}
          className="hidden"
          accept="image/*"
          multiple={false}
          data-testid="edit-profile-coverpic"
          onClick={clearInputValue}
          onChange={(e) => {
            if (e.target.files?.length) {
              setFile(Array.prototype.slice.call(e.target.files)[0]);
              openEditImageModal();
            }
          }}
        />
      </div>
      <div className="text-sm">Add your document from the options below</div>
      {openEditImage && (
        <ImageResosition
          title="Reposition"
          openEditImage={openEditImage}
          closeEditImageModal={closeEditImageModal}
          image={getBlobUrl(file)}
          imageRef={imageRef}
          setImageFile={setImageFile}
          imageFile={file}
        />
      )}
    </div>
  );
};

export default ImageUploader;
