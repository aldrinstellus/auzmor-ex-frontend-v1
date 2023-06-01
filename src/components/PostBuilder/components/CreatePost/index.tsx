import React, { useContext, useMemo, useRef } from 'react';
import { CreatePostContext, IEditorValue } from 'contexts/CreatePostContext';
import ReactQuill from 'react-quill';
import { IPost } from 'queries/post';
import Header from 'components/ModalHeader';
import Body from './Body';
import Footer from './Footer';

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
  const { inputImgRef, inputVideoRef, setUploads, clearPostContext } =
    useContext(CreatePostContext);

  return (
    <>
      <Header
        title="Create a post"
        onClose={() => {
          clearPostContext();
          closeModal && closeModal();
        }}
        closeBtnDataTestId={`${dataTestId}-closeicon`}
      />
      <Body data={data} ref={quillRef} dataTestId={dataTestId} />
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
          if (e.target.files?.length) {
            // setUploads(Array.prototype.slice.call(e.target.files));
            setUploads(
              Array.prototype.slice
                .call(e.target.files)
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
          }
        }}
        multiple
      />
      <input
        type="file"
        className="hidden"
        ref={inputVideoRef}
        accept="video/*"
        onChange={(e) => {
          if (e.target.files?.length) {
            setUploads(
              Array.prototype.slice
                .call(e.target.files)
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
            // setUploads(Array.prototype.slice.call(e.target.files));
          }
        }}
        multiple
      />
    </>
  );
};

export default CreatePost;
