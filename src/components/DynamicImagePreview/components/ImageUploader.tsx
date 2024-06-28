import { FC, RefObject, useState } from 'react';
import Icon from 'components/Icon';
import { clearInputValue, getBlobUrl } from 'utils/misc';
import useModal from 'hooks/useModal';
import ImageReposition from './ImageReposition';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { validImageTypes } from 'queries/files';
import { IMG_FILE_SIZE_LIMIT } from 'contexts/CreatePostContext';
import Button, { Variant } from 'components/Button';

export interface IImageUploaderProps {
  setImageFile: (file: any) => void;
  imageFile?: any;
  imageUploaderRef: RefObject<HTMLInputElement>;
  isImageAdded: boolean;
}

const ImageUploader: FC<IImageUploaderProps> = ({
  setImageFile,
  imageUploaderRef,
  isImageAdded,
}) => {
  const [file, setFile] = useState<any>(null);
  const [openEditImage, openEditImageModal, closeEditImageModal] = useModal(
    undefined,
    false,
  );

  const showErrorToast = (message: string) => {
    failureToastConfig({ content: message, dataTestId: 'comment-toaster' });
  };

  const handleImageUpload = (file: File) => {
    if (!!![...validImageTypes].includes(file.type)) {
      showErrorToast(
        'File type not supported. Upload a supported file content',
      );
      return;
    }
    if (file.size > IMG_FILE_SIZE_LIMIT * 1024 * 1024) {
      showErrorToast(
        'The file you are trying to upload exceeds the 5MB attachment limit. Try uploading a smaller file',
      );
      return;
    }
    setFile(file);
    openEditImageModal();
  };

  return (
    <>
      <div
        className={`${
          isImageAdded ? 'hidden' : 'block'
        } py-10 flex flex-col justify-center items-center gap-2`}
      >
        <Icon name="folderOpen" size={40} color="text-primary-500" />
        <Button
          leftIcon="galleryExport"
          label="Upload an image"
          leftIconClassName="text-neutral-900"
          onClick={() => imageUploaderRef?.current?.click()}
          className="bg-white rounded-[24px] border-1
            border-neutral-200 px-4 py-2 text-sm font-bold
            flex items-center gap-1 cursor-pointer"
          data-testid="kudos-uploadimg-button"
          variant={Variant.Secondary}
        />

        <div className="text-sm">Add your document from the options below</div>
        {openEditImage && (
          <ImageReposition
            title="Reposition"
            openEditImage={openEditImage}
            closeEditImageModal={closeEditImageModal}
            image={getBlobUrl(file)}
            imageRef={imageUploaderRef}
            setImageFile={setImageFile}
            imageFile={file}
          />
        )}
      </div>
      <input
        id="file-input"
        type="file"
        ref={imageUploaderRef}
        className="hidden"
        accept="image/*"
        multiple={false}
        data-testid="edit-profile-coverpic"
        onClick={clearInputValue}
        onChange={(e) => {
          if (e.target.files?.length) {
            const file = e.target.files[0];
            handleImageUpload(file);
          }
        }}
        aria-label="image upload"
      />
    </>
  );
};

export default ImageUploader;
