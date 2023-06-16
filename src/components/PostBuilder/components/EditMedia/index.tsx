import Button, {
  Variant as ButtonVariant,
  Size as ButtonSize,
} from 'components/Button';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import React, { useContext, useEffect, useRef } from 'react';
import { getBlobUrl, isVideo, twConfig } from 'utils/misc';
import useCarousel from 'hooks/useCarousel';
// import SwitchToggle from 'components/SwitchToggle';
import Header from 'components/ModalHeader';
import Body from './Body';
import Footer from './Footer';
import Icon from 'components/Icon';

export interface IEditMediaProps {
  closeModal: () => void;
}

const EditMedia: React.FC<IEditMediaProps> = ({ closeModal }) => {
  const {
    setActiveFlow,
    media,
    replaceMedia,
    updateCoverImageMap,
    setUploads,
    deleteCoverImageMap,
    coverImageMap,
    mediaOpenIndex,
  } = useContext(CreatePostContext);
  const changeInputImgRef = useRef<HTMLInputElement>(null);
  const changeInputVideoRef = useRef<HTMLInputElement>(null);
  const uploadCoverImageRef = useRef<HTMLInputElement>(null);
  const [currentIndex, prevSlide, nextSlide] = useCarousel(
    mediaOpenIndex > -1 ? mediaOpenIndex : 0,
    media.length,
  );

  return (
    <>
      {/* <>------ Header -------</> */}
      <Header
        title={
          isVideo(media[currentIndex].contentType) ? 'Edit video' : 'Edit Photo'
        }
        onBackIconClick={() => setActiveFlow(CreatePostFlow.CreatePost)}
        onClose={closeModal}
        closeBtnDataTestId={`feed-${
          isVideo(media[currentIndex].contentType) ? 'editvideo' : 'editphoto'
        }-close`}
      />

      {/* <>------ Body -------</> */}
      <Body
        currentIndex={currentIndex}
        prevSlide={prevSlide}
        nextSlide={nextSlide}
        dataTestId={`feed-${
          isVideo(media[currentIndex].contentType) ? 'editvideo' : 'editphoto'
        }`}
      />

      {/* {<> -------- Footer --------</>} */}
      {media[currentIndex].type === 'VIDEO' && (
        <div className="flex justify-between w-full items-center px-6 py-2">
          <div className="flex items-center">
            <div className="text-xs font-bold mr-3">Cover image:</div>
            <Button
              label="Upload image"
              leftIcon="exportOutline"
              leftIconClassName="mr-1"
              iconStroke={twConfig.theme.colors.neutral['900']}
              variant={ButtonVariant.Secondary}
              size={ButtonSize.Small}
              onClick={() => uploadCoverImageRef.current?.click()}
              dataTestId={`feed-editvideo-uploadimage`}
            />
            {(coverImageMap.find(
              (map) => map.videoName === media[currentIndex].name,
            ) ||
              media[currentIndex]?.coverImage?.original) && (
              <div className="flex items-center ml-2 font-bold text-sm text-primary-500 px-4 py-2 border border-neutral-200 rounded-19xl">
                <div>
                  {/* {
                    coverImageMap.find(
                      (map) => map.videoName === media[currentIndex].name,
                    )?.coverImageName
                  } */}
                  cover-image.png
                </div>
                <div
                  className="flex items-center ml-2 cursor-pointer"
                  onClick={() => {
                    deleteCoverImageMap(
                      coverImageMap.find(
                        (map) => map.videoName === media[currentIndex].name,
                      ) || {
                          videoName: media[currentIndex].name,
                          coverImageName: '',
                        } ||
                        null,
                    );
                  }}
                >
                  <Icon
                    name="closeCircle"
                    size={16}
                    stroke={twConfig.theme.colors.neutral['900']}
                  />
                </div>
              </div>
            )}
          </div>
          {/* <div className="flex items-center">
            <div className="text-xs font-bold mr-3">Sound:</div>
            <SwitchToggle color="bg-primary-500" />
          </div> */}
        </div>
      )}
      <Footer
        currentIndex={currentIndex}
        changeInputImgRef={changeInputImgRef}
        changeInputVideoRef={changeInputVideoRef}
        dataTestId={`feed-${
          isVideo(media[currentIndex].contentType) ? 'editvideo' : 'editphoto'
        }`}
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
      <input
        type="file"
        className="hidden"
        ref={changeInputVideoRef}
        accept="video/*"
        onChange={(e) => {
          if (e.target.files?.length) {
            replaceMedia(
              currentIndex,
              Array.prototype.slice.call(e.target.files)[0],
            );
          }
        }}
      />
      <input
        type="file"
        className="hidden"
        ref={uploadCoverImageRef}
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.length) {
            const fileName = `id-${Math.random().toString(16).slice(2)}-${
              e.target.files[0].name
            }`;
            setUploads(
              Array.prototype.slice
                .call(e.target.files)
                .map(
                  (eachFile: File) =>
                    new File([eachFile], fileName, { type: eachFile.type }),
                ),
              true,
            );
            updateCoverImageMap({
              videoName: media[currentIndex].name,
              coverImageName: fileName,
              blobUrl: getBlobUrl(e.target.files[0]),
            });
          }
        }}
      />
    </>
  );
};

export default EditMedia;
