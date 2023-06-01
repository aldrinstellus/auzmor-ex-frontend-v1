import Button, { Variant as ButtonVariant, Size } from 'components/Button';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import { UploadStatus, useUpload } from 'queries/files';
import React, { useContext } from 'react';
import { isVideo } from 'utils/misc';

export interface IFooterProps {
  currentIndex: number;
  changeInputImgRef: React.RefObject<HTMLInputElement>;
  dataTestId?: string;
}

const Footer: React.FC<IFooterProps> = ({
  currentIndex,
  changeInputImgRef,
  dataTestId,
}) => {
  const { setActiveFlow, media, removedCoverimageFileIds } =
    useContext(CreatePostContext);
  const { removeCoverImage, uploadStatus } = useUpload();
  return (
    <div className="flex justify-end items-center h-16 p-6 bg-blue-50">
      <Button
        variant={ButtonVariant.Secondary}
        size={Size.Small}
        label={
          isVideo(media[currentIndex].contentType)
            ? 'Change video'
            : 'Change photo'
        }
        className="mr-3"
        onClick={() => changeInputImgRef?.current?.click()}
        dataTestId={`${dataTestId}-${
          isVideo(media[currentIndex].contentType)
            ? 'changevideocta'
            : 'changephotocta'
        }`}
      />
      <Button
        label={'Apply changes'}
        size={Size.Small}
        disabled={uploadStatus === UploadStatus.Uploading}
        onClick={async () => {
          if (removedCoverimageFileIds.length) {
            await removeCoverImage(removedCoverimageFileIds);
          }
          setActiveFlow(CreatePostFlow.CreatePost);
        }}
        dataTestId={`${dataTestId}-applychangescta`}
      />
    </div>
  );
};

export default Footer;
