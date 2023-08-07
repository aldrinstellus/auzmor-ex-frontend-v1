import React, { useContext, useEffect, useRef } from 'react';
import {
  CreatePostContext,
  IEditorValue,
  IMG_FILE_SIZE_LIMIT,
  MEDIA_LIMIT,
  MediaValidationError,
  VIDEO_FILE_SIZE_LIMIT,
} from 'contexts/CreatePostContext';
import ReactQuill from 'react-quill';
import { IPost } from 'queries/post';
import Header from 'components/ModalHeader';
import Body from './Body';
import Footer from './Footer';
import { validImageTypes, validVideoTypes } from 'queries/files';
import { hideEmojiPalette } from 'utils/misc';

interface ICreatePostProps {
  closeModal: () => void;
  handleSubmitPost: (content: IEditorValue, files: File[]) => void;
  data?: IPost;
  isLoading?: boolean;
  dataTestId?: string;
}

const CreatePost: React.FC<ICreatePostProps> = ({
  data,
  closeModal,
  handleSubmitPost,
  isLoading = false,
  dataTestId,
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const {
    inputImgRef,
    inputVideoRef,
    setUploads,
    clearPostContext,
    media,
    setMediaValidationErrors,
    mediaValidationErrors,
  } = useContext(CreatePostContext);

  useEffect(() => () => hideEmojiPalette());

  return (
    <div
      onClick={(e) => {
        const ele = e.target as HTMLElement;
        if (
          !!!ele?.classList.contains('ql-emoji') &&
          !!!(ele.parentNode?.parentNode as Element).classList.contains(
            'ql-emoji',
          ) &&
          !!!(ele.parentNode as Element).classList.contains('ql-emoji')
        ) {
          hideEmojiPalette();
        }
      }}
    >
      <Header
        title="Create a post"
        onClose={() => {
          clearPostContext();
          closeModal && closeModal();
        }}
        closeBtnDataTestId={`${dataTestId}-closeicon`}
      />
      <Body
        data={data}
        ref={quillRef}
        quillRef={quillRef}
        dataTestId={dataTestId}
      />
      <Footer
        isLoading={isLoading}
        quillRef={quillRef}
        handleSubmitPost={handleSubmitPost}
      />
      <input
        type="file"
        className="hidden"
        ref={inputImgRef}
        accept="image/*"
        onChange={(e) => {
          const mediaErrors = [...mediaValidationErrors];
          if (e.target.files?.length) {
            if (
              e.target.files!.length + media.length > MEDIA_LIMIT &&
              !!!mediaValidationErrors.find(
                (errors) =>
                  errors.errorMsg === MediaValidationError.MediaLengthExceed,
              )
            ) {
              mediaErrors.push({
                errorMsg:
                  'The number of images/ videos attached should be 10 or less. Please attach a fewer images/videos and try again later',
                errorType: MediaValidationError.MediaLengthExceed,
              });
            }
            setUploads(
              Array.prototype.slice
                .call(e.target.files)
                .filter((eachFile: File) => {
                  if (
                    !!![...validImageTypes, ...validVideoTypes].includes(
                      eachFile.type,
                    )
                  ) {
                    mediaErrors.push({
                      errorMsg: `File (${eachFile.name}) type not supported. Upload a supported file content`,
                      errorType: MediaValidationError.FileTypeNotSupported,
                      fileName: eachFile.name,
                    });
                    return false;
                  }
                  if (eachFile.type.match('image')) {
                    if (eachFile.size > IMG_FILE_SIZE_LIMIT * 1024 * 1024) {
                      mediaErrors.push({
                        errorType: MediaValidationError.ImageSizeExceed,
                        errorMsg: `The file “${eachFile.name}” you are trying to upload exceeds the 5MB attachment limit. Try uploading a smaller file`,
                        fileName: eachFile.name,
                      });
                      return false;
                    }
                    return true;
                  } else if (eachFile.type.match('video')) {
                    if (
                      eachFile.size >
                      VIDEO_FILE_SIZE_LIMIT * 1024 * 1024 * 1024
                    ) {
                      mediaErrors.push({
                        errorType: MediaValidationError.VideoSizeExceed,
                        errorMsg: `The file “${eachFile.name}” you are trying to upload exceeds the 2GB attachment limit. Try uploading a smaller file`,
                        fileName: eachFile.name,
                      });
                      return false;
                    }
                    return true;
                  }
                })
                .map(
                  (eachFile: File) =>
                    new File(
                      [eachFile],
                      `id-${Math.random().toString(16).slice(2)}-${
                        eachFile.name
                      }`,
                      { type: eachFile.type },
                    ),
                ),
            );
            setMediaValidationErrors([...mediaErrors]);
          }
        }}
        multiple
        data-testid="feed-createpost-uploadphoto"
      />
      <input
        type="file"
        className="hidden"
        ref={inputVideoRef}
        accept={validVideoTypes.join(',')}
        onChange={(e) => {
          const mediaErrors = [...mediaValidationErrors];

          if (e.target.files?.length) {
            if (
              e.target.files!.length + media.length > MEDIA_LIMIT &&
              !!!mediaValidationErrors.find(
                (errors) =>
                  errors.errorMsg === MediaValidationError.MediaLengthExceed,
              )
            ) {
              mediaErrors.push({
                errorMsg:
                  'The number of images/ videos attached should be 10 or less. Please attach a fewer images/videos and try again later',
                errorType: MediaValidationError.MediaLengthExceed,
              });
            }
            setUploads(
              Array.prototype.slice
                .call(e.target.files)
                .filter((eachFile: File) => {
                  if (
                    !!![...validImageTypes, ...validVideoTypes].includes(
                      eachFile.type,
                    )
                  ) {
                    mediaErrors.push({
                      errorMsg: `File (${eachFile.name}) type not supported. Upload a supported file content`,
                      errorType: MediaValidationError.FileTypeNotSupported,
                      fileName: eachFile.name,
                    });
                    return false;
                  }
                  if (eachFile.type.match('image')) {
                    if (eachFile.size > IMG_FILE_SIZE_LIMIT * 1024 * 1024) {
                      mediaErrors.push({
                        errorType: MediaValidationError.ImageSizeExceed,
                        errorMsg: `The file “${eachFile.name}” you are trying to upload exceeds the 5MB attachment limit. Try uploading a smaller file`,
                        fileName: eachFile.name,
                      });
                      return false;
                    }
                    return true;
                  } else if (eachFile.type.match('video')) {
                    if (
                      eachFile.size >
                      VIDEO_FILE_SIZE_LIMIT * 1024 * 1024 * 1024
                    ) {
                      mediaErrors.push({
                        errorType: MediaValidationError.VideoSizeExceed,
                        errorMsg: `The file “${eachFile.name}” you are trying to upload exceeds the 2GB attachment limit. Try uploading a smaller file`,
                        fileName: eachFile.name,
                      });
                      return false;
                    }
                    return true;
                  }
                })
                .map(
                  (eachFile: File) =>
                    new File(
                      [eachFile],
                      `id-${Math.random().toString(16).slice(2)}-${
                        eachFile.name
                      }`,
                      { type: eachFile.type },
                    ),
                ),
            );
            setMediaValidationErrors([...mediaErrors]);
          }
        }}
        multiple
        data-testid="feed-createpost-uploadvideo"
      />
    </div>
  );
};

export default CreatePost;
