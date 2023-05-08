import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
  Size as ButtonSize,
} from 'components/Button';
import Icon from 'components/Icon';
import IconButton, { Variant as IconVariant } from 'components/IconButton';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import React, { useContext, useRef, useState } from 'react';
import { twConfig } from 'utils/misc';
import Carousel from 'components/CarouselNew';
import { validImageTypes } from 'queries/files';
import useCarousel from 'hooks/useCarousel';

export interface IEditPostProps {
  closeModal: () => void;
}

const EditPost: React.FC<IEditPostProps> = ({ closeModal }) => {
  const { setActiveFlow, media, replaceMedia, removeMedia } =
    useContext(CreatePostContext);
  const changeInputImgRef = useRef<HTMLInputElement>(null);
  const [currentIndex, prevSlide, nextSlide] = useCarousel(0, media.length);

  const isVideo = (type: string) => {
    if (validImageTypes.indexOf(type) === -1) {
      return true;
    }
    return false;
  };

  return (
    <>
      {/* <>------ Header -------</> */}
      <div className="flex flex-wrap border-b-1 border-neutral-200 items-center">
        <Icon
          name="arrowLeftOutline"
          stroke={twConfig.theme.colors.neutral['900']}
          className="ml-4"
          size={16}
          onClick={() => setActiveFlow(CreatePostFlow.CreatePost)}
        />

        <div className="text-lg text-black p-4 font-extrabold flex-[50%]">
          {isVideo(media[currentIndex].contentType)
            ? 'Edit video'
            : 'Edit Photo'}
        </div>
        <IconButton
          onClick={closeModal}
          icon={'close'}
          className="!flex-[0] !text-right !p-1 !mx-4 !my-3 !bg-inherit !text-neutral-900"
          variant={IconVariant.Primary}
        />
      </div>

      {/* <>------ Body -------</> */}
      <Carousel
        media={media}
        className="m-6"
        onClose={(e, data, index) => {
          removeMedia(index);
        }}
        currentIndex={currentIndex}
        prevSlide={prevSlide}
        nextSlide={nextSlide}
      />

      {/* {<> -------- Footer --------</>} */}
      {isVideo(media[currentIndex].contentType) && (
        <div className="flex justify-between w-full items-center px-6 py-2">
          <div className="flex items-center">
            <div className="text-xs font-bold mr-3">Cover image:</div>
            <Button
              label="Upload image"
              leftIcon="upload"
              variant={ButtonVariant.Secondary}
              size={ButtonSize.Small}
            />
          </div>
          <div className="flex items-center">
            <div className="text-xs font-bold mr-3">Sound:</div>
            <input type="checkbox" />
          </div>
        </div>
      )}
      <div className="flex justify-end items-center h-16 p-6 bg-blue-50">
        <Button
          variant={ButtonVariant.Secondary}
          label={
            isVideo(media[currentIndex].contentType)
              ? 'Change video'
              : 'Change photo'
          }
          className="mr-3"
          onClick={() => changeInputImgRef?.current?.click()}
        />
        <Button
          label={'Apply changes'}
          type={ButtonType.Submit}
          onClick={() => setActiveFlow(CreatePostFlow.CreatePost)}
        />
      </div>
      <input
        type="file"
        className="hidden"
        ref={changeInputImgRef}
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.length) {
            replaceMedia(
              currentIndex,
              Array.prototype.slice.call(e.target.files)[0],
            );
          }
        }}
      />
    </>
  );
};

export default EditPost;
