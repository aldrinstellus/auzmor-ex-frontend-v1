import React, { useEffect, useRef, useState } from 'react';
import { CropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import Header from 'components/ModalHeader';
import Modal from 'components/Modal';
import ImageCropper from 'components/ImageCropper';
import PageLoader from 'components/PageLoader';
import Footer from './Footer';

export interface IImageResositionProps {
  title: string;
  openEditImage: boolean;
  closeEditImageModal?: () => void;
  imageRef: React.RefObject<HTMLInputElement>;
  image: string;
  setImageFile: (file: any) => void;
  imageFile?: any;
}

export enum Shape {
  Rectangle = 'rectangle',
}

const ImageResosition: React.FC<IImageResositionProps> = ({
  title,
  openEditImage,
  image,
  imageFile,
  setImageFile,
  closeEditImageModal = () => {},
  imageRef,
}) => {
  const cropperRef = useRef<CropperRef>(null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);

  // To determine the custom visible area in the image cropper
  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      const getWidthFactor = (width: number): number => {
        // Need better algorithm here
        let factor = 0.6;
        if (width > 3000) factor = 0.7;
        return factor;
      };
      setIsImageLoading(false);
    };

    img.src = image;
  }, []);

  const onSubmit = async () => {
    cropperRef?.current
      ?.getCanvas()
      ?.toBlob((blobImage: React.SetStateAction<Blob | null>) => {
        if (blobImage) {
          setImageFile(blobImage);
        }
      }, 'image/jpeg');
    closeEditImageModal();
  };

  return (
    <Modal
      open={openEditImage}
      closeModal={() => {
        if (imageFile) {
          return null;
        }
      }}
      className={
        !imageFile?.profileImage
          ? 'max-w-2xl flex flex-col justify-between'
          : undefined
      }
    >
      <Header title={title} closeBtnDataTestId={'kudos-custombanner-close'} />
      {isImageLoading ? (
        <div className="w-full h-full">
          <PageLoader />
        </div>
      ) : (
        <ImageCropper
          src={image}
          cropperRef={cropperRef}
          shape={Shape.Rectangle}
          aspectRatio={3}
        />
      )}
      <Footer
        cropperRef={cropperRef}
        imageRef={imageRef}
        imageFile={imageFile}
        onSubmit={onSubmit}
        dataTestId="kudos-custombanner"
      />
    </Modal>
  );
};

export default ImageResosition;
