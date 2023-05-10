import Button, {
  Variant as ButtonVariant,
  Size as ButtonSize,
} from 'components/Button';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import React, { useContext, useRef } from 'react';
import { isVideo } from 'utils/misc';
import useCarousel from 'hooks/useCarousel';
import SwitchToggle from 'components/SwitchToggle';
import Header from 'components/ModalHeader';
import Body from './Body';
import Footer from './Footer';

export interface IEditMediaProps {
  closeModal: () => void;
}

const EditMedia: React.FC<IEditMediaProps> = ({ closeModal }) => {
  const { setActiveFlow, media, replaceMedia, removeMedia } =
    useContext(CreatePostContext);
  const changeInputImgRef = useRef<HTMLInputElement>(null);
  const [currentIndex, prevSlide, nextSlide] = useCarousel(0, media.length);

  return (
    <>
      {/* <>------ Header -------</> */}
      <Header
        title={
          isVideo(media[currentIndex].contentType) ? 'Edit video' : 'Edit Photo'
        }
        onBackIconClick={() => setActiveFlow(CreatePostFlow.CreatePost)}
        onClose={closeModal}
      />

      {/* <>------ Body -------</> */}
      <Body
        currentIndex={currentIndex}
        prevSlide={prevSlide}
        nextSlide={nextSlide}
      />

      {/* {<> -------- Footer --------</>} */}
      {media[currentIndex].type === 'VIDEO' && (
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
            <SwitchToggle color="bg-primary-500" />
          </div>
        </div>
      )}
      <Footer
        currentIndex={currentIndex}
        changeInputImgRef={changeInputImgRef}
      />

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

export default EditMedia;
